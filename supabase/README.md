# Supabase — ativação e segurança da Área do Paciente

Este diretório contém o histórico versionado do banco. A aplicação usa somente
`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no navegador.
Nunca coloque a senha do banco, `service_role` ou outras chaves secretas no site.

## Aplicação das migrações

Em um banco novo, aplique todos os arquivos de `migrations/` em ordem crescente.
Em um banco que já recebeu as migrações anteriores, aplique apenas as que ainda
não foram executadas. A última migração obrigatória é:

`20261121000000_full_security_hardening.sql`

Ela consolida o estado final de RLS, força MFA/AAL2 para operações administrativas,
remove gravações diretas de avaliações e consentimentos, valida esses fluxos em
RPCs, acrescenta trilha administrativa, limita solicitações LGPD e reconcilia os
snapshots dos termos. O script termina com uma consulta de verificação: confirme
que todas as linhas esperadas indicam RLS ativo e forçado.

Antes de executar em produção:

1. Faça um backup verificável do projeto Supabase.
2. Execute a migração em uma janela de manutenção.
3. Guarde o resultado da consulta final de verificação.
4. Teste uma conta de paciente comum, uma conta administrativa com MFA e uma
   conta autenticada sem associação em `public.admins`.
5. Confira no Table Editor se não existem dois termos ativos para o mesmo
   procedimento.

## Configuração obrigatória no painel

### Authentication

- Exija senha mínima de **12 caracteres** também no painel do Supabase. A validação
  da interface não substitui a regra do servidor.
- Ative proteção contra senhas comprometidas, quando disponível no plano.
- Configure SMTP próprio para confirmação e recuperação de conta.
- Revise limites de envio, rate limits e CAPTCHA para cadastro, login e recuperação.
- Exija MFA/TOTP para todas as contas presentes em `public.admins`.
- Desative provedores de login que não serão utilizados.
- Revise periodicamente sessões ativas e integrantes de `public.admins`.

### URLs e domínio

Em **Authentication → URL Configuration**, substitua o domínio provisório pelo
domínio final e autorize somente os retornos necessários:

- `https://SEU-DOMINIO/auth/confirm`
- `https://SEU-DOMINIO/recuperar-senha`

Remova URLs antigas, ambientes de teste e curingas antes da produção. Para testes
locais, autorize temporariamente apenas o endereço local realmente utilizado.

### Banco, logs e continuidade

- Confirme backups automáticos e, se o plano permitir, recuperação pontual (PITR).
- Defina e documente retenção de dados clínicos, consentimentos, auditoria e
  solicitações LGPD com a profissional e assessoria jurídica.
- Restrinja o acesso ao painel Supabase e ative MFA nas contas da organização.
- Monitore falhas de autenticação, picos de solicitações LGPD e acessos
  administrativos registrados em `public.admin_audit_log`.
- Não apague pacientes de teste até existir backup e uma lista exata de IDs. Faça
  a remoção em atividade separada, validando antes que nenhum paciente real esteja
  incluído.

## Modelo final de acesso

- `auth.users`: identidade, e-mail e senha gerenciados pelo Supabase Auth.
- `public.patients`: cadastro vinculado ao `auth.uid()` e versão da política aceita.
- `public.admins`: lista mínima e explícita de administradores.
- `public.clinical_questionnaires`: histórico legado somente para leitura.
- `public.procedure_questionnaires`: revisões imutáveis gravadas pela RPC validada.
- `public.procedures`: catálogo ativo disponível a usuários autenticados.
- `public.procedure_terms`: uma versão ativa por procedimento.
- `public.procedure_consents`: aceite com termo imutável, avaliação vinculada,
  nome, endereço e horário do servidor.
- `public.privacy_requests`: pedidos do titular, enviados pela RPC com limite diário.
- `public.clinical_documents`: metadados de documentos, acessíveis somente a
  administradores com AAL2.
- `public.admin_audit_log`: trilha append-only de consultas e ações administrativas.

O painel lista no máximo 200 pacientes por chamada. Antes de ultrapassar esse
volume, mantenha a busca no servidor e implemente paginação explícita na interface.

## Testes de autorização após a migração

| Perfil | Resultado esperado |
|---|---|
| Visitante anônimo | Não lê nem grava tabelas clínicas |
| Paciente A | Lê apenas os próprios dados e não altera registros enviados |
| Paciente A tentando ID de B | Operação recusada por RLS/RPC |
| Autenticado fora de `admins` | Não acessa RPCs nem registros administrativos |
| Admin em AAL1 | Painel e RPCs sensíveis recusados até concluir MFA |
| Admin em AAL2 | Acesso permitido e registrado na trilha de auditoria |

Execute também, na raiz do projeto:

```powershell
pnpm typecheck
pnpm lint
pnpm check:themes
pnpm check:site
pnpm check:security
pnpm audit:prod
pnpm build
```
