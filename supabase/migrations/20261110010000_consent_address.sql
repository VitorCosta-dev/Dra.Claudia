-- Corrige o fluxo de aceite e registra rua, numero e CEP separadamente.
-- Pode ser executado mesmo que a tentativa anterior tenha sido aplicada.

begin;

alter table public.procedure_consents
  add column if not exists accepted_questionnaire_id bigint,
  add column if not exists term_title_snapshot text,
  add column if not exists term_version_snapshot text,
  add column if not exists term_content_snapshot text,
  add column if not exists signer_address text,
  add column if not exists signer_street text,
  add column if not exists signer_number text,
  add column if not exists signer_postal_code text;

-- These columns were originally created by an emergency production correction.
-- Keep them in the ordered migration history so a clean database can be built
-- from this repository without depending on an untracked SQL snippet.
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
    select 1 from pg_constraint
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

alter table public.procedure_consents
  drop constraint if exists procedure_consents_signer_address_length;
alter table public.procedure_consents
  drop constraint if exists procedure_consents_signer_street_length;
alter table public.procedure_consents
  drop constraint if exists procedure_consents_signer_number_length;
alter table public.procedure_consents
  drop constraint if exists procedure_consents_signer_postal_code_format;

alter table public.procedure_consents
  add constraint procedure_consents_signer_address_length
    check (signer_address is null or char_length(trim(signer_address)) between 10 and 300),
  add constraint procedure_consents_signer_street_length
    check (signer_street is null or char_length(trim(signer_street)) between 3 and 180),
  add constraint procedure_consents_signer_number_length
    check (signer_number is null or char_length(trim(signer_number)) between 1 and 20),
  add constraint procedure_consents_signer_postal_code_format
    check (signer_postal_code is null or signer_postal_code ~ '^[0-9]{8}$');

drop function if exists public.accept_procedure_term(bigint);
drop function if exists public.accept_procedure_term(bigint, text);
drop function if exists public.accept_procedure_term(bigint, text, text);
drop function if exists public.accept_procedure_term(bigint, text, text, text, text);

create function public.accept_procedure_term(
  p_procedure_term_id bigint,
  p_signer_name text,
  p_signer_street text,
  p_signer_number text,
  p_signer_postal_code text
)
returns bigint
language plpgsql
security definer
set search_path = ''
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

  v_address := v_street || ', ' || v_number || ' - CEP ' ||
    substring(v_postal_code from 1 for 5) || '-' || substring(v_postal_code from 6 for 3);

  insert into public.procedure_consents (
    user_id,
    procedure_term_id,
    signer_name,
    accepted_questionnaire_id,
    term_title_snapshot,
    term_version_snapshot,
    term_content_snapshot,
    signer_address,
    signer_street,
    signer_number,
    signer_postal_code
  ) values (
    v_user_id,
    p_procedure_term_id,
    v_patient_name,
    v_questionnaire_id,
    v_term_title,
    v_term_version,
    v_term_content,
    v_address,
    v_street,
    v_number,
    v_postal_code
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

-- Garante que a RPC execute com o proprietario do banco mesmo com FORCE RLS.
alter function public.accept_procedure_term(bigint, text, text, text, text)
  owner to postgres;
alter function public.accept_procedure_term(bigint, text, text, text, text)
  security definer;
alter function public.accept_procedure_term(bigint, text, text, text, text)
  set search_path = pg_catalog, public, auth;
alter function public.accept_procedure_term(bigint, text, text, text, text)
  set row_security = off;

revoke all on function public.accept_procedure_term(bigint, text, text, text, text)
  from public, anon, authenticated;

grant execute on function public.accept_procedure_term(bigint, text, text, text, text)
  to authenticated;

commit;

notify pgrst, 'reload schema';

-- Verificacao: deve mostrar anon = false e authenticated = true.
select
  p.proname,
  pg_get_function_identity_arguments(p.oid) as assinatura,
  has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
  has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'accept_procedure_term';
