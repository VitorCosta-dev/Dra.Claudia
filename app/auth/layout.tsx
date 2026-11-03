import type { Metadata } from "next";
export const metadata: Metadata = { title: "Confirmação de acesso | Dra. Claudia Bonavoglia", robots: { index: false, follow: false } };
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
