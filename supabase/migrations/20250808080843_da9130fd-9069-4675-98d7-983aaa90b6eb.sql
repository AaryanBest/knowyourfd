-- Create storage bucket for FD documents
insert into storage.buckets (id, name, public)
values ('fd-docs', 'fd-docs', false)
on conflict (id) do nothing;

-- Policies for fd-docs bucket
-- Allow users to view their own documents
create policy if not exists "Users can view their own FD docs"
  on storage.objects
  for select
  using (
    bucket_id = 'fd-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to upload their own documents
create policy if not exists "Users can upload their own FD docs"
  on storage.objects
  for insert
  with check (
    bucket_id = 'fd-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own documents
create policy if not exists "Users can update their own FD docs"
  on storage.objects
  for update
  using (
    bucket_id = 'fd-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own documents
create policy if not exists "Users can delete their own FD docs"
  on storage.objects
  for delete
  using (
    bucket_id = 'fd-docs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );