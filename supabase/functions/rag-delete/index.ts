// supabase/functions/rag-delete/index.ts
// Delete a document: remove Pinecone vectors, DB chunks, document row, and optionally the file
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { document_id, delete_file = false } = await req.json();
    if (!document_id) return new Response(JSON.stringify({ error: 'Missing document_id' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace('Bearer ', '');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: userRes } = await supabase.auth.getUser(jwt);
    const userId = userRes?.user?.id;
    if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    // Fetch document and verify ownership
    const { data: doc, error: docErr } = await supabase.from('documents').select('*').eq('id', document_id).single();
    if (docErr || !doc) return new Response(JSON.stringify({ error: docErr?.message || 'Document not found' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    if (doc.user_id !== userId) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

    // Delete vectors in Pinecone by filter
    const host = await getPineconeHost('policy-clauses');
    const delRes = await fetch(`https://${host}/vectors/delete`, {
      method: 'POST',
      headers: { 'Api-Key': Deno.env.get('PINECONE_API_KEY')!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace: userId, deleteAll: false, ids: [], filter: { document_id: document_id } }),
    });
    if (!delRes.ok) {
      const t = await delRes.text();
      return new Response(JSON.stringify({ error: `Pinecone delete failed: ${t}` }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // Delete DB rows
    await supabase.from('document_chunks').delete().eq('document_id', document_id);
    await supabase.from('documents').delete().eq('id', document_id);

    // Optionally delete the file
    if (delete_file && doc.storage_path) {
      await supabase.storage.from('fd-docs').remove([doc.storage_path]);
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (e: any) {
    console.error('rag-delete error', e);
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
});
