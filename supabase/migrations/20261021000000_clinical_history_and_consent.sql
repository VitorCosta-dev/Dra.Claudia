-- Adds the mandatory clinical history and versioned consent per procedure.
-- Run once after 20260923000000_patients.sql.

create table public.clinical_questionnaires (
  user_id uuid primary key references public.patients(user_id) on delete cascade,
  questionnaire_version text not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.procedures (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.procedure_terms (
  id bigint generated always as identity primary key,
  procedure_id text not null references public.procedures(id),
  title text not null,
  version text not null,
  content text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (procedure_id, version)
);

create table public.procedure_consents (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.patients(user_id) on delete cascade,
  procedure_term_id bigint not null references public.procedure_terms(id),
  signer_name text not null check (char_length(trim(signer_name)) between 2 and 150),
  accepted_at timestamptz not null default now(),
  unique (user_id, procedure_term_id)
);

create index procedure_consents_user_id_idx
  on public.procedure_consents (user_id, accepted_at desc);

create or replace function public.set_clinical_questionnaire_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.submitted_at is not null then new.submitted_at := now(); end if;
  return new;
end;
$$;

create trigger set_clinical_questionnaire_timestamps
  before insert or update on public.clinical_questionnaires
  for each row execute function public.set_clinical_questionnaire_timestamps();

alter table public.clinical_questionnaires enable row level security;
alter table public.procedures enable row level security;
alter table public.procedure_terms enable row level security;
alter table public.procedure_consents enable row level security;

revoke all on public.clinical_questionnaires from anon, authenticated;
revoke all on public.procedures from anon, authenticated;
revoke all on public.procedure_terms from anon, authenticated;
revoke all on public.procedure_consents from anon, authenticated;

grant select, insert, update on public.clinical_questionnaires to authenticated;
grant select on public.procedures, public.procedure_terms to authenticated;
grant select, insert on public.procedure_consents to authenticated;
grant usage, select on sequence public.procedure_consents_id_seq to authenticated;

create policy "Patients manage their own clinical history"
  on public.clinical_questionnaires for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Administrators read clinical histories"
  on public.clinical_questionnaires for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

create policy "Authenticated users read active procedures"
  on public.procedures for select to authenticated
  using (active = true);

create policy "Authenticated users read active procedure terms"
  on public.procedure_terms for select to authenticated
  using (active = true);

create policy "Patients and administrators read procedure consents"
  on public.procedure_consents for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
  );

create policy "Patients accept active procedure terms for themselves"
  on public.procedure_consents for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.procedure_terms t
      where t.id = procedure_term_id and t.active = true
    )
  );

-- Initial catalog item. Future procedures are added as new rows, without
-- changing registration or overwriting previous term versions.
insert into public.procedures (id, name)
values ('toxina-botulinica-a', 'Toxina Botulínica Tipo A');

insert into public.procedure_terms (procedure_id, title, version, content)
values (
  'toxina-botulinica-a',
  'Termo de Consentimento Livre e Esclarecido — Toxina Botulínica Tipo A',
  'toxina-botulinica-a-v1',
  E'SOBRE O PROCEDIMENTO\nA toxina botulínica do tipo A é uma toxina produzida pela bactéria Clostridium botulinum. A versão industrializada é purificada e utilizada em pequenas doses. O efeito tensor sob a pele é usado com finalidade estética para suavizar rugas e linhas de expressão.\n\nORIENTAÇÕES, EFEITOS E CUIDADOS\nPodem ocorrer sensação de corpo estranho, coceira, inchaço, vermelhidão, equimoses, dor de cabeça ou dor local. O resultado é individual e não há garantia de percentual de melhora. Nas primeiras 24 horas, não se deve massagear ou pressionar o local. Podem ser necessárias aplicações adicionais em retorno agendado. O efeito varia conforme o metabolismo e os hábitos de cada pessoa.\n\nCONTRAINDICAÇÕES E RISCOS\nMedicamentos, vacinas recentes, doenças neuromusculares, imunológicas e coagulopatias podem interferir no tratamento. Pessoas grávidas ou em amamentação, com infecção ou inflamação no local, ou com alergia a componentes da formulação devem informar a profissional. Podem ocorrer hematomas, pequenos sangramentos, hiperpigmentação pós-inflamatória, eritema, edema, infecção, reação alérgica e ptose.\n\nDECLARAÇÃO DE CONSENTIMENTO\nDeclaro que recebi explicações sobre o propósito, os benefícios, os riscos e as alternativas do procedimento, tive oportunidade de esclarecer dúvidas e respondi com veracidade sobre minha saúde. Compreendo que os resultados variam entre pessoas, que podem ocorrer complicações e que posso revogar este consentimento antes da realização do procedimento. Autorizo voluntariamente a realização do tratamento após avaliação da profissional.'
);
