import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthWrapper";

export const DocumentIngestor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to upload documents.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("fd-docs").upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase.functions.invoke("rag-index", {
        body: { path, filename: file.name, mime_type: file.type },
      });
      if (error) throw error;

      toast({ title: "Indexed", description: `Chunks: ${data?.chunk_count ?? "-"}, Model: ${data?.embedding_model ?? "-"}` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Upload/Index failed", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-lg font-semibold mb-2">Upload policy/contract</h2>
      <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, EML supported. We will index clauses for semantic search.</p>
      <label className="inline-flex items-center gap-3">
        <Input
          type="file"
          accept=".pdf,.docx,.eml,.txt"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Button type="button" disabled className="hidden">Upload</Button>
      </label>
      {uploading && <div className="text-sm text-muted-foreground mt-3">Processing…</div>}
    </Card>
  );
};

export default DocumentIngestor;
