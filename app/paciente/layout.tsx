import type { Metadata } from "next";
export const metadata: Metadata = { title: "Área do paciente | Dra. Claudia Bonavoglia", robots: { index: false, follow: false } };
export default function PatientLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
