# Teste local do painel administrativo

Esta versão altera somente a apresentação do painel administrativo e das fichas clínicas. Ela não executa deploy e não modifica o Supabase.

## Executar no Windows

1. Extraia a pasta fora do OneDrive, por exemplo em `C:\Projetos\DraClaudiaAdminNovo`.
2. Copie o `.env.local` da versão que já funciona para a raiz da nova pasta.
3. Execute `pnpm install --frozen-lockfile`.
4. Execute `pnpm dev`.
5. Abra `http://localhost:5173/admin`.

Use uma conta administrativa com segundo fator configurado. Nunca publique ou compartilhe o arquivo `.env.local`.
