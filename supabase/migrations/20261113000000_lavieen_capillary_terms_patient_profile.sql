-- Adiciona os termos fornecidos pela Dra. Claudia em 13/11/2026.
-- Também centraliza data de nascimento e celular no cadastro protegido da paciente.

begin;

alter table public.patients
  add column if not exists birth_date date,
  add column if not exists phone text;

alter table public.patients
  drop constraint if exists patients_birth_date_range,
  drop constraint if exists patients_phone_format;

alter table public.patients
  add constraint patients_birth_date_range
    check (birth_date is null or birth_date between date '1900-01-01' and date '2100-01-01'),
  add constraint patients_phone_format
    check (phone is null or phone ~ '^[0-9]{10,13}$');

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
begin
  if char_length(patient_name) not between 2 and 150
     or not public.valid_cpf(patient_cpf)
     or patient_birth_date_text !~ '^\d{4}-\d{2}-\d{2}$'
     or patient_phone !~ '^[0-9]{10,13}$' then
    raise exception 'Invalid patient registration';
  end if;

  patient_birth_date := patient_birth_date_text::date;
  if patient_birth_date < date '1900-01-01' or patient_birth_date > current_date then
    raise exception 'Invalid patient birth date';
  end if;

  insert into public.patients (user_id, full_name, email, cpf, birth_date, phone)
  values (new.id, patient_name, lower(new.email), patient_cpf, patient_birth_date, patient_phone);
  return new;
end;
$$;

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
     or exists (select 1 from jsonb_each(p_answers) where jsonb_typeof(value) <> 'string') then
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

  v_birth_date_text := p_answers ->> 'birth_date';
  v_phone := regexp_replace(p_answers ->> 'phone', '[^0-9]', '', 'g');
  if v_birth_date_text !~ '^\d{4}-\d{2}-\d{2}$' or v_phone !~ '^[0-9]{10,13}$' then
    raise exception 'invalid contact data' using errcode = '22023';
  end if;

  v_birth_date := v_birth_date_text::date;
  if v_birth_date < date '1900-01-01' or v_birth_date > current_date then
    raise exception 'invalid birth date' using errcode = '22023';
  end if;

  update public.patients
  set birth_date = v_birth_date, phone = v_phone
  where user_id = v_user_id;

  if not found then
    raise exception 'patient profile required' using errcode = '42501';
  end if;

  select coalesce(max(q.revision), 0) + 1 into v_revision
  from public.procedure_questionnaires q
  where q.user_id = v_user_id
    and q.procedure_id = p_procedure_id
    and q.questionnaire_version = p_procedure_id || '-v1';

  insert into public.procedure_questionnaires (
    user_id, procedure_id, questionnaire_version, revision, answers
  ) values (
    v_user_id, p_procedure_id, p_procedure_id || '-v1', v_revision, p_answers
  ) returning id into v_id;

  return v_id;
end;
$$;

alter function public.submit_procedure_questionnaire(text, jsonb) owner to postgres;
alter function public.submit_procedure_questionnaire(text, jsonb) set row_security = off;
revoke all on function public.submit_procedure_questionnaire(text, jsonb) from public, anon, authenticated;
grant execute on function public.submit_procedure_questionnaire(text, jsonb) to authenticated;

update public.procedures
set active = false
where id = 'terapia-capilar';

insert into public.procedures (id, name, active) values
  ('microagulhamento-capilar', 'Microagulhamento Capilar', true),
  ('mesoterapia-capilar', 'Mesoterapia Capilar', true)
on conflict (id) do update
set name = excluded.name, active = true;

update public.procedure_terms
set active = false
where procedure_id in ('laser-lavieen', 'microagulhamento-capilar', 'mesoterapia-capilar');

insert into public.procedure_terms (procedure_id, title, version, content, active)
values
(
  'laser-lavieen',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — LASER LAVIEEN – THULIUM 1927 nm',
  'laser-lavieen-dra-2026-11-v1',
  $lavieen$
CLÁUDIA BONAVOGLIA

BIOMÉDICA ESTETA

TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

LASER LAVIEEN – THULIUM 1927 nm

1. IDENTIFICAÇÃO DO(A) PACIENTE

Nome completo: __________________________________

CPF: ___________________________________________

Data de nascimento: ____/____/________

Telefone: _______________________________________

2. SOBRE O PROCEDIMENTO

Declaro que fui informado(a) de que o Laser Lavieen utiliza tecnologia de laser de Thulium, com comprimento de onda de 1927 nm, que atua na pele por meio de energia luminosa controlada, promovendo renovação cutânea.

O procedimento pode ser indicado para auxiliar no tratamento de manchas, melasma (conforme avaliação), textura irregular, poros dilatados, linhas finas e sinais de envelhecimento.

3. BENEFÍCIOS ESPERADOS

* Melhora da textura e luminosidade da pele.
* Auxílio na uniformização do tom da pele.
* Suavização de linhas finas.
* Melhora da aparência dos poros.
* Estímulo aos processos de renovação da pele.

Estou ciente de que os resultados variam de pessoa para pessoa e dependem das características da pele, indicação, parâmetros utilizados e cuidados posteriores, não havendo garantia de resultados.

4. POSSÍVEIS RISCOS E EFEITOS ADVERSOS

Fui informado(a) de que podem ocorrer:

* Vermelhidão e inchaço.
* Ardência, calor ou sensibilidade.
* Ressecamento e descamação.
* Formação de pequenas crostas.
* Alterações temporárias ou persistentes na pigmentação.
* Manchas mais claras ou escuras.
* Reativação de herpes na região tratada.
* Infecções e cicatrizes, embora menos frequentes.
* Queimaduras e outras lesões cutâneas.

Compreendo que a intensidade e a duração das reações dependem dos parâmetros utilizados e da resposta individual da minha pele.

5. CONTRAINDICAÇÕES E INFORMAÇÕES DE SAÚDE

Declaro que informei à profissional sobre:

* Gestação ou amamentação.
* Uso de medicamentos, especialmente fotossensibilizantes.
* Histórico de herpes.
* Alergias e sensibilidades.
* Doenças dermatológicas ou autoimunes.
* Histórico de queloides ou cicatrização alterada.
* Infecções, feridas ou inflamações na região.
* Exposição solar recente ou bronzeamento artificial.
* Procedimentos estéticos realizados anteriormente.

Estou ciente de que essas condições deverão ser avaliadas individualmente e poderão contraindicar ou exigir adiamento do tratamento.

6. CUIDADOS ANTES E DEPOIS DO PROCEDIMENTO

Comprometo-me a:

* Seguir as orientações fornecidas pela profissional.
* Evitar exposição solar e bronzeamento antes e depois do procedimento, conforme orientação.
* Utilizar protetor solar de acordo com a recomendação profissional.
* Manter a pele hidratada com produtos indicados.
* Evitar esfoliações, ácidos e produtos irritantes até a liberação profissional.
* Não retirar ou arrancar eventuais crostas e descamações.
* Evitar manipular ou friccionar a região tratada.
* Comunicar imediatamente qualquer reação inesperada.

7. DECLARAÇÕES E AUTORIZAÇÃO

Declaro que:

* Recebi explicações sobre o funcionamento do Laser Lavieen.
* Fui informado(a) sobre benefícios, riscos e limitações.
* Tive oportunidade de esclarecer minhas dúvidas.
* Informei corretamente meu histórico de saúde.
* Compreendo que os resultados não são garantidos.
* Estou ciente de que posso retirar meu consentimento antes ou durante o procedimento, respeitadas as condições de segurança para sua interrupção.

Autorizo livre e esclarecidamente a realização do procedimento com Laser Lavieen.

8. REGISTRO DO PROCEDIMENTO

Área tratada: ____________________________________

Parâmetros utilizados: _____________________________

Energia: ________________________________________

Modo de aplicação: _______________________________

Número da sessão: _______________________________

Data: ____/____/________

9. ASSINATURAS

Declaro que li, compreendi e concordo com as informações deste documento.

Local e data: ____________________________________

Assinatura do(a) paciente:

____________________________________

Assinatura da profissional:

Cláudia Bonavoglia – Biomédica Esteta.

Tel 11 95411-4425
$lavieen$,
  true
),
(
  'microagulhamento-capilar',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — MICROAGULHAMENTO CAPILAR',
  'microagulhamento-capilar-dra-2026-11-v1',
  replace(replace($capillary$
CLÁUDIA BONAVOGLIA

BIOMÉDICA ESTETA

TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

MICROAGULHAMENTO CAPILAR E MESOTERAPIA CAPILAR

1. IDENTIFICAÇÃO DO(A) PACIENTE

Nome completo: ___________________________________

CPF: ____________________________________________

Data de nascimento: ____/____/________

Telefone: ________________________________________

2. SOBRE OS PROCEDIMENTOS

Declaro que fui devidamente informado(a) sobre os procedimentos de Microagulhamento Capilar e Mesoterapia Capilar.

O Microagulhamento Capilar consiste na realização de microperfurações controladas no couro cabeludo, por meio de dispositivo apropriado, com o objetivo de estimular respostas locais e favorecer o tratamento capilar.

A Mesoterapia Capilar consiste na aplicação de substâncias específicas no couro cabeludo, por meio de técnicas de aplicação intradérmica, conforme avaliação e indicação profissional.

3. BENEFÍCIOS ESPERADOS

Os procedimentos podem contribuir para:

* Auxiliar no tratamento de determinados tipos de queda capilar.
* Estimular mecanismos relacionados à saúde do couro cabeludo.
* Melhorar as condições locais para o crescimento dos fios.
* Complementar protocolos de tratamento capilar.

Estou ciente de que os resultados variam de acordo com cada organismo, condição clínica, causa da queda capilar e adesão ao tratamento, não havendo garantia de resultados.

4. POSSÍVEIS RISCOS E REAÇÕES

Fui informado(a) de que podem ocorrer:

* Vermelhidão e sensibilidade no couro cabeludo.
* Ardência, coceira e desconforto local.
* Pequenos sangramentos e hematomas.
* Inchaço temporário.
* Irritação ou reação alérgica aos produtos utilizados.
* Infecção, manchas ou outras complicações, embora menos frequentes.

Compreendo que reações individuais podem ocorrer e que devo comunicar imediatamente qualquer alteração inesperada.

5. CONTRAINDICAÇÕES E INFORMAÇÕES DE SAÚDE

Declaro que informei corretamente meu histórico de saúde, incluindo:

* Alergias e sensibilidades.
* Uso de medicamentos.
* Doenças preexistentes.
* Alterações de coagulação.
* Gestação ou amamentação.
* Infecções, feridas ou inflamações no couro cabeludo.
* Histórico de reações a procedimentos anteriores.

Comprometo-me a informar qualquer alteração no meu estado de saúde antes das sessões.

6. CUIDADOS APÓS O PROCEDIMENTO

Comprometo-me a:

* Seguir todas as orientações fornecidas pela profissional.
* Evitar exposição solar intensa nas primeiras 48 horas ou pelo período orientado.
* Não coçar ou manipular o couro cabeludo.
* Evitar produtos irritantes e procedimentos químicos até a liberação profissional.
* Não utilizar medicamentos ou produtos por conta própria.
* Comunicar à profissional qualquer reação inesperada.

7. DECLARAÇÕES E AUTORIZAÇÃO

Declaro que:

* Recebi explicações claras sobre os procedimentos.
* Tive oportunidade de esclarecer minhas dúvidas.
* Compreendi os benefícios, limitações e possíveis riscos.
* Forneci informações verdadeiras sobre meu histórico de saúde.
* Estou ciente de que os resultados não são garantidos.
* Sei que posso retirar meu consentimento antes ou durante o procedimento, respeitadas as condições de segurança para sua interrupção.

Autorizo, de forma livre e esclarecida, a realização do(s) procedimento(s) assinalado(s):

{{MICRO}} Microagulhamento Capilar

{{MESO}} Mesoterapia Capilar

8. REGISTRO DO PROCEDIMENTO

Substâncias/produtos utilizados: ______________________

Fabricante: ______________________________________

Lote: ___________________________________________

Validade: _______________________________________

Região tratada: __________________________________

Data: ____/____/________

9. ASSINATURAS

Declaro que li e compreendi todas as informações deste documento e concordo com a realização do procedimento autorizado.

Local e data: ____________________________________

Assinatura do(a) paciente:

____________________________________

Assinatura da profissional:

Cláudia Bonavoglia – Biomédica Esteta

Tel 11 95411-4425
$capillary$, '{{MICRO}}', '(X)'), '{{MESO}}', '( )'),
  true
),
(
  'mesoterapia-capilar',
  'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO — MESOTERAPIA CAPILAR',
  'mesoterapia-capilar-dra-2026-11-v1',
  replace(replace($capillary$
CLÁUDIA BONAVOGLIA

BIOMÉDICA ESTETA

TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

MICROAGULHAMENTO CAPILAR E MESOTERAPIA CAPILAR

1. IDENTIFICAÇÃO DO(A) PACIENTE

Nome completo: ___________________________________

CPF: ____________________________________________

Data de nascimento: ____/____/________

Telefone: ________________________________________

2. SOBRE OS PROCEDIMENTOS

Declaro que fui devidamente informado(a) sobre os procedimentos de Microagulhamento Capilar e Mesoterapia Capilar.

O Microagulhamento Capilar consiste na realização de microperfurações controladas no couro cabeludo, por meio de dispositivo apropriado, com o objetivo de estimular respostas locais e favorecer o tratamento capilar.

A Mesoterapia Capilar consiste na aplicação de substâncias específicas no couro cabeludo, por meio de técnicas de aplicação intradérmica, conforme avaliação e indicação profissional.

3. BENEFÍCIOS ESPERADOS

Os procedimentos podem contribuir para:

* Auxiliar no tratamento de determinados tipos de queda capilar.
* Estimular mecanismos relacionados à saúde do couro cabeludo.
* Melhorar as condições locais para o crescimento dos fios.
* Complementar protocolos de tratamento capilar.

Estou ciente de que os resultados variam de acordo com cada organismo, condição clínica, causa da queda capilar e adesão ao tratamento, não havendo garantia de resultados.

4. POSSÍVEIS RISCOS E REAÇÕES

Fui informado(a) de que podem ocorrer:

* Vermelhidão e sensibilidade no couro cabeludo.
* Ardência, coceira e desconforto local.
* Pequenos sangramentos e hematomas.
* Inchaço temporário.
* Irritação ou reação alérgica aos produtos utilizados.
* Infecção, manchas ou outras complicações, embora menos frequentes.

Compreendo que reações individuais podem ocorrer e que devo comunicar imediatamente qualquer alteração inesperada.

5. CONTRAINDICAÇÕES E INFORMAÇÕES DE SAÚDE

Declaro que informei corretamente meu histórico de saúde, incluindo:

* Alergias e sensibilidades.
* Uso de medicamentos.
* Doenças preexistentes.
* Alterações de coagulação.
* Gestação ou amamentação.
* Infecções, feridas ou inflamações no couro cabeludo.
* Histórico de reações a procedimentos anteriores.

Comprometo-me a informar qualquer alteração no meu estado de saúde antes das sessões.

6. CUIDADOS APÓS O PROCEDIMENTO

Comprometo-me a:

* Seguir todas as orientações fornecidas pela profissional.
* Evitar exposição solar intensa nas primeiras 48 horas ou pelo período orientado.
* Não coçar ou manipular o couro cabeludo.
* Evitar produtos irritantes e procedimentos químicos até a liberação profissional.
* Não utilizar medicamentos ou produtos por conta própria.
* Comunicar à profissional qualquer reação inesperada.

7. DECLARAÇÕES E AUTORIZAÇÃO

Declaro que:

* Recebi explicações claras sobre os procedimentos.
* Tive oportunidade de esclarecer minhas dúvidas.
* Compreendi os benefícios, limitações e possíveis riscos.
* Forneci informações verdadeiras sobre meu histórico de saúde.
* Estou ciente de que os resultados não são garantidos.
* Sei que posso retirar meu consentimento antes ou durante o procedimento, respeitadas as condições de segurança para sua interrupção.

Autorizo, de forma livre e esclarecida, a realização do(s) procedimento(s) assinalado(s):

{{MICRO}} Microagulhamento Capilar

{{MESO}} Mesoterapia Capilar

8. REGISTRO DO PROCEDIMENTO

Substâncias/produtos utilizados: ______________________

Fabricante: ______________________________________

Lote: ___________________________________________

Validade: _______________________________________

Região tratada: __________________________________

Data: ____/____/________

9. ASSINATURAS

Declaro que li e compreendi todas as informações deste documento e concordo com a realização do procedimento autorizado.

Local e data: ____________________________________

Assinatura do(a) paciente:

____________________________________

Assinatura da profissional:

Cláudia Bonavoglia – Biomédica Esteta

Tel 11 95411-4425
$capillary$, '{{MICRO}}', '( )'), '{{MESO}}', '(X)'),
  true
)
on conflict (procedure_id, version) do update
set title = excluded.title,
    content = excluded.content,
    active = true;

commit;

notify pgrst, 'reload schema';

-- Verificação esperada: três linhas ativas.
select procedure_id, title, version, active
from public.procedure_terms
where procedure_id in ('laser-lavieen', 'microagulhamento-capilar', 'mesoterapia-capilar')
order by procedure_id;
