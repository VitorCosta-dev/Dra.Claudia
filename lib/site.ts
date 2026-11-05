const fallbackSiteUrl = "https://site-creator-vinext-starter.vitor-fcosta.workers.dev";

function normalizeSiteUrl(value: string) {
  return value.replace(/\/$/, "");
}

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl,
);

export const siteConfig = {
  name: "Dra. Claudia Bonavoglia",
  description:
    "Saúde da pele e estética facial, corporal e capilar com avaliação individual em Guarulhos, SP.",
  city: "Guarulhos",
  state: "SP",
  instagramUrl: "https://www.instagram.com/draclaudiabonavoglia/",
  whatsappNumber:
    process.env.NEXT_PUBLIC_CLINIC_WHATSAPP || "5511954426916",
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
