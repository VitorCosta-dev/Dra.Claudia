# Entrega final — Dra. Claudia Bonavoglia

Esta versão contém as correções dos temas claro e escuro, catálogo, avaliação,
consentimento, Área do Paciente, Política de Privacidade e endurecimento de
segurança/RLS.

## Antes de usar com pacientes reais

1. Faça um backup verificável do projeto Supabase.
2. No SQL Editor, aplique:
   `supabase/migrations/20261121000000_full_security_hardening.sql`.
3. Confira as duas consultas exibidas no final da execução:
   - todas as tabelas listadas devem mostrar RLS e FORCE RLS ativos;
   - a consulta de privilégios do papel `anon` deve retornar zero linhas.
4. Siga a configuração do painel descrita em `supabase/README.md`.
5. Valide a Política de Privacidade com a profissional/assessoria responsável.
6. Faça a homologação completa descrita em
   `docs/AUDITORIA_COMPLETA_SITE_SEGURANCA_2026-11-21.md`.

## Configuração local

O pacote não inclui `.env.local` nem qualquer credencial. Copie o seu arquivo de
ambiente da versão que já funciona ou crie um novo com as variáveis descritas no
`README.md`. Depois, dentro da pasta do projeto:

```powershell
pnpm install --frozen-lockfile
pnpm typecheck
pnpm check:themes
pnpm check:site
pnpm check:security
pnpm build
pnpm dev
```

## Resultado desta entrega

- build de produção aprovado;
- 13 rotas compiladas;
- temas claro e escuro validados;
- contraste aprovado nos componentes medidos;
- RLS, MFA/AAL2, RPCs, auditoria e cabeçalhos revisados no código;
- auditoria de dependências sem vulnerabilidades conhecidas;
- WhatsApp oficial: **(11) 95411-4425**.

Não remova pacientes de teste até concluir a homologação, confirmar o backup e
identificar exatamente os UUIDs que serão excluídos.
