import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthWrapper";

interface DocRow {
  id: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  updated_at: string;
  status: string;
}

const formatSize = (bytes?: number | null) => {
  if (!bytes && bytes !== 0) return "-";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${['B','KB','MB','GB','TB'][i]}`;
};

export const DocumentsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    if (!user) { setDocs([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('id, filename, mime_type, size_bytes, created_at, updated_at, status')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Failed to load documents', description: error.message, variant: 'destructive' });
    } else {
      setDocs(data as DocRow[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document and its vectors? This cannot be undone.')) return;
    setBusyId(id);
    const { error } = await supabase.functions.invoke('rag-delete', { body: { document_id: id, delete_file: false } });
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Document and vectors removed.' });
      await load();
    }
    setBusyId(null);
  };

  const handleReindex = async (id: string) => {
    setBusyId(id);
    const { data, error } = await supabase.functions.invoke('rag-reindex', { body: { document_id: id } });
    if (error) {
      toast({ title: 'Reindex failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Reindexed', description: `Chunks: ${data?.chunk_count ?? '-'}` });
      await load();
    }
    setBusyId(null);
  };

  return (
    <Card className="p-6 glass-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your documents</h2>
        <Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
      </div>
      <Table>
        <TableCaption>{docs.length ? '' : (loading ? 'Loading…' : 'No documents yet')}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Size</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d.filename}</TableCell>
              <TableCell className="hidden md:table-cell">{d.mime_type || '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{formatSize(d.size_bytes)}</TableCell>
              <TableCell>{new Date(d.created_at).toLocaleString()}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleReindex(d.id)} disabled={busyId === d.id}>Reindex</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(d.id)} disabled={busyId === d.id}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DocumentsManager;
