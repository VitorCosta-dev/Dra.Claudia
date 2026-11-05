-- Private, administrator-only PDF archive for clinical questionnaires.
-- Run once after 20261021000000_clinical_history_and_consent.sql.

create table public.clinical_documents (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.patients(user_id) on delete cascade,
  document_type text not null default 'clinical-questionnaire'
    check (document_type = 'clinical-questionnaire'),
  questionnaire_version text not null,
  questionnaire_submitted_at timestamptz not null,
  storage_path text not null unique,
  document_hash text not null check (document_hash ~ '^[a-f0-9]{64}$'),
  generated_by uuid not null references auth.users(id),
  generated_at timestamptz not null default now(),
  unique (user_id, questionnaire_version, questionnaire_submitted_at)
);

create index clinical_documents_user_id_idx
  on public.clinical_documents (user_id, generated_at desc);

alter table public.clinical_documents enable row level security;
revoke all on public.clinical_documents from anon, authenticated;
grant select, insert, update on public.clinical_documents to authenticated;
grant usage, select on sequence public.clinical_documents_id_seq to authenticated;

create policy "Administrators manage clinical documents"
  on public.clinical_documents for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (
    generated_by = (select auth.uid())
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('clinical-documents', 'clinical-documents', false, 5242880, array['application/pdf'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Administrators read clinical PDFs"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'clinical-documents'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

create policy "Administrators create clinical PDFs"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'clinical-documents'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

create policy "Administrators replace clinical PDFs"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'clinical-documents'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  )
  with check (
    bucket_id = 'clinical-documents'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );
