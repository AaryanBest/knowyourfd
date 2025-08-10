import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import DocumentIngestor from "@/components/DocumentIngestor";
import PolicyQAWidget from "@/components/PolicyQAWidget";
import DocumentsManager from "@/components/DocumentsManager";

const PolicyQA = () => {
  useEffect(() => {
    document.title = "Policy Q&A | Clause Retrieval";
  }, []);

  return (
    <>
      <header className="py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Policy Q&A – Clause Retrieval</h1>
          <p className="text-muted-foreground mt-2">Upload your policy and ask natural language questions. We retrieve matching clauses and respond with structured answers.</p>
        </div>
      </header>

      <main className="pb-16">
        <section className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <DocumentIngestor />
          <PolicyQAWidget />
        </section>

        <section className="max-w-5xl mx-auto px-4 mt-10">
          <DocumentsManager />
        </section>

        <section className="max-w-5xl mx-auto px-4 mt-10">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Note: Initial version supports PDF (text-based) and EML reliably; DOCX support will be refined next.
            </p>
          </Card>
        </section>
      </main>
    </>
  );
};

export default PolicyQA;
