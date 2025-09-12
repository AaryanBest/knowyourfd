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
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Policy Q&A – Clause Retrieval
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your policy and ask natural language questions. We retrieve matching clauses and respond with structured answers.
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-12">
          <section className="grid md:grid-cols-2 gap-8">
            <DocumentIngestor />
            <PolicyQAWidget />
          </section>

          <section>
            <DocumentsManager />
          </section>

          <section>
            <Card className="p-6 bg-muted/30 border-muted/50">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Note:</strong> Initial version supports PDF (text-based) and EML reliably; DOCX support will be refined next.
              </p>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PolicyQA;
