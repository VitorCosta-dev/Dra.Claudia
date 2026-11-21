import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solicitação de privacidade | Dra. Claudia Bonavoglia",
  robots: { index: false, follow: false },
};

export default function PrivacyRequestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
