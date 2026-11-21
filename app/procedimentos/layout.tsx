import type { Metadata } from "next";
export const metadata: Metadata = { title: "Procedimentos estéticos em Guarulhos | Dra. Claudia Bonavoglia", description: "Conheça procedimentos faciais, corporais, capilares e tecnologias disponíveis para avaliação individual com a Dra. Claudia Bonavoglia.", alternates: { canonical: "/procedimentos" }, robots: { index: true, follow: true } };
export default function ProceduresLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
