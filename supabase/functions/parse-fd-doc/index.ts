// supabase/functions/parse-fd-doc/index.ts
// Parse FD PDFs from Supabase Storage and extract key fields. Uses simple regex-based parsing.
// CORS enabled.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function decodeToText(buffer: ArrayBuffer): string {
  try {
    // Try UTF-8 decode (works for text-based PDFs or if user uploads a text doc)
    return new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  } catch {
    return '';
  }
}

function extractFields(text: string) {
  const cleaned = text.replace(/\u0000/g, ' ').replace(/\s+/g, ' ').trim();
  const find = (regex: RegExp) => {
    const m = cleaned.match(regex);
    return m ? m[1]?.trim() : undefined;
  };

  // Very lenient patterns to match typical FD receipts/letters
  const name = find(/(?:Name|Holder|Account\s*Holder)[:\-\s]*([A-Za-z .]+?)(?:,|\n|\r|\s{2,}|Client|ID|\d|$)/i);
  const client_id = find(/(?:Client\s*ID|Customer\s*ID|CIF|Account\s*No\.?|FD\s*No\.?)[:\-\s]*([A-Za-z0-9\-\/]+)/i);
  const rateRaw = find(/(?:Interest\s*Rate|ROI|Rate\s*of\s*Interest)[:\-\s]*([0-9]+(?:\.[0-9]+)?)\s*%/i);
  const tenureYearsRaw = find(/(?:Tenure|Duration|Term)[:\-\s]*([0-9]+)\s*(?:Years?|Yrs?)/i) ||
                         find(/(?:Tenure|Duration|Term)[:\-\s]*([0-9]+)\s*(?:Months?|Mos?)/i);
  const amountRaw = find(/(?:Amount|Deposit|Principal)[:\-\s]*(?:INR|Rs\.?|₹)?\s*([0-9,]+(?:\.[0-9]+)?)/i);
  const maturityDate = find(/(?:Maturity\s*Date|Matures\s*On)[:\-\s]*([0-9]{1,2}[\-\/.][0-9]{1,2}[\-\/.][0-9]{2,4}|[A-Za-z]{3,9}\s+[0-9]{1,2},?\s+[0-9]{2,4})/i);

  let interest_rate: number | undefined;
  if (rateRaw) interest_rate = parseFloat(rateRaw);

  let tenure_years: number | undefined;
  if (tenureYearsRaw) {
    const n = parseInt(tenureYearsRaw, 10);
    // If months pattern matched (heuristic)
    if (/months?|mos?/i.test(cleaned)) {
      tenure_years = Math.max(1, Math.round(n / 12));
    } else {
      tenure_years = n;
    }
  }

  let original_amount: number | undefined;
  if (amountRaw) original_amount = parseFloat(amountRaw.replace(/,/g, ''));

  return {
    name,
    client_id,
    interest_rate,
    tenure_years,
    original_amount,
    maturity_date: maturityDate,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { path } = await req.json();
    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing path' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage.from('fd-docs').download(path);
    if (downloadError || !fileData) {
      return new Response(JSON.stringify({ error: downloadError?.message || 'Failed to download file' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const buffer = await fileData.arrayBuffer();
    const text = decodeToText(buffer);

    const extracted = extractFields(text);

    // Basic summary string
    const summaryParts: string[] = [];
    if (extracted.name) summaryParts.push(`Name: ${extracted.name}`);
    if (extracted.client_id) summaryParts.push(`Client ID: ${extracted.client_id}`);
    if (typeof extracted.interest_rate === 'number') summaryParts.push(`Interest Rate: ${extracted.interest_rate}% p.a.`);
    if (typeof extracted.tenure_years === 'number') summaryParts.push(`Tenure: ${extracted.tenure_years} years (approx)`);
    if (typeof extracted.original_amount === 'number') summaryParts.push(`Amount: ₹${(extracted.original_amount).toLocaleString('en-IN')}`);
    if (extracted.maturity_date) summaryParts.push(`Maturity Date: ${extracted.maturity_date}`);

    const payload = {
      extracted,
      summary: summaryParts.length ? summaryParts.join('\n') : 'We could not confidently extract details. Please ensure the PDF is text-based or try another document.'
    };

    return new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
});
