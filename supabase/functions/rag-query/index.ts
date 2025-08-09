// supabase/functions/rag-query/index.ts
// Embed a user query, search Pinecone, and answer with Gemini in structured JSON

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function embedQuery(text: string) {
  const key = Deno.env.get('GOOGLE_GEMINI_API_KEY');
  if (!key) throw new Error('Missing GOOGLE_GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: { parts: [{ text }] } }),
  });
  const j = await res.json();
  const v = j?.embedding?.values || j?.embeddings?.[0]?.values;
  if (!v) throw new Error('Failed to embed query');
  return v as number[];
}

async function getPineconeHost(name: string) {
  const apiKey = Deno.env.get('PINECONE_API_KEY');
  if (!apiKey) throw new Error('Missing PINECONE_API_KEY');
  const res = await fetch(`https://api.pinecone.io/indexes/${name}`, { headers: { 'Api-Key': apiKey } });
  if (!res.ok) throw new Error('Pinecone index not found');
  const j = await res.json();
  return j.host as string;
}

async function answerWithGemini(contexts: { snippet: string; source: any; score: number }[], question: string) {
  const key = Deno.env.get('GOOGLE_GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  const system = `You are an insurance policy assistant. Use only the provided context snippets to answer.
Return STRICT JSON with keys: answer (string), covered (boolean), conditions (string[]), matched_clauses (array of {snippet, score, source}), rationale (string).
If insufficient info, set covered=false and explain.`;

  const contextText = contexts
    .map((c, i) => `Clause ${i + 1} (score ${c.score.toFixed(3)}):\n${c.snippet}`)
    .join("\n\n");

  const body = {
    contents: [
      { role: 'user', parts: [{ text: `${system}\n\nQuestion: ${question}\n\nContext:\n${contextText}\n\nRespond with pure JSON only.` }] }
    ],
  } as any;

  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json();
  const text: string = j?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try {
    return JSON.parse(text);
  } catch {
    return { answer: text, covered: false, conditions: [], matched_clauses: contexts, rationale: 'Model did not return valid JSON; raw text returned.' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const start = Date.now();
  try {
    const { query } = await req.json();
    if (!query) return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace('Bearer ', '');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: userRes } = await supabase.auth.getUser(jwt);
    const userId = userRes?.user?.id;
    if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    const vector = await embedQuery(query);
    const indexName = 'policy-clauses';
    const host = await getPineconeHost(indexName);

    const topK = 8;
    const qRes = await fetch(`https://${host}/query`, {
      method: 'POST',
      headers: { 'Api-Key': Deno.env.get('PINECONE_API_KEY')!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ vector, topK, includeMetadata: true, namespace: userId, filter: {} }),
    });
    const qJson = await qRes.json();
    const matches = (qJson?.matches || []).map((m: any) => ({
      snippet: m?.metadata?.snippet || m?.metadata?.content || '',
      score: m?.score || 0,
      source: {
        document_id: m?.metadata?.document_id,
        filename: m?.metadata?.filename,
        chunk_index: m?.metadata?.chunk_index
      },
    }));

    // Build contexts by fetching chunk text from DB for better answers
    const ids = (qJson?.matches || []).map((m: any) => m?.metadata?.document_id).filter(Boolean);
    let contexts: { snippet: string; score: number; source: any }[] = [];
    if (qJson?.matches?.length) {
      const pineIds = (qJson.matches as any[]).map((m) => m.id);
      // Join with document_chunks by pinecone_id
      const { data: rows } = await supabase.from('document_chunks').select('pinecone_id, content, document_id, chunk_index, metadata, user_id').in('pinecone_id', pineIds);
      contexts = (qJson.matches as any[]).map((m: any) => {
        const row = rows?.find((r: any) => r.pinecone_id === m.id);
        return {
          snippet: row?.content || '',
          score: m.score || 0,
          source: { document_id: row?.document_id, filename: row?.metadata?.filename, chunk_index: row?.chunk_index },
        };
      });
    }

    const answer = await answerWithGemini(contexts, query);

    // Log query
    await supabase.from('query_logs').insert({
      user_id: userId,
      query_text: query,
      answer: answer,
      matched_clauses: contexts,
      duration_ms: Date.now() - start,
      match_count: contexts.length,
    });

    return new Response(JSON.stringify(answer), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (e: any) {
    console.error('rag-query error', e);
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
});
