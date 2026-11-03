import type { Metadata } from "next";
export const metadata: Metadata = { title: "Procedimentos | Área do paciente", robots: { index: false, follow: false } };
export default function ProceduresLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
