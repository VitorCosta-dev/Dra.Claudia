# Validação dos temas e da responsividade

Data: 19/11/2026

## Resultado

- Tema claro definido como padrão.
- Tema escuro disponível no seletor e mantido entre visitas no mesmo navegador.
- Seletor disponível no site público e na área do paciente; painel administrativo permanece sem o seletor.
- Foco visível, rótulo acessível e área de toque mínima de 44 × 44 px.
- Animações reduzidas quando o sistema solicita `prefers-reduced-motion`.

## Larguras verificadas

| Largura | Comportamento esperado | Claro | Escuro |
| --- | --- | --- | --- |
| 360 px | Controle compacto, conteúdo em uma coluna e sem rolagem horizontal | Aprovado | Aprovado |
| 390 px | Controle compacto, campos e CTAs largos | Aprovado | Aprovado |
| 768 px | Composição de tablet e grids somente quando há espaço | Aprovado | Aprovado |
| 1024 px | Navegação compacta e conteúdo sem cortes | Aprovado | Aprovado |
| 1440 px | Navegação e grids completos de desktop | Aprovado | Aprovado |

## Contraste automatizado

| Tema | Elemento | Relação | Exigência WCAG 2.2 AA | Resultado |
| --- | --- | ---: | ---: | --- |
| Claro | Texto principal | 14,10:1 | 4,5:1 | Aprovado |
| Claro | Texto secundário | 6,11:1 | 4,5:1 | Aprovado |
| Claro | Texto do CTA | 5,23:1 | 4,5:1 | Aprovado |
| Claro | Borda de campo | 3,70:1 | 3:1 | Aprovado |
| Escuro | Texto principal | 16,84:1 | 4,5:1 | Aprovado |
| Escuro | Texto secundário | 10,32:1 | 4,5:1 | Aprovado |
| Escuro | Texto do CTA | 6,49:1 | 4,5:1 | Aprovado |
| Escuro | Borda de campo | 4,31:1 | 3:1 | Aprovado |

## Comandos executados

- `pnpm typecheck`
- `pnpm lint`
- `pnpm check:themes`
- `pnpm build`

O lint não apresentou erros. Permanecem sete avisos preexistentes: seis usos de `<img>` e uma importação não utilizada na configuração do Vite.

