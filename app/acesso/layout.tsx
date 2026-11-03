import type { Metadata } from "next";
export const metadata: Metadata = { title: "Acesso do paciente | Dra. Claudia Bonavoglia", robots: { index: false, follow: false } };
export default function AccessLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
