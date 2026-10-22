# Cadastro de pacientes e área ADMIN

## Ordem de ativação

1. Mantenha o cadastro do site fora do ar até terminar as etapas abaixo.
2. No projeto Supabase **Dra Claudia — Pacientes**, abra **SQL Editor**. Se a primeira
   migração ainda não foi aplicada, execute `migrations/20260923000000_patients.sql`.
   Em seguida execute `migrations/20261021000000_clinical_history_and_consent.sql`.
   Os arquivos criam as tabelas, validam CPF, ativam RLS e registram perfil e aceite.
3. Em **Authentication → URL Configuration**, configure a URL do site e adicione
   estas URLs exatas à lista de redirecionamento:
   - `https://site-creator-vinext-starter.vitor-fcosta.workers.dev/auth/confirm`
   - `https://site-creator-vinext-starter.vitor-fcosta.workers.dev/recuperar-senha`
4. Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   no ambiente de build (para testes locais, copie `.env.example` para `.env.local`).
   A senha do banco e as chaves secretas **não são usadas neste site**.
5. Publique o código atualizado. Cadastre duas contas pelo formulário `/acesso`
   usando os e-mails dos administradores e confirme cada e-mail.
6. No SQL Editor, execute a consulta em `assign-admins.sql`. Confira se ela retorna
   exatamente as duas contas esperadas, com `email_confirmed_at` preenchido.
   Só então execute separadamente o comando INSERT comentado no mesmo arquivo.
7. Teste com um paciente comum: ele só deve consultar o próprio registro, e `/admin`
   deve recusar acesso. Teste também as duas contas ADMIN e a recuperação de senha.
8. Antes de receber pacientes reais, configure SMTP para confirmação e recuperação,
   revise backups, política de privacidade e retenção de CPF.

## Modelo de acesso

- `auth.users`: e-mail, senha gerenciada pelo Supabase e identidade da conta.
- `public.patients`: nome, CPF e e-mail, vinculados ao ID da conta.
- `public.admins`: IDs de administradores aprovados manualmente.
- `public.clinical_questionnaires`: histórico clínico vinculado ao paciente.
- `public.procedures`: catálogo dos procedimentos disponíveis.
- `public.procedure_terms`: textos e versões dos termos de cada procedimento.
- `public.procedure_consents`: aceite do paciente, com nome e horário do servidor.
- O navegador usa só a publishable key. As políticas RLS protegem as consultas
  mesmo que alguém altere a interface ou chame a API diretamente.
- O painel exibe os 200 cadastros mais recentes. Antes de superar esse volume,
  adicione paginação e busca no servidor.
