import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const sourceRoots = ["app", "components", "lib"];
const sourceExtensions = new Set([".ts", ".tsx", ".css"]);
const failures = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const sourceFiles = sourceRoots.flatMap((directory) => walk(join(root, directory)))
  .filter((file) => sourceExtensions.has(extname(file)));

const imageReferences = new Set();
for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  for (const match of content.matchAll(/["'(](\/images\/[^"')]+)["')]/g)) {
    imageReferences.add(match[1]);
  }
}

for (const imagePath of imageReferences) {
  const file = join(root, "public", imagePath);
  if (!existsSync(file)) failures.push(`Imagem ausente: ${imagePath}`);
  else if (statSync(file).size < 1024) failures.push(`Imagem vazia ou inválida: ${imagePath}`);
}

const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
const home = readFileSync(join(root, "components/home-page.tsx"), "utf8");
const css = readFileSync(join(root, "app/globals.css"), "utf8");
const supabase = readFileSync(join(root, "lib/supabase.ts"), "utf8");
const site = readFileSync(join(root, "lib/site.ts"), "utf8");
const officialTerms = readFileSync(join(root, "supabase/migrations/20261110000000_official_procedure_terms.sql"), "utf8");

if (!layout.includes("id=\"theme-toggle\"")) failures.push("Seletor de tema não está no layout global.");
if (!layout.includes("data-theme-toggle")) failures.push("Seletor de tema não possui o marcador de validação.");
if (!css.includes("z-index:2147483000")) failures.push("Seletor de tema pode ficar atrás do conteúdo.");
if (!home.includes("reveal is-visible")) failures.push("Conteúdo da homepage ainda depende da animação para aparecer.");
if (!css.includes(".footer-brand .brand-mark { color:#64273e")) failures.push("Selo CB do rodapé está sem contraste explícito.");
if (!supabase.includes("supabase-public-config.generated")) failures.push("Cliente Supabase não usa a configuração pública gerada.");
if (!site.includes('"5511954114425"')) failures.push("WhatsApp oficial do site está incorreto.");
if (officialTerms.includes("95442-6916") || officialTerms.includes("954426916")) failures.push("Termos oficiais ainda contêm o telefone antigo.");

const routePages = walk(join(root, "app")).filter((file) => file.endsWith("page.tsx"));
for (const page of routePages) {
  if (statSync(page).size < 80) failures.push(`Rota sem conteúdo: ${relative(root, page)}`);
}

if (failures.length) {
  console.error("Falhas na revisão integral do site:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Site íntegro: ${routePages.length} rotas, ${imageReferences.size} imagens referenciadas e seletor de tema global validados.`);
