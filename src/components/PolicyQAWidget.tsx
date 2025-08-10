import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClauseMatch {
  snippet: string;
  score: number;
  source?: { document_id?: string; filename?: string; chunk_index?: number };
}

interface QAResponse {
  answer: string;
  covered: boolean;
  conditions?: string[];
  matched_clauses?: ClauseMatch[];
  rationale?: string;
}

export const PolicyQAWidget = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QAResponse | null>(null);
  const [showSources, setShowSources] = useState(true);

  const ask = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("rag-query", { body: { query } });
      if (error) throw error;
      setResult(data as QAResponse);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Query failed", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-lg font-semibold mb-2">Ask your policy</h2>
      <p className="text-sm text-muted-foreground mb-4">Example: “Does this policy cover knee surgery, and what are the conditions?”</p>
        <div className="space-y-3">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question…"
            className="min-h-[100px]"
          />
          <div className="flex items-center gap-2">
            <Button onClick={ask} disabled={loading}>{loading ? "Thinking…" : "Ask"}</Button>
            {result && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (result?.answer) {
                      navigator.clipboard.writeText(result.answer);
                      toast({ title: "Copied", description: "Answer copied to clipboard." });
                    }
                  }}
                >
                  Copy answer
                </Button>
                <Button variant="ghost" onClick={() => setShowSources((s) => !s)}>
                  {showSources ? "Hide sources" : "Show sources"}
                </Button>
              </>
            )}
          </div>
        </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-base font-semibold">Answer</h3>
            <p className="mt-1 whitespace-pre-wrap">{result.answer}</p>
            <div className="mt-2 text-sm"><span className="font-medium">Covered:</span> {result.covered ? "Yes" : "No / Not clear"}</div>
            {result.conditions && result.conditions.length > 0 && (
              <ul className="list-disc pl-6 mt-2 text-sm">
                {result.conditions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
          </div>
          {result.matched_clauses && result.matched_clauses.length > 0 && showSources && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Matched Clauses</h4>
              <div className="space-y-2">
                {result.matched_clauses.map((m, i) => (
                  <div key={i} className="p-3 rounded-md bg-muted/50">
                    <div className="text-xs text-muted-foreground">Score: {m.score.toFixed(3)} {m.source?.filename ? `• ${m.source.filename}` : ""}</div>
                    <div className="text-sm mt-1 whitespace-pre-wrap">{m.snippet}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.rationale && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Rationale:</span> {result.rationale}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PolicyQAWidget;
