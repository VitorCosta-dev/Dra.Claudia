"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

type Patient = { user_id: string; full_name: string; email: string; cpf: string; created_at: string; clinical_questionnaires: { submitted_at: string | null }[] };

export default function AdminPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");
  const [state, setState] = useState("Verificando acesso...");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const { data: auth } = await client.auth.getUser();
      if (!active) return;
      if (!auth.user) { setState("Entre na sua conta para acessar esta página."); return; }
      const membership = await client.from("admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
      if (!active) return;
      if (membership.error) { setState("Não foi possível verificar sua permissão."); return; }
      if (!membership.data) { setState("Esta área é restrita aos administradores."); return; }
      const result = await client.from("patients")
        .select("user_id,full_name,email,cpf,created_at,clinical_questionnaires(submitted_at)")
        .order("created_at", { ascending: false }).limit(200);
      if (!active) return;
      if (result.error) { setState("Não foi possível carregar os pacientes."); return; }
      setPatients(result.data ?? []);
      setAuthorized(true);
      setState("");
    }
    void load();
    return () => { active = false; };
  }, []);

  const filtered = patients.filter((p) =>
    `${p.full_name} ${p.email} ${p.cpf}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")),
  );

  return <main className="patient-shell admin-shell">
    <nav className="patient-nav"><Link href="/paciente">← Minha conta</Link><span>ADMIN</span></nav>
    <section className="patient-card admin-card">
      <p className="patient-kicker">Acesso restrito</p>
      <h1>Pacientes cadastrados</h1>
      {state && <p role="status">{state} <Link href="/acesso">Acessar conta</Link></p>}
      {authorized && <>
        <div className="admin-toolbar"><p>{patients.length} cadastro(s) {patients.length === 200 && "— mostrando os 200 mais recentes"}</p>
          <label>Buscar paciente<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nome, e-mail ou CPF" /></label>
        </div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nome</th><th>E-mail</th><th>CPF</th><th>Histórico</th><th>Cadastro</th><th></th></tr></thead>
          <tbody>{filtered.map((p) => <tr key={p.user_id}><td>{p.full_name}</td><td>{p.email}</td><td>{p.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</td><td>{p.clinical_questionnaires?.[0]?.submitted_at ? "Preenchido" : "Pendente"}</td><td>{new Date(p.created_at).toLocaleDateString("pt-BR")}</td><td><Link className="table-link" href={`/admin/pacientes/${p.user_id}`}>Ver ficha</Link></td></tr>)}</tbody>
        </table></div>
        {filtered.length === 0 && <p>{query ? "Nenhum paciente encontrado." : "Ainda não há pacientes cadastrados."}</p>}
      </>}
    </section>
  </main>;
}
