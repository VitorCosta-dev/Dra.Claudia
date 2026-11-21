import type { ReactNode } from "react";
import Link from "next/link";

type AdminSection = "patients" | "privacy" | "security";

export function AdminShell({ active, children }: { active: AdminSection; children: ReactNode }) {
  return <main className="admin-workspace">
    <aside className="admin-navigation">
      <Link className="admin-identity" href="/">
        <span aria-hidden="true">CB</span>
        <strong>Dra. Claudia<small>Painel administrativo</small></strong>
      </Link>
      <nav aria-label="Navegação administrativa">
        <Link className={active === "patients" ? "active" : ""} href="/admin"><span aria-hidden="true">01</span>Pacientes</Link>
        <Link className={active === "privacy" ? "active" : ""} href="/admin/privacidade"><span aria-hidden="true">02</span>Privacidade</Link>
        <Link className={active === "security" ? "active" : ""} href="/admin/seguranca"><span aria-hidden="true">03</span>Segurança</Link>
      </nav>
      <div className="admin-navigation-footer">
        <span><i aria-hidden="true" /> Ambiente protegido</span>
        <Link href="/paciente">← Voltar para minha conta</Link>
      </div>
    </aside>
    <div className="admin-workspace-content">{children}</div>
  </main>;
}
