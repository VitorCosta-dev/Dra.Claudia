import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dra. Claudia Bonavoglia | Biomedicina Estética em Guarulhos",
  description:
    "Saúde da pele e estética facial com atendimento personalizado em Guarulhos. Conheça os cuidados da Dra. Claudia Bonavoglia, CRBM 73824.",
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
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
