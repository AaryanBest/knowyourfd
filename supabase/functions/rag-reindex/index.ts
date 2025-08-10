// supabase/functions/rag-reindex/index.ts
// Reindex an existing document: re-embed, replace Pinecone vectors, and refresh chunk rows
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

async function getPineconeHost(name: string) {
  const apiKey = Deno.env.get('PINECONE_API_KEY');
  if (!apiKey) throw new Error('Missing PINECONE_API_KEY');
  const res = await fetch(`https://api.pinecone.io/indexes/${name}`, { headers: { 'Api-Key': apiKey } });
  if (!res.ok) throw new Error('Pinecone index not found');
  const j = await res.json();
  return j.host as string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const { document_id } = await req.json();
    if (!document_id) return new Response(JSON.stringify({ error: 'Missing document_id' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace('Bearer ', '');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Identify user
    const { data: userRes } = await supabase.auth.getUser(jwt);
    const userId = userRes?.user?.id;
    if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    // Get document and verify ownership
    const { data: doc, error: docErr } = await supabase.from('documents').select('*').eq('id', document_id).single();
    if (docErr || !doc) return new Response(JSON.stringify({ error: docErr?.message || 'Document not found' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    if (doc.user_id !== userId) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    if (!doc.storage_path) return new Response(JSON.stringify({ error: 'Document missing storage_path' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    // Download file
    const { data: fileData, error: dErr } = await supabase.storage.from('fd-docs').download(doc.storage_path);
    if (dErr || !fileData) return new Response(JSON.stringify({ error: dErr?.message || 'Download failed' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    const buffer = await fileData.arrayBuffer();
    const rawText = decodeToText(buffer);
    const cleaned = rawText.replace(/\u0000/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleaned) return new Response(JSON.stringify({ error: 'Could not extract text from file.' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    const chunks = chunkText(cleaned, 1000, 100);
    const { vectors, model } = await embedText(chunks.map((c) => c.content));

    const host = await getPineconeHost('policy-clauses');

    // Delete existing vectors for this doc
    await fetch(`https://${host}/vectors/delete`, {
      method: 'POST',
      headers: { 'Api-Key': Deno.env.get('PINECONE_API_KEY')!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace: userId, deleteAll: false, ids: [], filter: { document_id } }),
    });

    // Upsert new vectors
    const vectorsPayload = chunks.map((c, i) => ({
      id: `${document_id}_${c.index}`,
      values: vectors[i],
      metadata: { user_id: userId, document_id, filename: doc.filename, chunk_index: c.index },
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

    // Refresh chunk rows
    await supabase.from('document_chunks').delete().eq('document_id', document_id);
    const chunkRows = chunks.map((c) => ({
      document_id,
      user_id: userId,
      chunk_index: c.index,
      content: c.content,
      tokens: c.content.length,
      pinecone_id: `${document_id}_${c.index}`,
      metadata: { filename: doc.filename },
    }));
    const { error: chErr } = await supabase.from('document_chunks').insert(chunkRows);
    if (chErr) throw chErr;

    // Update document metadata
    await supabase.from('documents').update({ embedding_model: model, size_bytes: buffer.byteLength }).eq('id', document_id);

    return new Response(JSON.stringify({ ok: true, document_id, chunk_count: chunks.length, embedding_model: model }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (e: any) {
    console.error('rag-reindex error', e);
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
});
