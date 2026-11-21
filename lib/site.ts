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
  streetAddress: "Av. Parque das Araucárias, 73",
  neighborhood: "Jardim Presidente Dutra",
  instagramUrl: "https://www.instagram.com/draclaudiabonavoglia/",
  whatsappChannelUrl: "https://whatsapp.com/channel/0029VbDZNUpI7BeN26hF9P2J",
  whatsappNumber:
    process.env.NEXT_PUBLIC_CLINIC_WHATSAPP || "5511954114425",
} as const;

export const clinicAddress = `${siteConfig.streetAddress} — ${siteConfig.neighborhood}, ${siteConfig.city} — ${siteConfig.state}`;
const clinicMapQuery = encodeURIComponent(clinicAddress);
export const clinicMapUrl = `https://www.google.com/maps/search/?api=1&query=${clinicMapQuery}`;
export const clinicDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${clinicMapQuery}`;
export const clinicEmbedUrl = `https://www.google.com/maps?q=${clinicMapQuery}&output=embed`;

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
