-- Final RLS, MFA and audit hardening review (2026-11-21).
-- Apply after every earlier migration. It is intentionally idempotent so the
-- production project can receive the same final state as a clean installation.

begin;

-- Keep the consent schema self-contained even when production previously
-- received the snapshot columns through an emergency SQL correction.
alter table public.procedure_consents
  add column if not exists accepted_questionnaire_id bigint,
  add column if not exists term_title_snapshot text,
  add column if not exists term_version_snapshot text,
  add column if not exists term_content_snapshot text,
  add column if not exists signer_address text,
  add column if not exists signer_street text,
  add column if not exists signer_number text,
  add column if not exists signer_postal_code text;

update public.procedure_consents c
set term_title_snapshot = coalesce(c.term_title_snapshot, t.title),
    term_version_snapshot = coalesce(c.term_version_snapshot, t.version),
    term_content_snapshot = coalesce(c.term_content_snapshot, t.content)
from public.procedure_terms t
where t.id = c.procedure_term_id
  and (c.term_title_snapshot is null
    or c.term_version_snapshot is null
    or c.term_content_snapshot is null);

alter table public.procedure_consents
  alter column term_title_snapshot set not null,
  alter column term_version_snapshot set not null,
  alter column term_content_snapshot set not null;

do $migration$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'procedure_consents_accepted_questionnaire_id_fkey'
      and conrelid = 'public.procedure_consents'::regclass
  ) then
    alter table public.procedure_consents
      add constraint procedure_consents_accepted_questionnaire_id_fkey
      foreign key (accepted_questionnaire_id)
      references public.procedure_questionnaires(id);
  end if;
end
$migration$;

-- Only one current term can be offered for a procedure. If a previous manual
-- import left duplicates active, retain the newest and preserve the older rows.
with ranked_active_terms as (
  select id,
         row_number() over (
           partition by procedure_id
           order by created_at desc, id desc
         ) as position
  from public.procedure_terms
  where active = true
)
update public.procedure_terms t
set active = false
from ranked_active_terms r
where r.id = t.id
  and r.position > 1;

create unique index if not exists one_active_term_per_procedure
  on public.procedure_terms (procedure_id)
  where active = true;

-- Record the version acknowledged at signup for new accounts. Existing rows
-- remain nullable because the migration must not invent historical consent.
alter table public.patients
  add column if not exists privacy_policy_version text,
  add column if not exists privacy_policy_accepted_at timestamptz;

create or replace function public.create_patient_on_signup()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  patient_name text := trim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  patient_cpf text := regexp_replace(coalesce(new.raw_user_meta_data ->> 'cpf', ''), '[^0-9]', '', 'g');
  patient_birth_date_text text := coalesce(new.raw_user_meta_data ->> 'birth_date', '');
  patient_birth_date date;
  patient_phone text := regexp_replace(coalesce(new.raw_user_meta_data ->> 'phone', ''), '[^0-9]', '', 'g');
  patient_privacy_version text := trim(coalesce(new.raw_user_meta_data ->> 'privacy_policy_version', ''));
begin
  if char_length(patient_name) not between 2 and 150
     or not public.valid_cpf(patient_cpf)
     or patient_birth_date_text !~ '^\d{4}-\d{2}-\d{2}$'
     or patient_phone !~ '^[0-9]{10,13}$'
     or char_length(patient_privacy_version) not between 3 and 80 then
    raise exception 'Invalid patient registration' using errcode = '22023';
  end if;

  patient_birth_date := patient_birth_date_text::date;
  if patient_birth_date < date '1900-01-01' or patient_birth_date > current_date then
    raise exception 'Invalid patient birth date' using errcode = '22023';
  end if;

  insert into public.patients (
    user_id, full_name, email, cpf, birth_date, phone,
    privacy_policy_version, privacy_policy_accepted_at
  ) values (
    new.id, patient_name, lower(new.email), patient_cpf, patient_birth_date,
    patient_phone, patient_privacy_version, now()
  );
  return new;
end;
$$;

alter function public.create_patient_on_signup() owner to postgres;
alter function public.create_patient_on_signup() set row_security = off;
revoke all on function public.create_patient_on_signup() from public, anon, authenticated;

-- Canonical LGPD request ledger. Patients submit through a validated RPC;
-- administrators review it only after an AAL2 session.
create table if not exists public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.patients(user_id) on delete cascade,
  request_type text not null,
  details text not null,
  status text not null default 'received',
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id)
);

alter table public.privacy_requests
  add column if not exists resolution_notes text,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists resolved_at timestamptz,
  add column if not exists resolved_by uuid references auth.users(id);

alter table public.privacy_requests
  drop constraint if exists privacy_requests_request_type_check,
  drop constraint if exists privacy_requests_details_length_check,
  drop constraint if exists privacy_requests_status_check,
  drop constraint if exists privacy_requests_resolution_notes_length_check;

alter table public.privacy_requests
  add constraint privacy_requests_request_type_check
    check (request_type in ('access', 'correction', 'deletion', 'revocation', 'other')),
  add constraint privacy_requests_details_length_check
    check (char_length(trim(details)) between 10 and 2000),
  add constraint privacy_requests_status_check
    check (status in ('received', 'in_review', 'completed', 'rejected')),
  add constraint privacy_requests_resolution_notes_length_check
    check (resolution_notes is null or char_length(resolution_notes) <= 4000);

create index if not exists privacy_requests_user_created_idx
  on public.privacy_requests (user_id, created_at desc);
create index if not exists privacy_requests_status_created_idx
  on public.privacy_requests (status, created_at desc);

-- Required procedure-specific answers are kept server-side so a modified
-- browser cannot omit questions that the visible form marks as mandatory.
create table if not exists public.procedure_questionnaire_fields (
  procedure_id text not null references public.procedures(id) on delete cascade,
  field_name text not null check (field_name ~ '^[a-z0-9_]+$'),
  primary key (procedure_id, field_name)
);

insert into public.procedure_questionnaire_fields (procedure_id, field_name)
select p.id, required.field_name
from public.procedures p
cross join lateral unnest(
  case
    when p.id in (
      'toxina-botulinica-a', 'preenchimento-facial', 'preenchimento-labial',
      'bioestimulador-colageno', 'skinbooster', 'harmonizacao-full-face',
      'intradermoterapia-facial'
    ) then array[
      'facial_previous', 'facial_product_reaction', 'facial_active_lesion',
      'injectable_anticoagulants', 'injectable_filler'
    ]::text[]
    when p.id = 'ultrassom-micro-macrofocado' then array[
      'facial_previous', 'facial_product_reaction', 'facial_active_lesion',
      'body_previous', 'body_goal', 'body_circulation', 'body_sensitivity'
    ]::text[]
    when p.id = 'depilacao-a-laser' then array[
      'facial_previous', 'facial_product_reaction', 'facial_active_lesion',
      'laser_sun', 'laser_hair_removal'
    ]::text[]
    when p.id in (
      'limpeza-de-pele', 'peeling-quimico', 'jato-de-plasma',
      'remocao-de-sinais', 'laser-lavieen', 'microagulhamento'
    ) then array[
      'facial_previous', 'facial_product_reaction', 'facial_active_lesion'
    ]::text[]
    when p.id in (
      'lipoenzimatica', 'intradermoterapia-corporal', 'eletroterapia-estetica',
      'peim', 'criolipolise', 'hidrolipoclasia'
    ) then array[
      'body_previous', 'body_goal', 'body_circulation', 'body_sensitivity'
    ]::text[]
    when p.id in ('microagulhamento-capilar', 'mesoterapia-capilar') then array[
      'hair_complaint', 'hair_diagnosis', 'hair_chemical', 'hair_medication'
    ]::text[]
    else array[]::text[]
  end
) as required(field_name)
on conflict (procedure_id, field_name) do nothing;

-- Append-only administrative audit trail. It is deliberately unavailable to
-- the browser roles and remains accessible to the database owner/service role.
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  admin_user_id uuid not null references auth.users(id),
  action text not null check (char_length(action) between 3 and 100),
  target_user_id uuid references auth.users(id),
  target_record_id text,
  session_id text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  occurred_at timestamptz not null default now()
);

create index if not exists admin_audit_log_admin_time_idx
  on public.admin_audit_log (admin_user_id, occurred_at desc);
create index if not exists admin_audit_log_target_time_idx
  on public.admin_audit_log (target_user_id, occurred_at desc);

-- Security-definer helper breaks policy recursion on public.admins and makes
-- the MFA requirement enforceable in PostgreSQL, not only in React.
create or replace function public.is_current_admin(p_require_aal2 boolean default false)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
  select exists (
    select 1
    from public.admins a
    where a.user_id = (select auth.uid())
  )
  and (
    not p_require_aal2
    or coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  );
$$;

alter function public.is_current_admin(boolean) owner to postgres;
alter function public.is_current_admin(boolean) set row_security = off;
revoke all on function public.is_current_admin(boolean) from public, anon, authenticated;
grant execute on function public.is_current_admin(boolean) to authenticated;

-- Reset every policy on the application-owned sensitive tables. This avoids a
-- forgotten permissive policy surviving from an earlier manual correction.
do $policies$
declare
  existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'patients', 'admins', 'clinical_questionnaires', 'procedures',
        'procedure_terms', 'procedure_questionnaires', 'procedure_consents',
        'clinical_documents', 'privacy_requests',
        'procedure_questionnaire_fields', 'admin_audit_log'
      )
  loop
    execute format(
      'drop policy %I on %I.%I',
      existing_policy.policyname,
      existing_policy.schemaname,
      existing_policy.tablename
    );
  end loop;
end
$policies$;

alter table public.patients enable row level security;
alter table public.patients force row level security;
alter table public.admins enable row level security;
alter table public.admins force row level security;
alter table public.clinical_questionnaires enable row level security;
alter table public.clinical_questionnaires force row level security;
alter table public.procedures enable row level security;
alter table public.procedures force row level security;
alter table public.procedure_terms enable row level security;
alter table public.procedure_terms force row level security;
alter table public.procedure_questionnaires enable row level security;
alter table public.procedure_questionnaires force row level security;
alter table public.procedure_consents enable row level security;
alter table public.procedure_consents force row level security;
alter table public.clinical_documents enable row level security;
alter table public.clinical_documents force row level security;
alter table public.privacy_requests enable row level security;
alter table public.privacy_requests force row level security;
alter table public.procedure_questionnaire_fields enable row level security;
alter table public.procedure_questionnaire_fields force row level security;
alter table public.admin_audit_log enable row level security;
alter table public.admin_audit_log force row level security;

revoke all on table public.patients from anon, authenticated;
revoke all on table public.admins from anon, authenticated;
revoke all on table public.clinical_questionnaires from anon, authenticated;
revoke all on table public.procedures from anon, authenticated;
revoke all on table public.procedure_terms from anon, authenticated;
revoke all on table public.procedure_questionnaires from anon, authenticated;
revoke all on table public.procedure_consents from anon, authenticated;
revoke all on table public.clinical_documents from anon, authenticated;
revoke all on table public.privacy_requests from anon, authenticated;
revoke all on table public.procedure_questionnaire_fields from anon, authenticated;
revoke all on table public.admin_audit_log from anon, authenticated;
revoke all on sequence public.procedure_questionnaires_id_seq from anon, authenticated;
revoke all on sequence public.procedure_consents_id_seq from anon, authenticated;
revoke all on sequence public.clinical_documents_id_seq from anon, authenticated;

grant select on table public.patients to authenticated;
grant select on table public.admins to authenticated;
grant select on table public.clinical_questionnaires to authenticated;
grant select on table public.procedures to authenticated;
grant select on table public.procedure_terms to authenticated;
grant select on table public.procedure_questionnaires to authenticated;
grant select on table public.procedure_consents to authenticated;
grant select, insert, update on table public.clinical_documents to authenticated;
grant select on table public.privacy_requests to authenticated;
grant usage, select on sequence public.clinical_documents_id_seq to authenticated;

create policy "Admins identify own membership"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Patients read own profile or AAL2 admins read profiles"
  on public.patients for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_current_admin(true))
  );

create policy "Patients read own legacy history or AAL2 admins read history"
  on public.clinical_questionnaires for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_current_admin(true))
  );

create policy "Authenticated users read active procedures"
  on public.procedures for select to authenticated
  using (active = true);

create policy "Authenticated users read active procedure terms"
  on public.procedure_terms for select to authenticated
  using (active = true);

create policy "Patients read own procedure questionnaires or AAL2 admins read them"
  on public.procedure_questionnaires for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_current_admin(true))
  );

create policy "Patients read own consents or AAL2 admins read consents"
  on public.procedure_consents for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_current_admin(true))
  );

create policy "AAL2 admins manage clinical document metadata"
  on public.clinical_documents for all to authenticated
  using ((select public.is_current_admin(true)))
  with check (
    generated_by = (select auth.uid())
    and (select public.is_current_admin(true))
  );

create policy "Patients read own privacy requests"
  on public.privacy_requests for select to authenticated
  using (user_id = (select auth.uid()));

-- Storage policies are bucket-scoped and also require AAL2. Do not alter
-- policies for any unrelated bucket in the same Supabase project.
drop policy if exists "Administrators read clinical PDFs" on storage.objects;
drop policy if exists "Administrators create clinical PDFs" on storage.objects;
drop policy if exists "Administrators replace clinical PDFs" on storage.objects;
drop policy if exists "AAL2 admins read clinical PDFs" on storage.objects;
drop policy if exists "AAL2 admins create clinical PDFs" on storage.objects;
drop policy if exists "AAL2 admins replace clinical PDFs" on storage.objects;

create policy "AAL2 admins read clinical PDFs"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'clinical-documents'
    and (select public.is_current_admin(true))
  );

create policy "AAL2 admins create clinical PDFs"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'clinical-documents'
    and (select public.is_current_admin(true))
  );

create policy "AAL2 admins replace clinical PDFs"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'clinical-documents'
    and (select public.is_current_admin(true))
  )
  with check (
    bucket_id = 'clinical-documents'
    and (select public.is_current_admin(true))
  );

-- Immutable, validated questionnaire revisions. Direct table INSERT/UPDATE is
-- not granted; all writes pass through this function.
create or replace function public.submit_procedure_questionnaire(
  p_procedure_id text,
  p_answers jsonb
)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_revision integer;
  v_id bigint;
  v_key text;
  v_birth_date_text text;
  v_birth_date date;
  v_phone text;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.procedures p
    where p.id = p_procedure_id and p.active = true
  ) then
    raise exception 'active procedure required' using errcode = '22023';
  end if;

  if jsonb_typeof(p_answers) <> 'object'
     or pg_column_size(p_answers) > 65536
     or (select count(*) from jsonb_object_keys(p_answers)) > 100
     or exists (
       select 1 from jsonb_each(p_answers)
       where jsonb_typeof(value) <> 'string'
     )
     or exists (
       select 1 from jsonb_each_text(p_answers)
       where char_length(value) > 4000
     ) then
    raise exception 'invalid questionnaire payload' using errcode = '22023';
  end if;

  foreach v_key in array array[
    'treatment_goal', 'treatment_area', 'birth_date', 'phone',
    'medical_treatment', 'medications', 'medication_allergy', 'anticoagulants',
    'pregnant', 'healing_difficulty', 'infectious_condition'
  ] loop
    if nullif(trim(p_answers ->> v_key), '') is null then
      raise exception 'missing required questionnaire field' using errcode = '22023';
    end if;
  end loop;

  foreach v_key in array array[
    'medical_treatment', 'medications', 'medication_allergy', 'anticoagulants',
    'pregnant', 'healing_difficulty', 'infectious_condition'
  ] loop
    if (p_answers ->> v_key) not in ('Sim', 'Não') then
      raise exception 'invalid safety answer' using errcode = '22023';
    end if;
  end loop;

  if exists (
    select 1
    from public.procedure_questionnaire_fields f
    where f.procedure_id = p_procedure_id
      and (
        nullif(trim(p_answers ->> f.field_name), '') is null
        or (p_answers ->> f.field_name) not in ('Sim', 'Não')
      )
  ) then
    raise exception 'missing or invalid procedure answer' using errcode = '22023';
  end if;

  v_birth_date_text := p_answers ->> 'birth_date';
  v_phone := regexp_replace(p_answers ->> 'phone', '[^0-9]', '', 'g');
  if v_birth_date_text !~ '^\d{4}-\d{2}-\d{2}$'
     or v_phone !~ '^[0-9]{10,13}$' then
    raise exception 'invalid contact data' using errcode = '22023';
  end if;

  v_birth_date := v_birth_date_text::date;
  if v_birth_date < date '1900-01-01' or v_birth_date > current_date then
    raise exception 'invalid birth date' using errcode = '22023';
  end if;

  update public.patients
  set birth_date = v_birth_date,
      phone = v_phone
  where user_id = v_user_id;
  if not found then
    raise exception 'patient profile required' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(v_user_id::text || ':' || p_procedure_id, 0)
  );

  select coalesce(max(q.revision), 0) + 1
  into v_revision
  from public.procedure_questionnaires q
  where q.user_id = v_user_id
    and q.procedure_id = p_procedure_id
    and q.questionnaire_version = p_procedure_id || '-v1';

  insert into public.procedure_questionnaires (
    user_id, procedure_id, questionnaire_version, revision, answers
  ) values (
    v_user_id, p_procedure_id, p_procedure_id || '-v1', v_revision, p_answers
  )
  returning id into v_id;

  return v_id;
end;
$$;

alter function public.submit_procedure_questionnaire(text, jsonb) owner to postgres;
alter function public.submit_procedure_questionnaire(text, jsonb) set row_security = off;
revoke all on function public.submit_procedure_questionnaire(text, jsonb) from public, anon, authenticated;
grant execute on function public.submit_procedure_questionnaire(text, jsonb) to authenticated;

-- Consent is tied to the authenticated patient, latest questionnaire and an
-- immutable snapshot of the active term. Direct table insertion is revoked.
create or replace function public.accept_procedure_term(
  p_procedure_term_id bigint,
  p_signer_name text,
  p_signer_street text,
  p_signer_number text,
  p_signer_postal_code text
)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_patient_name text;
  v_procedure_id text;
  v_questionnaire_id bigint;
  v_term_title text;
  v_term_version text;
  v_term_content text;
  v_id bigint;
  v_street text := trim(coalesce(p_signer_street, ''));
  v_number text := trim(coalesce(p_signer_number, ''));
  v_postal_code text := regexp_replace(coalesce(p_signer_postal_code, ''), '[^0-9]', '', 'g');
  v_address text;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select p.full_name into v_patient_name
  from public.patients p
  where p.user_id = v_user_id;

  if v_patient_name is null
     or lower(trim(v_patient_name)) <> lower(trim(coalesce(p_signer_name, ''))) then
    raise exception 'signer name does not match patient profile' using errcode = '22023';
  end if;

  if char_length(v_street) not between 3 and 180
     or char_length(v_number) not between 1 and 20
     or v_postal_code !~ '^[0-9]{8}$' then
    raise exception 'invalid signer address' using errcode = '22023';
  end if;

  select t.procedure_id, t.title, t.version, t.content
  into v_procedure_id, v_term_title, v_term_version, v_term_content
  from public.procedure_terms t
  where t.id = p_procedure_term_id
    and t.active = true;

  if v_procedure_id is null then
    raise exception 'active procedure term required' using errcode = '22023';
  end if;

  select q.id into v_questionnaire_id
  from public.procedure_questionnaires q
  where q.user_id = v_user_id
    and q.procedure_id = v_procedure_id
  order by q.submitted_at desc, q.id desc
  limit 1;

  if v_questionnaire_id is null then
    raise exception 'questionnaire required before consent' using errcode = '42501';
  end if;

  v_address := v_street || ', ' || v_number || ' - CEP '
    || substring(v_postal_code from 1 for 5) || '-'
    || substring(v_postal_code from 6 for 3);

  insert into public.procedure_consents (
    user_id, procedure_term_id, signer_name, accepted_questionnaire_id,
    term_title_snapshot, term_version_snapshot, term_content_snapshot,
    signer_address, signer_street, signer_number, signer_postal_code
  ) values (
    v_user_id, p_procedure_term_id, v_patient_name, v_questionnaire_id,
    v_term_title, v_term_version, v_term_content,
    v_address, v_street, v_number, v_postal_code
  )
  on conflict (user_id, procedure_term_id) do nothing
  returning id into v_id;

  if v_id is null then
    select c.id into v_id
    from public.procedure_consents c
    where c.user_id = v_user_id
      and c.procedure_term_id = p_procedure_term_id;
  end if;

  return v_id;
end;
$$;

alter function public.accept_procedure_term(bigint, text, text, text, text) owner to postgres;
alter function public.accept_procedure_term(bigint, text, text, text, text) set row_security = off;
revoke all on function public.accept_procedure_term(bigint, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.accept_procedure_term(bigint, text, text, text, text)
  to authenticated;

create or replace function public.submit_privacy_request(
  p_request_type text,
  p_details text
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_details text := trim(coalesce(p_details, ''));
  v_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  if coalesce(p_request_type, '') not in ('access', 'correction', 'deletion', 'revocation', 'other')
     or char_length(v_details) not between 10 and 2000 then
    raise exception 'invalid privacy request' using errcode = '22023';
  end if;
  if (
    select count(*)
    from public.privacy_requests r
    where r.user_id = v_user_id
      and r.created_at >= now() - interval '24 hours'
  ) >= 5 then
    raise exception 'privacy request rate limit reached' using errcode = 'P0001';
  end if;

  insert into public.privacy_requests (user_id, request_type, details)
  values (v_user_id, p_request_type, v_details)
  returning id into v_id;
  return v_id;
end;
$$;

alter function public.submit_privacy_request(text, text) owner to postgres;
alter function public.submit_privacy_request(text, text) set row_security = off;
revoke all on function public.submit_privacy_request(text, text) from public, anon, authenticated;
grant execute on function public.submit_privacy_request(text, text) to authenticated;

-- Drop every prior implementation of the admin RPCs before recreating their
-- stable signatures and return contracts.
do $admin_functions$
declare
  existing_function record;
begin
  for existing_function in
    select p.oid::regprocedure::text as signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'admin_list_patients', 'admin_get_patient_record',
        'admin_list_privacy_requests', 'admin_update_privacy_request'
      )
  loop
    execute 'drop function ' || existing_function.signature;
  end loop;
end
$admin_functions$;

create function public.admin_list_patients(
  p_limit integer default 200,
  p_offset integer default 0,
  p_query text default ''
)
returns table (
  user_id uuid,
  full_name text,
  email text,
  cpf text,
  created_at timestamptz,
  has_clinical_history boolean,
  procedure_questionnaire_count bigint
)
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_admin_id uuid := (select auth.uid());
  v_query text := trim(coalesce(p_query, ''));
begin
  if not (select public.is_current_admin(true)) then
    raise exception 'AAL2 administrator required' using errcode = '42501';
  end if;

  insert into public.admin_audit_log (
    admin_user_id, action, session_id, metadata
  ) values (
    v_admin_id, 'patient_directory_view', auth.jwt() ->> 'session_id',
    jsonb_build_object('query_used', v_query <> '')
  );

  return query
  select p.user_id,
         p.full_name,
         p.email,
         '***.***.' || substring(p.cpf from 7 for 3) || '-**' as cpf,
         p.created_at,
         exists (
           select 1 from public.clinical_questionnaires cq
           where cq.user_id = p.user_id
         ) as has_clinical_history,
         (
           select count(*)
           from public.procedure_questionnaires pq
           where pq.user_id = p.user_id
         ) as procedure_questionnaire_count
  from public.patients p
  where v_query = ''
     or p.full_name ilike '%' || v_query || '%'
     or p.email ilike '%' || v_query || '%'
     or (
       regexp_replace(v_query, '[^0-9]', '', 'g') <> ''
       and p.cpf like '%' || regexp_replace(v_query, '[^0-9]', '', 'g') || '%'
     )
  order by p.created_at desc
  limit greatest(1, least(coalesce(p_limit, 200), 200))
  offset greatest(coalesce(p_offset, 0), 0);
end;
$$;

create function public.admin_get_patient_record(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_admin_id uuid := (select auth.uid());
  v_record jsonb;
begin
  if not (select public.is_current_admin(true)) then
    raise exception 'AAL2 administrator required' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'patient', jsonb_build_object(
      'full_name', p.full_name,
      'email', p.email,
      'cpf', p.cpf,
      'birth_date', p.birth_date,
      'phone', p.phone,
      'created_at', p.created_at
    ),
    'legacy_questionnaire', (
      select jsonb_build_object(
        'answers', cq.answers,
        'submitted_at', cq.submitted_at,
        'questionnaire_version', cq.questionnaire_version
      )
      from public.clinical_questionnaires cq
      where cq.user_id = p.user_id
      limit 1
    ),
    'procedure_questionnaires', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', pq.id,
          'procedure_id', pq.procedure_id,
          'procedure_name', pr.name,
          'questionnaire_version', pq.questionnaire_version,
          'revision', pq.revision,
          'answers', pq.answers,
          'submitted_at', pq.submitted_at
        ) order by pq.submitted_at desc, pq.id desc
      )
      from public.procedure_questionnaires pq
      join public.procedures pr on pr.id = pq.procedure_id
      where pq.user_id = p.user_id
    ), '[]'::jsonb),
    'consents', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'signer_name', c.signer_name,
          'signer_address', c.signer_address,
          'signer_street', c.signer_street,
          'signer_number', c.signer_number,
          'signer_postal_code', c.signer_postal_code,
          'accepted_at', c.accepted_at,
          'term_title_snapshot', c.term_title_snapshot,
          'term_version_snapshot', c.term_version_snapshot,
          'accepted_questionnaire_id', c.accepted_questionnaire_id
        ) order by c.accepted_at desc, c.id desc
      )
      from public.procedure_consents c
      where c.user_id = p.user_id
    ), '[]'::jsonb)
  )
  into v_record
  from public.patients p
  where p.user_id = p_user_id;

  if v_record is null then
    raise exception 'patient not found' using errcode = 'P0002';
  end if;

  insert into public.admin_audit_log (
    admin_user_id, action, target_user_id, session_id
  ) values (
    v_admin_id, 'patient_record_view', p_user_id, auth.jwt() ->> 'session_id'
  );

  return v_record;
end;
$$;

create function public.admin_list_privacy_requests()
returns table (
  id uuid,
  patient_name text,
  request_type text,
  details text,
  status text,
  created_at timestamptz,
  resolution_notes text
)
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_admin_id uuid := (select auth.uid());
begin
  if not (select public.is_current_admin(true)) then
    raise exception 'AAL2 administrator required' using errcode = '42501';
  end if;

  insert into public.admin_audit_log (
    admin_user_id, action, session_id
  ) values (
    v_admin_id, 'privacy_request_directory_view', auth.jwt() ->> 'session_id'
  );

  return query
  select r.id, p.full_name, r.request_type, r.details, r.status,
         r.created_at, r.resolution_notes
  from public.privacy_requests r
  join public.patients p on p.user_id = r.user_id
  order by
    case when r.status in ('received', 'in_review') then 0 else 1 end,
    r.created_at desc
  limit 500;
end;
$$;

create function public.admin_update_privacy_request(
  p_request_id uuid,
  p_status text,
  p_resolution_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_admin_id uuid := (select auth.uid());
  v_patient_id uuid;
  v_notes text := nullif(trim(coalesce(p_resolution_notes, '')), '');
begin
  if not (select public.is_current_admin(true)) then
    raise exception 'AAL2 administrator required' using errcode = '42501';
  end if;
  if coalesce(p_status, '') not in ('received', 'in_review', 'completed', 'rejected')
     or (v_notes is not null and char_length(v_notes) > 4000) then
    raise exception 'invalid privacy request update' using errcode = '22023';
  end if;

  update public.privacy_requests
  set status = p_status,
      resolution_notes = v_notes,
      updated_at = now(),
      resolved_at = case when p_status in ('completed', 'rejected') then now() else null end,
      resolved_by = case when p_status in ('completed', 'rejected') then v_admin_id else null end
  where id = p_request_id
  returning user_id into v_patient_id;

  if v_patient_id is null then
    raise exception 'privacy request not found' using errcode = 'P0002';
  end if;

  insert into public.admin_audit_log (
    admin_user_id, action, target_user_id, target_record_id,
    session_id, metadata
  ) values (
    v_admin_id, 'privacy_request_update', v_patient_id, p_request_id::text,
    auth.jwt() ->> 'session_id', jsonb_build_object('status', p_status)
  );

  return p_request_id;
end;
$$;

alter function public.admin_list_patients(integer, integer, text) owner to postgres;
alter function public.admin_list_patients(integer, integer, text) set row_security = off;
alter function public.admin_get_patient_record(uuid) owner to postgres;
alter function public.admin_get_patient_record(uuid) set row_security = off;
alter function public.admin_list_privacy_requests() owner to postgres;
alter function public.admin_list_privacy_requests() set row_security = off;
alter function public.admin_update_privacy_request(uuid, text, text) owner to postgres;
alter function public.admin_update_privacy_request(uuid, text, text) set row_security = off;

revoke all on function public.admin_list_patients(integer, integer, text) from public, anon, authenticated;
revoke all on function public.admin_get_patient_record(uuid) from public, anon, authenticated;
revoke all on function public.admin_list_privacy_requests() from public, anon, authenticated;
revoke all on function public.admin_update_privacy_request(uuid, text, text) from public, anon, authenticated;

grant execute on function public.admin_list_patients(integer, integer, text) to authenticated;
grant execute on function public.admin_get_patient_record(uuid) to authenticated;
grant execute on function public.admin_list_privacy_requests() to authenticated;
grant execute on function public.admin_update_privacy_request(uuid, text, text) to authenticated;

commit;

notify pgrst, 'reload schema';

-- Read-only verification summary. Expected result: every listed table has RLS
-- and FORCE RLS enabled. The second result must return no rows.
select c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'patients', 'admins', 'clinical_questionnaires', 'procedures',
    'procedure_terms', 'procedure_questionnaires', 'procedure_consents',
    'clinical_documents', 'privacy_requests', 'procedure_questionnaire_fields',
    'admin_audit_log'
  )
order by c.relname;

select table_schema, table_name, privilege_type
from information_schema.role_table_grants
where grantee = 'anon'
  and table_schema = 'public'
  and table_name in (
    'patients', 'admins', 'clinical_questionnaires', 'procedures',
    'procedure_terms', 'procedure_questionnaires', 'procedure_consents',
    'clinical_documents', 'privacy_requests', 'procedure_questionnaire_fields',
    'admin_audit_log'
  )
order by table_name, privilege_type;

