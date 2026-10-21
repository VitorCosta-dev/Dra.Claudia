-- Adds the mandatory clinical history and an auditable consent record.
-- Run after 20260923000000_patients.sql.

create table if not exists public.clinical_questionnaires (
  user_id uuid primary key references public.patients(user_id) on delete cascade,
  questionnaire_version text not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consent_acceptances (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.patients(user_id) on delete cascade,
  term_title text not null,
  term_version text not null,
  signer_name text not null check (char_length(trim(signer_name)) between 2 and 150),
  accepted_at timestamptz not null default now(),
  unique (user_id, term_version)
);

create index if not exists consent_acceptances_user_id_idx
  on public.consent_acceptances (user_id, accepted_at desc);

create or replace function public.set_clinical_questionnaire_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.submitted_at is not null then
    new.submitted_at := now();
  end if;
  return new;
end;
$$;

create trigger set_clinical_questionnaire_timestamps
  before insert or update on public.clinical_questionnaires
  for each row execute function public.set_clinical_questionnaire_timestamps();

alter table public.clinical_questionnaires enable row level security;
alter table public.consent_acceptances enable row level security;

revoke all on public.clinical_questionnaires from anon, authenticated;
revoke all on public.consent_acceptances from anon, authenticated;
grant select, insert, update on public.clinical_questionnaires to authenticated;
grant select on public.consent_acceptances to authenticated;

create policy "Patients manage their own clinical history"
  on public.clinical_questionnaires for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Administrators read clinical histories"
  on public.clinical_questionnaires for select to authenticated
  using (exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  ));

create policy "Patients and administrators read consent records"
  on public.consent_acceptances for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.admins a where a.user_id = (select auth.uid())
    )
  );

-- The server records the timestamp and accepted document version. The browser
-- never receives INSERT permission for consent_acceptances.
create or replace function public.create_patient_on_signup()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  patient_name text := trim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  patient_cpf text := coalesce(new.raw_user_meta_data ->> 'cpf', '');
  signer_name text := trim(coalesce(new.raw_user_meta_data ->> 'consent_signer_name', ''));
  accepted boolean := coalesce((new.raw_user_meta_data ->> 'consent_accepted')::boolean, false);
  accepted_version text := coalesce(new.raw_user_meta_data ->> 'consent_version', '');
  current_version constant text := 'toxina-botulinica-a-v1';
begin
  if char_length(patient_name) not between 2 and 150
     or not public.valid_cpf(patient_cpf) then
    raise exception 'Invalid patient registration';
  end if;

  if not accepted
     or accepted_version <> current_version
     or lower(signer_name) <> lower(patient_name) then
    raise exception 'Consent is required for patient registration';
  end if;

  insert into public.patients (user_id, full_name, email, cpf)
  values (new.id, patient_name, lower(new.email), patient_cpf);

  insert into public.consent_acceptances
    (user_id, term_title, term_version, signer_name, accepted_at)
  values
    (new.id, 'Termo de Consentimento Livre e Esclarecido — Toxina Botulínica Tipo A', current_version, signer_name, now());

  return new;
end;
$$;

