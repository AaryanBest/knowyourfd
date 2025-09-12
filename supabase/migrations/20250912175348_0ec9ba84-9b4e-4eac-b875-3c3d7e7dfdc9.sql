-- 1) Add user ownership column (nullable for safe migration)
ALTER TABLE public.fixed_deposits
ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2) Ensure RLS is enabled (idempotent)
ALTER TABLE public.fixed_deposits ENABLE ROW LEVEL SECURITY;

-- 3) Drop overly permissive public policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'fixed_deposits'
      AND policyname = 'Allow public read access to FDs'
  ) THEN
    DROP POLICY "Allow public read access to FDs" ON public.fixed_deposits;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'fixed_deposits'
      AND policyname = 'Allow public insert access to FDs'
  ) THEN
    DROP POLICY "Allow public insert access to FDs" ON public.fixed_deposits;
  END IF;
END $$;

-- 4) Create least-privilege per-user policies
CREATE POLICY IF NOT EXISTS "Users can view their own FDs"
ON public.fixed_deposits
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own FDs"
ON public.fixed_deposits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own FDs"
ON public.fixed_deposits
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own FDs"
ON public.fixed_deposits
FOR DELETE
USING (auth.uid() = user_id);

-- 5) Helpful index for access patterns
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_id ON public.fixed_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_client ON public.fixed_deposits(user_id, client_id);

-- Note: Existing rows with NULL user_id will no longer be readable. After validating, you may backfill and later set NOT NULL.