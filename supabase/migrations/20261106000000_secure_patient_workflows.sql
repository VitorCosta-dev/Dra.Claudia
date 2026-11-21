-- Server-side validation and immutable revisions for patient procedure workflows.
alter table public.procedure_questionnaires add column if not exists revision integer not null default 1 check (revision > 0);
alter table public.procedure_questionnaires drop constraint if exists procedure_questionnaires_user_id_procedure_id_questionnaire_version_key;
create unique index if not exists procedure_questionnaires_revision_key on public.procedure_questionnaires (user_id,procedure_id,questionnaire_version,revision);
drop policy if exists "Patients manage their procedure questionnaires" on public.procedure_questionnaires;
create policy "Patients read their procedure questionnaires" on public.procedure_questionnaires for select to authenticated using (user_id=(select auth.uid()));
create policy "Patients create questionnaire revisions" on public.procedure_questionnaires for insert to authenticated with check (user_id=(select auth.uid()) and exists(select 1 from public.procedures p where p.id=procedure_id and p.active=true));
revoke update on public.procedure_questionnaires from authenticated;
alter table public.procedure_questionnaires force row level security;
alter table public.procedure_consents force row level security;

create or replace function public.submit_procedure_questionnaire(p_procedure_id text,p_answers jsonb) returns bigint language plpgsql security invoker set search_path='' as $$
declare v_user_id uuid:=(select auth.uid()); v_revision integer; v_id bigint; v_key text;
begin
  if v_user_id is null then raise exception 'authentication required' using errcode='42501'; end if;
  if jsonb_typeof(p_answers)<>'object' or pg_column_size(p_answers)>65536 or (select count(*) from jsonb_object_keys(p_answers))>100 or exists(select 1 from jsonb_each(p_answers) where jsonb_typeof(value)<>'string') then raise exception 'invalid questionnaire payload' using errcode='22023'; end if;
  foreach v_key in array array['treatment_goal','treatment_area','birth_date','phone','medical_treatment','medications','medication_allergy','anticoagulants','pregnant','healing_difficulty','infectious_condition'] loop if nullif(trim(p_answers->>v_key),'') is null then raise exception 'missing required questionnaire field' using errcode='22023'; end if; end loop;
  foreach v_key in array array['medical_treatment','medications','medication_allergy','anticoagulants','pregnant','healing_difficulty','infectious_condition'] loop if (p_answers->>v_key) not in ('Sim','Não') then raise exception 'invalid safety answer' using errcode='22023'; end if; end loop;
  if (p_answers->>'birth_date') !~ '^\d{4}-\d{2}-\d{2}$' or (p_answers->>'phone') !~ '^[0-9+() .-]{8,20}$' then raise exception 'invalid contact data' using errcode='22023'; end if;
  select coalesce(max(q.revision),0)+1 into v_revision from public.procedure_questionnaires q where q.user_id=v_user_id and q.procedure_id=p_procedure_id and q.questionnaire_version=p_procedure_id||'-v1';
  insert into public.procedure_questionnaires(user_id,procedure_id,questionnaire_version,revision,answers) values(v_user_id,p_procedure_id,p_procedure_id||'-v1',v_revision,p_answers) returning id into v_id; return v_id;
end; $$;

create or replace function public.accept_procedure_term(p_procedure_term_id bigint,p_signer_name text) returns bigint language plpgsql security invoker set search_path='' as $$
declare v_user_id uuid:=(select auth.uid()); v_patient_name text; v_procedure_id text; v_id bigint;
begin
  if v_user_id is null then raise exception 'authentication required' using errcode='42501'; end if;
  select p.full_name into v_patient_name from public.patients p where p.user_id=v_user_id;
  if v_patient_name is null or lower(trim(v_patient_name))<>lower(trim(p_signer_name)) then raise exception 'signer name does not match patient profile' using errcode='22023'; end if;
  select t.procedure_id into v_procedure_id from public.procedure_terms t where t.id=p_procedure_term_id and t.active=true;
  if v_procedure_id is null or not exists(select 1 from public.procedure_questionnaires q where q.user_id=v_user_id and q.procedure_id=v_procedure_id) then raise exception 'questionnaire required before consent' using errcode='42501'; end if;
  insert into public.procedure_consents(user_id,procedure_term_id,signer_name) values(v_user_id,p_procedure_term_id,v_patient_name) on conflict(user_id,procedure_term_id) do nothing returning id into v_id;
  if v_id is null then select c.id into v_id from public.procedure_consents c where c.user_id=v_user_id and c.procedure_term_id=p_procedure_term_id; end if; return v_id;
end; $$;
revoke all on function public.submit_procedure_questionnaire(text,jsonb) from public,anon;
revoke all on function public.accept_procedure_term(bigint,text) from public,anon;
grant execute on function public.submit_procedure_questionnaire(text,jsonb) to authenticated;
grant execute on function public.accept_procedure_term(bigint,text) to authenticated;
