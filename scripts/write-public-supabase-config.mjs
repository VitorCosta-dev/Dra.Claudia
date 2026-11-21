import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const envFile = fileURLToPath(new URL("../.env.local", import.meta.url));
const generatedFile = fileURLToPath(
  new URL("../lib/supabase-public-config.generated.ts", import.meta.url),
);

function readLocalEnv() {
  if (!existsSync(envFile)) return {};

  const values = {};
  const contents = readFileSync(envFile, "utf8").replace(/^\uFEFF/, "");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator < 1) continue;

    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    values[name] = value;
  }
  return values;
}

export function writePublicSupabaseConfig() {
  const localEnv = readLocalEnv();
  const url = String(
    process.env.NEXT_PUBLIC_SUPABASE_URL || localEnv.NEXT_PUBLIC_SUPABASE_URL || "",
  ).trim();
  const key = String(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      localEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "",
  ).trim();

  if (!url || !key) {
    throw new Error(
      `Supabase não configurado em ${projectRoot}. Confirme NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no arquivo .env.local.`,
    );
  }

  const source = `// Arquivo gerado automaticamente antes de dev/build.\n` +
    `// A publishable key é pública e faz parte do bundle do navegador.\n` +
    `export const supabaseUrl = ${JSON.stringify(url)};\n` +
    `export const supabasePublishableKey = ${JSON.stringify(key)};\n`;

  writeFileSync(generatedFile, source, "utf8");
  process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = key;
}
