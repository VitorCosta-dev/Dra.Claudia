-- Corrige o telefone de contato nos termos ainda ativos sem alterar
-- os snapshots dos aceites que já foram registrados por pacientes.

begin;

-- Desativa cada versão antiga antes de ativar a nova. Essa ordem respeita
-- o índice que permite somente um termo ativo por procedimento.
do $$
declare
  termo record;
begin
  for termo in
    select procedure_id, title, version, content
    from public.procedure_terms
    where active = true
      and content like '%(11) 95442-6916%'
  loop
    update public.procedure_terms
    set active = false
    where procedure_id = termo.procedure_id
      and version = termo.version;

    insert into public.procedure_terms (
      procedure_id,
      title,
      version,
      content,
      active
    )
    values (
      termo.procedure_id,
      termo.title,
      termo.version || '-contato-v2',
      replace(termo.content, '(11) 95442-6916', '(11) 95411-4425'),
      true
    )
    on conflict (procedure_id, version) do update
    set title = excluded.title,
        content = excluded.content,
        active = true;
  end loop;
end
$$;

commit;

notify pgrst, 'reload schema';

-- Verificação: não deve retornar nenhuma linha ativa com o número antigo.
select procedure_id, version
from public.procedure_terms
where active = true
  and content like '%95442-6916%';
