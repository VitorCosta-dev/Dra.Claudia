import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { siteConfig, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Dra. Claudia Bonavoglia | Biomedicina Estética em Guarulhos",
  description:
    "Saúde da pele e estética facial, corporal e capilar com atendimento individualizado em Guarulhos. Dra. Claudia Bonavoglia, biomédica esteta, CRBM 73824.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: siteConfig.name,
    title: "Dra. Claudia Bonavoglia | Biomedicina Estética em Guarulhos",
    description: siteConfig.description,
    images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630, alt: "Dra. Claudia Bonavoglia — biomedicina estética" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dra. Claudia Bonavoglia | Biomedicina Estética em Guarulhos",
    description: siteConfig.description,
    images: ["/images/og-cover.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: siteConfig.name,
    url: siteUrl,
    image: `${siteUrl}/images/og-cover.jpg`,
    telephone: `+${siteConfig.whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      addressCountry: "BR",
    },
    sameAs: [siteConfig.instagramUrl],
  };

  return (
    <html lang="pt-BR">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
        {children}
        {/* Ao ativar o token, mantenha a seção de mensuração da política de privacidade publicada. */}
        {analyticsToken ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: analyticsToken })}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
