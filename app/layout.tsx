import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { FloatingWhatsapp } from "@/components/floating-whatsapp";
import { siteConfig, siteUrl } from "@/lib/site";

const themeBootScript = `
  (() => {
    try {
      const savedTheme = window.localStorage.getItem("dra-claudia-theme");
      const theme = savedTheme === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
      document.documentElement.style.colorScheme = "light";
    }
  })();
`;

const themeToggleScript = `
  (() => {
    const button = document.getElementById("theme-toggle");
    const label = document.getElementById("theme-toggle-label");
    const sun = document.getElementById("theme-toggle-sun");
    const moon = document.getElementById("theme-toggle-moon");
    if (!button || !label || !sun || !moon) return;

    const render = () => {
      const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      label.textContent = theme === "dark" ? "Tema escuro" : "Tema claro";
      button.setAttribute("aria-label", theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
      button.setAttribute("aria-pressed", String(theme === "dark"));
      sun.classList.toggle("is-active", theme === "light");
      moon.classList.toggle("is-active", theme === "dark");
    };

    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      window.localStorage.setItem("dra-claudia-theme", next);
      render();
    });

    render();
  })();
`;

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
      streetAddress: `${siteConfig.streetAddress} — ${siteConfig.neighborhood}`,
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      addressCountry: "BR",
    },
    sameAs: [siteConfig.instagramUrl, siteConfig.whatsappChannelUrl],
  };

  return (
    <html lang="pt-BR" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
        {children}
        <button
          type="button"
          className="theme-toggle"
          id="theme-toggle"
          data-theme-toggle
          aria-label="Ativar tema escuro"
          aria-pressed="false"
          suppressHydrationWarning
        >
          <span className="theme-toggle-icons" aria-hidden="true" suppressHydrationWarning>
            <span className="theme-toggle-icon is-active" id="theme-toggle-sun" suppressHydrationWarning>☀</span>
            <span className="theme-toggle-icon" id="theme-toggle-moon" suppressHydrationWarning>☾</span>
          </span>
          <span className="theme-toggle-label" id="theme-toggle-label" suppressHydrationWarning>Tema claro</span>
        </button>
        <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
        <FloatingWhatsapp />
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
