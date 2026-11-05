# Site Dra. Claudia Bonavoglia

Site institucional e Área do Paciente da Dra. Claudia Bonavoglia, biomédica esteta em Guarulhos, SP. O projeto reúne apresentação profissional, catálogo de procedimentos, cadastro de pacientes, avaliações específicas por procedimento, termos de consentimento e uma área administrativa protegida.

Projeto desenvolvido por **Vitor Costa** e mantido também como peça de portfólio.

## Tecnologias

- vinext (Next.js 16 sobre Vite), React 19 e TypeScript
- Tailwind CSS 4 e componentes shadcn
- Supabase Auth e Postgres com Row Level Security (RLS)
- Cloudflare Workers
- pnpm 11.25.0

## Rotas

| Rota | Finalidade |
| --- | --- |
| `/` | Site institucional |
| `/privacidade` | Política de privacidade |
| `/acesso` | Login e cadastro de pacientes |
| `/paciente` | Painel do paciente |
| `/procedimentos` | Catálogo e jornada por procedimento |
| `/questionario` | Avaliação clínica do procedimento selecionado |
| `/admin` | Lista administrativa de pacientes |
| `/admin/pacientes/[id]` | Ficha clínica administrativa |
| `/auth/confirm` | Confirmação de cadastro |
| `/recuperar-senha` | Recuperação de senha |

As rotas com informações pessoais são marcadas para não serem indexadas por buscadores.

## Estrutura principal

- `app/`: páginas, layouts, metadados, sitemap e robots
- `lib/`: integração com Supabase, catálogo e questionários clínicos
- `public/`: imagens e arquivos públicos
- `supabase/`: migrações e instruções de banco de dados
- `build/`: integração usada pelo plugin Vite
- `vendor/`: estilos locais do shadcn
- `scripts/`: scripts do ambiente e do deploy

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e configure:

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publicável usada no navegador |
| `NEXT_PUBLIC_CLINIC_WHATSAPP` | Número público com DDI e DDD, somente dígitos |
| `NEXT_PUBLIC_SITE_URL` | URL canônica do site, sem barra no final |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Token opcional do Cloudflare Web Analytics |

Nunca coloque a `service_role` do Supabase ou outra chave secreta em uma variável `NEXT_PUBLIC_*`.

Quando o token de analytics estiver ausente, nenhum script de mensuração é carregado. Se a forma de mensuração mudar, revise também a seção correspondente da política de privacidade.

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Validações:

```bash
npx tsc --noEmit
pnpm lint
pnpm build
```

## Deploy

Com o Wrangler autenticado e as variáveis configuradas:

```bash
pnpm run deploy:vinext
```

O deploy atual usa Cloudflare Workers. O arquivo `wrangler.jsonc` e o nome do Worker devem ser preservados para não alterar a URL publicada.

Ao trocar o domínio, atualize `NEXT_PUBLIC_SITE_URL` e as URLs autorizadas de redirecionamento no painel do Supabase.

## Banco de dados

As instruções e a ordem das migrações estão em [`supabase/README.md`](supabase/README.md). Migrações devem ser revisadas e executadas conscientemente no projeto correto; o build do site não as aplica automaticamente.

## Observações

- A política de privacidade é um rascunho técnico e precisa de validação da profissional ou assessoria jurídica.
- Os textos clínicos e termos de procedimento também precisam de validação profissional antes do uso definitivo.
- As notas originais do template foram preservadas em [`docs/starter-notes.md`](docs/starter-notes.md).
