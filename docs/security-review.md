# Revisão técnica de segurança

Revisão realizada sobre o código do repositório. Nenhuma configuração do projeto Supabase foi alterada e nenhuma migração foi executada.

## Controles encontrados

- O navegador usa apenas `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; não há `service_role` no código da aplicação.
- As tabelas clínicas incluídas nas migrações usam Row Level Security (RLS).
- Pacientes consultam os próprios dados pelo `auth.uid()`; a leitura administrativa exige associação na tabela `admins`.
- As rotas privadas receberam `noindex, nofollow` e também são bloqueadas em `robots.txt`.
- O cadastro valida CPF, comprimento mínimo da senha e ciência da política de privacidade antes de chamar o Supabase.
- O script opcional de analytics não recebe CPF, respostas clínicas ou conteúdo dos formulários como eventos personalizados.

## Risco clínico que exige decisão

Na migração `20261021000000_clinical_history_and_consent.sql`, a policy **Patients manage their own clinical history** permite `update` depois do envio. O trigger `set_clinical_questionnaire_timestamps` redefine `submitted_at` a cada atualização. Assim, o conteúdo de um registro clínico já enviado pode ser substituído sem preservar a versão anterior, comprometendo a rastreabilidade do histórico.

Solução sugerida para uma migração futura, após validação da profissional:

1. tornar o envio imutável para o paciente depois de `submitted_at`;
2. registrar correções como uma nova versão, sem sobrescrever a anterior;
3. manter autor, data, justificativa e conteúdo anterior em uma trilha de auditoria;
4. permitir eventual retificação administrativa somente por fluxo explícito e auditável.

Há uma decisão semelhante a revisar para avaliações específicas por procedimento, já que a tabela correspondente também concede `update` ao próprio paciente.

## Pendências fora do repositório

- Revisar periodicamente os usuários presentes em `public.admins`.
- Ativar autenticação multifator nas contas administrativas e na conta que controla Supabase e Cloudflare.
- Confirmar no painel do Supabase as URLs autorizadas de redirecionamento após qualquer troca de domínio.
- Validar política de retenção e resposta a solicitações LGPD com a profissional ou assessoria jurídica.
- Realizar revisão do histórico Git por segredos em trabalho separado, pois não fez parte deste escopo.
