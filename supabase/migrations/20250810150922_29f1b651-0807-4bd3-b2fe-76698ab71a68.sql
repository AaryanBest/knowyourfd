-- Add storage_path to documents and improve indexes and triggers
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Helpful index for listing
CREATE INDEX IF NOT EXISTS idx_documents_user_created
ON public.documents (user_id, created_at DESC);

-- Ensure updated_at auto-updates on update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_documents_updated_at'
  ) THEN
    CREATE TRIGGER trg_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;