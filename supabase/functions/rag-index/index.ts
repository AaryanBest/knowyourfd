// supabase/functions/rag-index/index.ts
// Ingest a document from Supabase Storage, chunk, embed with Gemini, and upsert to Pinecone
// CORS enabled; requires GOOGLE_GEMINI_API_KEY and PINECONE_API_KEY secrets

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function decodeToText(buffer: ArrayBuffer): string {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  } catch {
    return '';
  }
}

function chunkText(text: string, chunkSize = 1000, overlap = 100) {
  const chunks: { content: string; index: number }[] = [];
  let i = 0, idx = 0;
  while (i < text.length) {
    const slice = text.slice(i, i + chunkSize);
    chunks.push({ content: slice, index: idx++ });
    i += chunkSize - overlap;
  }
  return chunks;
}

async function ensurePineconeIndex(name: string, dimension: number) {
  const apiKey = Deno.env.get('PINECONE_API_KEY');
  if (!apiKey) throw new Error('Missing PINECONE_API_KEY');
  const ctrlBase = 'https://api.pinecone.io';

  // Try describe
  let host = '';
  {
    const res = await fetch(`${ctrlBase}/indexes/${name}`, {
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const info = await res.json();
      host = info.host as string;
    }
  }
  if (!host) {
    // Create serverless index (defaults to aws/us-east-1)
    const createRes = await fetch(`${ctrlBase}/indexes`, {
      method: 'POST',
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        dimension,
        metric: 'cosine',
        spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
      }),
    });
    if (!createRes.ok) {
      const txt = await createRes.text();
      throw new Error(`Failed to create Pinecone index: ${txt}`);
    }
    // Poll describe until host available
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const d = await fetch(`${ctrlBase}/indexes/${name}`, { headers: { 'Api-Key': apiKey } });
      if (d.ok) {
        const j = await d.json();
        if (j.host) { host = j.host; break; }
      }
    }
  }
  if (!host) throw new Error('Pinecone index host unavailable');
  return host as string;
}

async function embedText(texts: string[]) {
  const key = Deno.env.get('GOOGLE_GEMINI_API_KEY');
  if (!key) throw new Error('Missing GOOGLE_GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${key}`;
  const vectors: number[][] = [];
  for (const t of texts) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { parts: [{ text: t }] } }),
    });
    const j = await res.json();
    const v = j?.embedding?.values || j?.embeddings?.[0]?.values;
    if (!v) throw new Error('Failed to get embedding');
    vectors.push(v as number[]);
  }
  return { vectors, model: 'text-embedding-004', dimension: (vectors[0] || []).length };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { path, filename, mime_type } = await req.json();
    if (!path || !filename) {
      return new Response(JSON.stringify({ error: 'Missing path or filename' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace('Bearer ', '');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Identify user
    const { data: userRes } = await supabase.auth.getUser(jwt);
    const userId = userRes?.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // Download file
    const { data: fileData, error: dErr } = await supabase.storage.from('fd-docs').download(path);
    if (dErr || !fileData) {
      return new Response(JSON.stringify({ error: dErr?.message || 'Download failed' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const buffer = await fileData.arrayBuffer();
    const rawText = decodeToText(buffer);
    const cleaned = rawText.replace(/\u0000/g, ' ').replace(/\s+/g, ' ').trim();

    if (!cleaned) {
      return new Response(JSON.stringify({ error: 'Could not extract text from file. Ensure it is text-based.' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const chunks = chunkText(cleaned, 1000, 100);
    const { vectors, model, dimension } = await embedText(chunks.map((c) => c.content));

    const indexName = 'policy-clauses';
    const host = await ensurePineconeIndex(indexName, dimension);

    // Insert document row
    const { data: docRow, error: docErr } = await supabase
      .from('documents')
      .insert({ user_id: userId, filename, mime_type, size_bytes: buffer.byteLength, source: 'upload', embedding_model: model })
      .select('id')
      .single();
    if (docErr) throw docErr;

    // Upsert vectors to Pinecone (namespace by user)
    const vectorsPayload = chunks.map((c, i) => ({
      id: `${docRow.id}_${c.index}`,
      values: vectors[i],
      metadata: { user_id: userId, document_id: docRow.id, filename, chunk_index: c.index },
    }));

    const upsertRes = await fetch(`https://${host}/vectors/upsert`, {
      method: 'POST',
      headers: { 'Api-Key': Deno.env.get('PINECONE_API_KEY')!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace: userId, vectors: vectorsPayload }),
    });
    if (!upsertRes.ok) {
      const t = await upsertRes.text();
      throw new Error(`Pinecone upsert failed: ${t}`);
    }

    // Insert chunks table rows
    const chunkRows = chunks.map((c) => ({
      document_id: docRow.id,
      user_id: userId,
      chunk_index: c.index,
      content: c.content,
      tokens: c.content.length,
      pinecone_id: `${docRow.id}_${c.index}`,
      metadata: { filename },
    }));
    const { error: chErr } = await supabase.from('document_chunks').insert(chunkRows);
    if (chErr) throw chErr;

    return new Response(
      JSON.stringify({ ok: true, document_id: docRow.id, chunk_count: chunks.length, embedding_model: model }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (e: any) {
    console.error('rag-index error', e);
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
});
