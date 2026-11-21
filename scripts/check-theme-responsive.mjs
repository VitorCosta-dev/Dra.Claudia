import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const toggle = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(layout.includes('data-theme="light"'), "O tema claro não está definido como padrão.");
assert(layout.includes("themeBootScript"), "O tema não é aplicado antes da renderização.");
assert(toggle.includes("window.localStorage.setItem"), "A preferência de tema não é persistida.");
assert(css.includes("body:has(.admin-workspace) .theme-toggle"), "O seletor deveria permanecer fora do painel administrativo.");
assert(toggle.includes("aria-label"), "O seletor de tema precisa de nome acessível.");
assert(css.includes('html[data-theme="light"]'), "Estilos do tema claro ausentes.");
assert(css.includes('html[data-theme="dark"]'), "Estilos do tema escuro ausentes.");
assert(css.includes("overflow-x: hidden"), "A proteção global contra rolagem horizontal está ausente.");
assert(css.includes("min-height:48px") && css.includes("width:52px") && css.includes("height:52px"), "O seletor precisa manter área de toque de pelo menos 44 px.");
assert(css.includes("@media (prefers-reduced-motion:reduce)") || css.includes("@media (prefers-reduced-motion: reduce)"), "Falta respeitar prefers-reduced-motion.");
assert(css.includes('html[data-theme="light"] .form-grid input'), "Campos da avaliação não possuem correção explícita para o tema claro.");
assert(css.includes('html[data-theme="light"] .clinical-question'), "Perguntas clínicas não possuem superfície explícita no tema claro.");
assert(css.includes(".journey-steps li::after { background:#d8aebe; }"), "A linha das etapas não foi adaptada ao tema claro.");
assert(css.includes(".journey-steps .active > span { border-color:#a84f70; background:#a84f70; color:#fff;"), "A etapa ativa não possui contraste explícito no tema claro.");
assert(!css.includes(".journey-steps::before { background:#ead0d9; }"), "Há um seletor inválido antigo para a linha das etapas.");

const widths = [360, 390, 768, 1024, 1440];
const profiles = widths.map((width) => ({
  width,
  compactControls: width <= 620,
  patientTablet: width <= 820,
  navigationTablet: width <= 1050,
  layout: width <= 620 ? "celular" : width <= 820 ? "tablet compacto" : width <= 1050 ? "tablet/paisagem" : "desktop",
}));

for (const profile of profiles) {
  if (profile.compactControls) {
    assert(css.includes("@media (max-width:620px)"), `Falta breakpoint compacto para ${profile.width}px.`);
  }
  if (profile.patientTablet) {
    assert(css.includes("@media(max-width:820px)"), `Falta breakpoint da área da paciente para ${profile.width}px.`);
  }
  if (profile.navigationTablet) {
    assert(css.includes("@media (max-width: 1050px)"), `Falta breakpoint de navegação para ${profile.width}px.`);
  }
}

function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const contrastChecks = [
  ["claro: texto principal", "34242a", "fff9fb", 4.5],
  ["claro: texto secundário", "725c65", "ffffff", 4.5],
  ["claro: CTA", "ffffff", "a84f70", 4.5],
  ["claro: borda de campo", "b86f89", "ffffff", 3],
  ["claro: rótulo de formulário", "4b303a", "ffffff", 4.5],
  ["claro: etapa secundária", "725f66", "ffffff", 4.5],
  ["claro: mensagem de erro", "9b2f24", "fff9fb", 4.5],
  ["escuro: texto principal", "f8f2f4", "171116", 4.5],
  ["escuro: texto secundário", "cfbcc4", "171116", 4.5],
  ["escuro: CTA", "ffffff", "97415f", 4.5],
  ["escuro: borda de campo", "9f6c7f", "1a1216", 3],
];

for (const [name, foreground, background, minimum] of contrastChecks) {
  const ratio = contrast(foreground, background);
  assert(ratio >= minimum, `${name} tem contraste ${ratio.toFixed(2)}:1; mínimo ${minimum}:1.`);
}

if (failures.length) {
  console.error("Falhas na validação de temas e responsividade:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Temas validados: claro (padrão) e escuro.");
console.table(profiles);
console.table(contrastChecks.map(([name, foreground, background, minimum]) => ({
  verificação: name,
  contraste: `${contrast(foreground, background).toFixed(2)}:1`,
  mínimo: `${minimum}:1`,
})));
