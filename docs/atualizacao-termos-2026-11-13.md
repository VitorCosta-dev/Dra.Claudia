# Atualização dos termos — 13/11/2026

## Conteúdo

- Termo do Laser Lavieen – Thulium 1927 nm.
- Termos separados de Microagulhamento Capilar e Mesoterapia Capilar.
- Data de nascimento e celular no cadastro protegido da paciente.
- Atualização desses dados quando uma paciente antiga envia nova avaliação.
- Exibição de nascimento e celular na conta da paciente e na ficha administrativa.

## Aplicação local

1. Pare o `pnpm dev` com `Ctrl+C`.
2. Extraia o pacote atualizado sobre `C:\Projetos\DraClaudiaUX`.
3. Preserve o arquivo `.env.local` existente.
4. Execute:

```powershell
cd C:\Projetos\DraClaudiaUX
pnpm install
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

## Atualização do Supabase

No SQL Editor do projeto correto, execute todo o conteúdo de:

`supabase\migrations\20261113000000_lavieen_capillary_terms_patient_profile.sql`

O resultado final da consulta deve mostrar três termos ativos:

- `laser-lavieen`
- `microagulhamento-capilar`
- `mesoterapia-capilar`

Depois execute também:

`supabase\migrations\20261114000000_correct_clinic_whatsapp.sql`

Essa migração atualiza o contato dos termos para `(11) 95411-4425` e preserva
integralmente os aceites já registrados.

## Testes mínimos

1. Criar uma conta nova informando nascimento e celular.
2. Abrir cada um dos três procedimentos no catálogo.
3. Enviar a avaliação e confirmar que o termo correto aparece em seguida.
4. Aceitar o termo e conferir o registro na Área do Paciente.
5. Abrir a ficha no painel administrativo e conferir nascimento, celular e consentimento.

