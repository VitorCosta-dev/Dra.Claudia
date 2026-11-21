import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const migration = read("supabase/migrations/20261121000000_full_security_hardening.sql");
const nextConfig = read("next.config.ts");
const adminRecord = read("app/admin/pacientes/[id]/page.tsx");
const privacyRequest = read("app/privacidade/solicitacao/page.tsx");
const access = read("app/acesso/page.tsx");
const recovery = read("app/recuperar-senha/page.tsx");

for (const table of [
  "patients", "admins", "clinical_questionnaires", "procedures", "procedure_terms",
  "procedure_questionnaires", "procedure_consents", "clinical_documents",
  "privacy_requests", "procedure_questionnaire_fields", "admin_audit_log",
]) {
  assert(
    migration.includes(`alter table public.${table} force row level security;`),
    `FORCE RLS ausente em public.${table}.`,
  );
}

for (const rpc of [
  "submit_procedure_questionnaire", "accept_procedure_term", "submit_privacy_request",
  "admin_list_patients", "admin_get_patient_record", "admin_list_privacy_requests",
  "admin_update_privacy_request",
]) {
  assert(migration.includes(`public.${rpc}`), `RPC protegida ausente: ${rpc}.`);
}

assert(migration.includes("public.is_current_admin(true)"), "RLS administrativo não exige AAL2 no banco.");
assert(migration.includes("auth.jwt() ->> 'aal'"), "A verificação do nível MFA não consulta o JWT.");
assert(migration.includes("revoke all on table public.procedure_consents from anon, authenticated"), "Escrita direta de consentimento não foi revogada.");
assert(migration.includes("revoke all on table public.procedure_questionnaires from anon, authenticated"), "Escrita direta de avaliação não foi revogada.");
assert(migration.includes("one_active_term_per_procedure"), "Não há garantia de um único termo ativo por procedimento.");
assert(migration.includes("admin_audit_log"), "Trilha administrativa append-only ausente.");
assert(migration.includes("procedure_questionnaire_fields"), "Validação servidor-side das perguntas específicas ausente.");
assert(migration.includes("pg_advisory_xact_lock"), "Submissões concorrentes podem disputar o número da revisão.");

assert(nextConfig.includes("Content-Security-Policy"), "CSP ausente.");
assert(nextConfig.includes("frame-ancestors 'none'"), "CSP não bloqueia incorporação por terceiros.");
assert(nextConfig.includes("private, no-store, max-age=0"), "Rotas privadas podem ser armazenadas em cache.");
assert(nextConfig.includes("X-Robots-Tag"), "Rotas privadas não possuem cabeçalho noindex.");

assert(!adminRecord.includes('.from("procedure_consents")'), "Ficha administrativa contorna a RPC auditada.");
assert(privacyRequest.includes('.rpc("submit_privacy_request"'), "Solicitação LGPD ainda grava diretamente na tabela.");
assert(access.includes("password.length < 12") && access.includes("minLength={mode === \"signup\" ? 12"), "Cadastro aceita senha com menos de 12 caracteres.");
assert(recovery.includes("minLength={12}"), "Recuperação aceita senha com menos de 12 caracteres.");
assert(access.includes('privacy_policy_version: "privacidade-2026-11-21"'), "Cadastro não registra a versão atual da política de privacidade.");

const sourceFiles = ["app", "components", "lib", "scripts"]
  .flatMap((directory) => walk(join(root, directory)))
  .filter((path) => /\.(?:ts|tsx|js|mjs)$/.test(path))
  .filter((path) => !path.endsWith("check-security-invariants.mjs"));
const source = sourceFiles.map((path) => readFileSync(path, "utf8")).join("\n");
assert(!/service[_-]?role/i.test(source), "Referência a service_role encontrada no código executável.");
assert(!/\beval\s*\(|new\s+Function\s*\(/.test(source), "Execução dinâmica de código encontrada.");

const blankLinks = [...source.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)];
for (const match of blankLinks) {
  assert(/rel=["'][^"']*(?:noopener|noreferrer)/i.test(match[0]), `Link externo sem noopener/noreferrer: ${match[0].slice(0, 120)}`);
}

const migrations = readdirSync(join(root, "supabase/migrations")).filter((name) => name.endsWith(".sql")).sort();
assert(migrations.at(-1) === "20261121000000_full_security_hardening.sql", "A migração de segurança não é a última da sequência.");

if (failures.length) {
  console.error("Falhas nos invariantes de segurança:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Segurança validada: ${migrations.length} migrações, RLS+AAL2, RPCs restritas, CSP e cache privado.`);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}
