-- Procedure-first patient journey.
-- Keeps the legacy clinical_questionnaires table intact for existing records.

create table public.procedure_questionnaires (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.patients(user_id) on delete cascade,
  procedure_id text not null references public.procedures(id),
  questionnaire_version text not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, procedure_id, questionnaire_version)
);

create index procedure_questionnaires_user_idx
  on public.procedure_questionnaires (user_id, submitted_at desc);

create or replace function public.set_procedure_questionnaire_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.submitted_at := now();
  return new;
end;
$$;

create trigger set_procedure_questionnaire_updated_at
  before update on public.procedure_questionnaires
  for each row execute function public.set_procedure_questionnaire_updated_at();

alter table public.procedure_questionnaires enable row level security;
revoke all on public.procedure_questionnaires from anon, authenticated;
grant select, insert, update on public.procedure_questionnaires to authenticated;
grant usage, select on sequence public.procedure_questionnaires_id_seq to authenticated;

create policy "Patients manage their procedure questionnaires"
  on public.procedure_questionnaires for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.procedures p
      where p.id = procedure_id and p.active = true
    )
  );

create policy "Administrators read procedure questionnaires"
  on public.procedure_questionnaires for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

insert into public.procedures (id, name) values
  ('preenchimento-facial', 'Preenchimento Facial'),
  ('preenchimento-labial', 'Preenchimento Labial'),
  ('bioestimulador-colageno', 'Bioestimulador de Colágeno'),
  ('skinbooster', 'Skinbooster'),
  ('harmonizacao-full-face', 'Harmonização Facial Full Face'),
  ('limpeza-de-pele', 'Limpeza de Pele'),
  ('peeling-quimico', 'Peeling Químico'),
  ('jato-de-plasma', 'Jato de Plasma'),
  ('ultrassom-micro-macrofocado', 'Ultrassom Micro e Macrofocado'),
  ('remocao-de-sinais', 'Remoção de Sinais'),
  ('laser-lavieen', 'Laser Lavieen'),
  ('lipoenzimatica', 'Lipoenzimática'),
  ('intradermoterapia-facial', 'Intradermoterapia Facial'),
  ('intradermoterapia-corporal', 'Intradermoterapia Corporal'),
  ('eletroterapia-estetica', 'Eletroterapia Estética'),
  ('microagulhamento', 'Microagulhamento'),
  ('peim', 'PEIM — Microvasos'),
  ('depilacao-a-laser', 'Depilação a Laser'),
  ('criolipolise', 'Criolipólise'),
  ('hidrolipoclasia', 'Hidrolipoclasia'),
  ('terapia-capilar', 'Terapia Capilar')
on conflict (id) do update set name = excluded.name, active = true;
