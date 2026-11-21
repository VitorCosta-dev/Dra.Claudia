# Auditoria completa do site e da Área do Paciente

**Projeto:** Dra. Claudia Bonavoglia  
**Data da revisão:** 21 de novembro de 2026  
**Escopo:** interface pública, temas claro/escuro, catálogo, questionário, consentimento, Área do Paciente, painel administrativo, autenticação, privacidade, Supabase, RLS, dependências e build de produção.

## 1. Conclusão executiva

O código foi corrigido e passou nos testes automatizados de tipos, lint, integridade,
contraste, responsividade estrutural, invariantes de segurança, dependências e build
de produção. A falha visual mostrada nas capturas tinha uma causa concreta: regras
antigas do tema escuro tinham maior especificidade do que as regras gerais do tema
claro. Por isso, rótulos ficavam quase brancos e campos permaneciam pretos.

A revisão de segurança também encontrou problemas relevantes que não eram visíveis
na interface. A migração final corrige gravações diretas que poderiam contornar as
validações do fluxo, torna avaliações e aceites imutáveis, exige MFA/AAL2 no próprio
banco para operações administrativas e cria trilha de auditoria.

**Situação do código:** aprovado para homologação.  
**Situação da produção:** ainda depende da aplicação da migração final, das
configurações do painel Supabase, da validação jurídica da Política de Privacidade e
de um teste funcional com as três identidades descritas neste documento.

## 2. Correções visuais realizadas

### 2.1 Tema claro

Foram definidos estilos explícitos para impedir que seletores antigos do tema escuro
voltem a prevalecer:

- campos `input`, `textarea` e `select` com fundo branco, texto escuro e cursor visível;
- rótulos, legendas e descrições com tons escuros e contraste suficiente;
- placeholders visíveis sem se confundirem com valores preenchidos;
- bordas rosadas com contraste mínimo de componente;
- foco por teclado com anel visível;
- autofill do navegador com texto escuro e fundo branco;
- perguntas clínicas, opções Sim/Não e confirmação final em superfícies claras;
- mensagens de erro em vermelho escuro e mensagens de sucesso em verde escuro;
- caixa de leitura do termo com fundo claro e texto escuro;
- nome, rua, número e CEP com o mesmo padrão visual;
- cartões do catálogo, filtros, busca, histórico e solicitações de privacidade ajustados;
- linha e círculos das etapas corrigidos — o seletor anterior apontava para o
  elemento errado;
- etapas concluídas, ativa e pendentes agora possuem texto e indicadores legíveis.

### 2.2 Tema escuro

O tema escuro foi preservado e recebeu verificação de contraste para texto principal,
texto secundário, botões e bordas. O painel administrativo continua propositalmente
escuro e não exibe o seletor de tema, evitando aplicar a identidade pública a uma
área operacional sensível.

### 2.3 Contraste medido

| Elemento | Razão obtida | Mínimo usado | Resultado |
|---|---:|---:|---|
| Claro — texto principal | 14,10:1 | 4,5:1 | Aprovado |
| Claro — texto secundário | 6,11:1 | 4,5:1 | Aprovado |
| Claro — CTA | 5,23:1 | 4,5:1 | Aprovado |
| Claro — borda de campo | 3,70:1 | 3:1 | Aprovado |
| Claro — rótulo | 11,78:1 | 4,5:1 | Aprovado |
| Claro — etapa secundária | 5,93:1 | 4,5:1 | Aprovado |
| Claro — erro | 7,15:1 | 4,5:1 | Aprovado |
| Escuro — texto principal | 16,84:1 | 4,5:1 | Aprovado |
| Escuro — texto secundário | 10,32:1 | 4,5:1 | Aprovado |
| Escuro — CTA | 6,49:1 | 4,5:1 | Aprovado |
| Escuro — borda de campo | 4,31:1 | 3:1 | Aprovado |

Os mínimos seguem a referência de contraste WCAG para texto normal e componentes.
Isso não equivale a uma certificação formal de acessibilidade, mas elimina os
problemas objetivos de contraste identificados nas telas enviadas.

### 2.4 Responsividade e interação

Foram verificados os breakpoints estruturais de **360, 390, 768, 1024 e 1440 px**.
O código contempla:

- formulário em uma coluna no celular;
- rua, número e CEP reorganizados sem corte em telas pequenas;
- etapas do paciente em 1, 2 ou 4 colunas conforme a largura;
- navegação móvel até 1050 px;
- área mínima de toque de 44 px;
- seletor de tema de 52 × 52 px no celular;
- proteção contra rolagem horizontal;
- suporte a `prefers-reduced-motion`;
- nomes acessíveis e estado `aria-pressed` no seletor de tema;
- foco visível para navegação por teclado.

A validação em navegador automatizado local foi limitada pelo isolamento do ambiente
de execução, que impediu o navegador gráfico de alcançar o servidor local. Por isso,
os resultados acima correspondem à inspeção estrutural do CSS, medições de contraste,
checagens automatizadas e build real. É obrigatório fazer uma conferência visual
final em celular e desktop no domínio de homologação.

## 3. Inventário de rotas

Foram encontradas e compiladas 13 rotas:

| Rota | Uso | Proteção esperada |
|---|---|---|
| `/` | Site institucional | Pública |
| `/procedimentos` | Catálogo e início da jornada | Catálogo público; dados pessoais após login |
| `/acesso` | Login e cadastro | Pública, sem cache, sem indexação |
| `/auth/confirm` | Confirmação de e-mail | Sem cache, sem indexação |
| `/recuperar-senha` | Recuperação | Sem cache, sem indexação |
| `/paciente` | Área do Paciente | Sessão autenticada, sem cache, sem indexação |
| `/questionario` | Avaliação específica | Sessão autenticada, sem cache, sem indexação |
| `/privacidade` | Política de Privacidade | Pública |
| `/privacidade/solicitacao` | Direitos LGPD | Sessão autenticada, sem cache, sem indexação |
| `/admin` | Lista administrativa | Admin + MFA, sem cache, sem indexação |
| `/admin/pacientes/:id` | Ficha clínica | Admin + MFA, sem cache, sem indexação |
| `/admin/privacidade` | Gestão de solicitações | Admin + MFA, sem cache, sem indexação |
| `/admin/seguranca` | Configuração de MFA | Admin, sem cache, sem indexação |

## 4. Revisão do fluxo clínico

### 4.1 Avaliação

Antes da correção, permissões históricas permitiam que uma avaliação fosse gravada
ou alterada diretamente, contornando parte das validações da interface. O estado
final remove essas permissões. O envio passa exclusivamente por
`submit_procedure_questionnaire`, que:

- exige usuário autenticado e perfil de paciente;
- aceita somente procedimento ativo;
- exige objeto JSON e limita o payload a 64 KiB, 100 chaves e 4.000 caracteres por valor;
- valida campos comuns obrigatórios;
- valida respostas Sim/Não;
- valida no servidor as perguntas específicas de cada procedimento;
- valida data de nascimento e telefone;
- registra nova revisão sem substituir a anterior;
- usa lock transacional para evitar duas revisões com o mesmo número.

Também foram corrigidas duas perguntas cujo texto não combinava com o formato
binário Sim/Não.

### 4.2 Consentimento

O aceite passa exclusivamente por `accept_procedure_term`, que:

- exige usuário autenticado;
- compara o nome digitado com o cadastro;
- valida rua, número e CEP;
- exige termo ativo;
- exige avaliação anterior do mesmo procedimento;
- associa o aceite à avaliação mais recente;
- salva cópia imutável de título, versão e conteúdo do termo;
- salva endereço estruturado e formatado;
- utiliza horário do servidor;
- é idempotente para o mesmo paciente e versão de termo.

O problema anterior de `term_title_snapshot` nulo deixa de existir no estado final.
A migração também reconcilia dados legados e impede mais de um termo ativo por
procedimento.

### 4.3 Histórico do paciente

A Área do Paciente mostra os procedimentos solicitados e o estado de avaliação e
aceite. Isso permite ao paciente confirmar visualmente que o pedido foi registrado.
Avaliações e aceites enviados são históricos imutáveis; uma nova resposta gera nova
revisão em vez de apagar a evidência anterior.

## 5. Matriz final de RLS

Todas as tabelas abaixo recebem `ENABLE ROW LEVEL SECURITY` e `FORCE ROW LEVEL
SECURITY` na migração final.

| Tabela | Paciente | Administrador | Escrita |
|---|---|---|---|
| `patients` | Lê apenas o próprio perfil | Lê via AAL2 | Cadastro por trigger; contato por RPC validada |
| `admins` | Sem acesso | Consulta apenas a própria associação | Gestão manual pelo banco |
| `clinical_questionnaires` | Lê o próprio legado | Lê via AAL2 | Sem alteração direta |
| `procedures` | Lê procedimentos ativos autenticado | Mesmo acesso de leitura | Sem escrita pelo navegador |
| `procedure_terms` | Lê termos ativos autenticado | Mesmo acesso de leitura | Sem escrita pelo navegador |
| `procedure_questionnaires` | Lê apenas as próprias revisões | Lê via AAL2 | Somente RPC validada |
| `procedure_consents` | Lê apenas os próprios aceites | Lê via AAL2 | Somente RPC validada |
| `clinical_documents` | Sem acesso | Metadados somente em AAL2 | AAL2 e `generated_by = auth.uid()` |
| `privacy_requests` | Lê os próprios pedidos | Consulta/atualiza por RPC AAL2 | Envio por RPC com limite diário |
| `procedure_questionnaire_fields` | Sem acesso direto | Sem acesso direto | Banco/migração |
| `admin_audit_log` | Sem acesso | Sem acesso direto pelo navegador | Somente RPCs administrativas |

As permissões de tabela e sequência foram revogadas antes de serem concedidas de
forma mínima. As tabelas de avaliações e aceites não concedem `INSERT` ou `UPDATE`
direto ao papel `authenticated`.

## 6. Administração e MFA

O painel já verificava MFA na interface, mas isso não bastava para proteger chamadas
diretas à API. A migração final cria `is_current_admin(true)`, que verifica:

1. se `auth.uid()` pertence a `public.admins`; e
2. se o JWT possui `aal2`.

Essa verificação é aplicada no banco às políticas e RPCs sensíveis. Assim, esconder
uma tela ou alterar JavaScript não concede acesso administrativo.

As RPCs administrativas agora:

- exigem AAL2;
- limitam o volume retornado;
- mascaram CPF na listagem antes de enviar ao navegador;
- entregam CPF completo somente na ficha individual;
- registram visualização do diretório, abertura de ficha, listagem LGPD e alteração
  de solicitação em `admin_audit_log`;
- centralizam a leitura dos consentimentos, evitando consulta direta paralela sem
  auditoria.

## 7. Solicitações de privacidade e LGPD

O formulário não grava mais diretamente na tabela. A RPC
`submit_privacy_request` valida tipo, tamanho, identidade e limita cada usuário a
cinco solicitações em 24 horas.

A Política de Privacidade foi atualizada para declarar:

- data de nascimento, telefone e endereço vinculado ao aceite;
- snapshots de consentimento;
- solicitações de titular e registros de auditoria;
- papel do Supabase e da Cloudflare;
- armazenamento local da sessão e da preferência de tema;
- possibilidade de retenção por obrigações profissionais e exercício de direitos;
- versão aceita no cadastro.

**Pendência obrigatória:** o documento continua identificado como operacional e deve
ser validado pela Dra. Claudia e, se necessário, por assessoria jurídica. A revisão
técnica não substitui aconselhamento jurídico nem define sozinha os prazos legais de
retenção.

## 8. Cabeçalhos e proteção do navegador

O arquivo de configuração inclui:

| Controle | Finalidade |
|---|---|
| Content Security Policy | Restringir scripts, conexões, imagens, frames e formulários |
| `frame-ancestors 'none'` + `X-Frame-Options: DENY` | Mitigar clickjacking |
| `X-Content-Type-Options: nosniff` | Evitar interpretação indevida de conteúdo |
| HSTS | Forçar HTTPS após o primeiro acesso seguro |
| Referrer Policy | Reduzir exposição de URL de origem |
| Permissions Policy | Desativar câmera, microfone, geolocalização, pagamento e USB |
| COOP/CORP | Reduzir interações indevidas entre origens |
| `Cache-Control: private, no-store` | Evitar cache de rotas privadas |
| `X-Robots-Tag` | Impedir indexação de autenticação, paciente e admin |

Limitação conhecida: a CSP ainda permite `'unsafe-inline'` para scripts e estilos
porque o runtime atual e o script que aplica o tema antes da renderização usam
conteúdo inline. As demais origens foram restringidas. Uma futura adoção consistente
de nonce/hash pode eliminar essa exceção.

Após publicar na Cloudflare, confirme os cabeçalhos na resposta real. O build provar
que a configuração compila não comprova que nenhum proxy externo a removerá.

## 9. Autenticação e credenciais

- O código do navegador utiliza apenas a publishable key.
- Não foi encontrada `service_role`, senha de banco ou execução dinâmica por `eval`.
- O arquivo gerado entregue fica sem URL e chave; o ambiente local/publicado deve
  fornecê-las no build.
- Cadastro e redefinição agora exigem 12 caracteres na interface.
- A versão `privacidade-2026-11-21` é enviada no cadastro.
- Redirecionamentos construídos pela aplicação permanecem relativos.
- Links externos em nova aba usam `noopener`/`noreferrer`.

**Configuração pendente no Supabase:** senha mínima de 12 caracteres, proteção contra
senhas comprometidas, SMTP próprio, rate limits/CAPTCHA, URLs finais permitidas e MFA
de todas as contas administrativas. Regras somente na interface podem ser
contornadas, portanto o painel precisa refletir a mesma política.

## 10. Dependências

Durante a auditoria, o `pnpm audit --prod` apontou uma vulnerabilidade crítica no
pacote de React Server Components e vulnerabilidades moderadas no Next.js. Foram
atualizados:

- Next.js: `16.4.1` → `16.4.6`;
- React e React DOM: `19.2.8` → `19.3.1`;
- `react-server-dom-webpack`: `19.2.8` → `19.3.1`;
- `eslint-config-next`: `16.4.1` → `16.4.6`.

Resultado final de `pnpm audit --prod`: **nenhuma vulnerabilidade conhecida**.

## 11. Código, conteúdo, SEO e mídia

- 15.005 linhas foram incluídas na inspeção de código, CSS, scripts e SQL.
- As 13 rotas possuem conteúdo e compilam.
- Sete imagens referenciadas pelo conteúdo foram localizadas e possuem tamanho
  válido; a pasta pública contém também a imagem Open Graph.
- Metadados, canonical, Open Graph, Twitter Card e JSON-LD estão presentes.
- Rotas privadas possuem metadata/cabeçalhos de não indexação.
- O número oficial foi confirmado como **(11) 95411-4425** no site e nos termos.
- O telefone antigo não existe nos termos oficiais; aparece somente na migração
  corretiva que o procura para substituição em bancos antigos.
- Dois arquivos de código inicial não utilizados foram removidos para reduzir
  confusão e superfície de manutenção.

### Alertas não bloqueantes

O lint apresenta seis avisos sobre uso de `<img>` em vez de `next/image`: cinco na
homepage e um QR Code de TOTP. Não são erros funcionais ou de segurança. A troca pode
melhorar LCP e transferência, mas precisa ser testada com o adaptador Cloudflare;
o QR Code em data URI pode permanecer sem otimização.

O Vinext classifica algumas rotas como `Unknown` porque sua análise estática ainda
não detecta todos os usos dinâmicos. O próprio build informa essa limitação; não é
uma falha de compilação.

## 12. Resultado dos testes

| Verificação | Resultado |
|---|---|
| TypeScript `tsc --noEmit` | Aprovado |
| ESLint | 0 erros, 6 avisos de otimização de imagem |
| Temas/contraste/responsividade estrutural | Aprovado |
| Integridade de rotas, imagens, tema e WhatsApp | Aprovado |
| Invariantes de segurança/RLS/RPC/CSP | Aprovado |
| Auditoria de dependências de produção | 0 vulnerabilidades conhecidas |
| Build Vinext/Vite de produção | Aprovado; 13 rotas descobertas |

O SQL foi revisado estaticamente e os invariantes foram testados no repositório, mas
esta auditoria não executou a migração contra o banco Supabase de produção. O teste
real de RLS depende da aplicação da migração e de sessões com identidades diferentes.

## 13. Achados e estado

| Severidade | Achado | Estado |
|---|---|---|
| Crítica | Dependência de React Server Components vulnerável | Corrigido |
| Alta | Admin protegido por MFA apenas na interface, não no banco | Corrigido na migração |
| Alta | Escrita direta podia contornar validação de avaliação | Corrigido na migração |
| Alta | Escrita direta podia contornar validação do aceite | Corrigido na migração |
| Alta | Histórico clínico legado permitia mutação | Corrigido na migração |
| Alta | Colunas de snapshot dependiam de correção manual não versionada | Corrigido |
| Média | Listagem administrativa enviava CPF completo ao navegador | Corrigido |
| Média | Ausência de trilha administrativa no banco | Corrigido |
| Média | Solicitação LGPD gravada diretamente | Corrigido |
| Média | Rotas privadas sem cabeçalhos explícitos de cache | Corrigido |
| Média | Cabeçalhos defensivos incompletos | Corrigido; validar após deploy |
| Média | Política do servidor pode ainda aceitar senha menor | Pendente no painel Supabase |
| Média | Política de Privacidade sem aprovação profissional/jurídica | Pendente externa |
| Baixa | Campos escuros/textos pálidos no tema claro | Corrigido |
| Baixa | Código inicial sem uso | Removido |
| Baixa | Seis imagens sem componente de otimização | Não bloqueante |
| Informativa | CSP ainda depende de `unsafe-inline` | Aceita temporariamente |

## 14. O que ainda não foi comprovado

Esta revisão não deve ser interpretada como teste de invasão ou certificação. Não foi
possível comprovar apenas pelo código:

- estado atual das políticas no banco de produção antes da migração;
- configuração real de senha, CAPTCHA, SMTP, MFA, backups e URLs no painel Supabase;
- cabeçalhos efetivamente entregues pelo domínio Cloudflare;
- funcionamento do e-mail real de confirmação e recuperação;
- restauração de backup;
- prazos jurídicos de retenção;
- ausência de dados reais entre os pacientes de teste;
- comportamento em todos os navegadores e tecnologias assistivas.

O PDF exibido pelo painel ainda é gerado pela função de impressão do navegador. A
estrutura `clinical_documents` e o bucket protegido existem, mas o fluxo atual não
arquiva automaticamente cada PDF no Storage. Caso seja necessário um prontuário
documental central, isso deve ser implementado e validado como uma etapa separada.

## 15. Checklist obrigatório antes da produção

1. Criar e testar um backup do Supabase.
2. Aplicar `20261121000000_full_security_hardening.sql` no SQL Editor.
3. Confirmar que a consulta final mostra RLS e FORCE RLS ativos para todas as tabelas
   e que a consulta de privilégios de `anon` retorna zero linhas.
4. Configurar senha mínima de 12 caracteres, proteção contra senha comprometida,
   SMTP, rate limits/CAPTCHA e URLs finais.
5. Ativar e confirmar TOTP nas contas de `public.admins`.
6. Testar paciente A, paciente B, autenticado não-admin, admin AAL1 e admin AAL2.
7. Confirmar que A não consegue consultar IDs de B nem chamar RPCs administrativas.
8. Testar catálogo → login → avaliação → termo → endereço → aceite → WhatsApp.
9. Conferir o procedimento aceito na Área do Paciente e na ficha administrativa.
10. Testar solicitação LGPD e atualização pelo admin.
11. Validar e publicar a Política de Privacidade aprovada.
12. Publicar em homologação e conferir os dois temas em celular e desktop.
13. Verificar cabeçalhos de segurança no domínio publicado.
14. Somente depois, identificar por UUID e remover pacientes de teste com backup.

## 16. Critério de liberação

O código entregue pode ser considerado **final para homologação**. A liberação para
pacientes reais deve ocorrer somente quando todos os itens 1 a 13 do checklist forem
concluídos e registrados. A remoção de pacientes de teste é posterior à aceitação
funcional e nunca deve ser feita por nome genérico ou exclusão ampla.
