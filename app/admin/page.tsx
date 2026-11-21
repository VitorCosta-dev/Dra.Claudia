"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getAdminAccess } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";

type Patient = {
  user_id: string;
  full_name: string;
  email: string;
  cpf: string;
  created_at: string;
  has_clinical_history: boolean;
  procedure_questionnaire_count: number;
};

type Filter = "all" | "complete" | "pending";

function maskCpf(cpf: string) {
  if (cpf.includes("*")) return cpf;
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11 ? `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**` : "CPF protegido";
}

export default function AdminPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [state, setState] = useState("Verificando acesso seguro...");
  const [needsMfa, setNeedsMfa] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const access = await getAdminAccess(client);
      if (!active) return;
      if (access.status === "unauthenticated") { setState("Entre na sua conta para acessar esta página."); return; }
      if (access.status === "forbidden") { setState("Esta área é restrita aos administradores."); return; }
      if (access.status === "mfa_required") { setNeedsMfa(true); setState("Confirme o segundo fator para acessar dados clínicos."); return; }
      if (access.status !== "authorized") { setState("Não foi possível verificar sua permissão."); return; }

      const result = await client.rpc("admin_list_patients", { p_limit: 200, p_offset: 0, p_query: "" });
      if (!active) return;
      if (result.error) { setState("Não foi possível carregar os pacientes com acesso seguro."); return; }
      setPatients((result.data ?? []) as Patient[]);
      setAuthorized(true);
      setState("");
    }
    void load();
    return () => { active = false; };
  }, []);

  const completed = patients.filter((patient) => patient.procedure_questionnaire_count > 0 || patient.has_clinical_history).length;
  const filtered = useMemo(() => patients.filter((patient) => {
    const hasEvaluation = patient.procedure_questionnaire_count > 0 || patient.has_clinical_history;
    const matchesFilter = filter === "all" || (filter === "complete" ? hasEvaluation : !hasEvaluation);
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const matchesQuery = !normalized || `${patient.full_name} ${patient.email} ${patient.cpf}`.toLocaleLowerCase("pt-BR").includes(normalized);
    return matchesFilter && matchesQuery;
  }), [filter, patients, query]);

  return <AdminShell active="patients">
    <header className="admin-page-header">
      <div><p className="admin-eyebrow">Visão clínica</p><h1>Pacientes</h1><span>Acompanhe cadastros, avaliações e consentimentos em um único lugar.</span></div>
      <div className="admin-header-actions"><span className="admin-session-badge"><i aria-hidden="true" /> Sessão auditada</span><Link href="/">Ver site público ↗</Link></div>
    </header>

    {state && <section className="admin-feedback" role="status"><span aria-hidden="true">{needsMfa ? "!" : "…"}</span><div><strong>{state}</strong><Link href={needsMfa ? "/admin/seguranca" : "/acesso"}>{needsMfa ? "Confirmar autenticação" : "Acessar conta"} →</Link></div></section>}

    {authorized && <>
      <section className="admin-overview" aria-label="Resumo dos pacientes">
        <article><span>Pacientes cadastrados</span><strong>{patients.length.toString().padStart(2, "0")}</strong><small>cadastros disponíveis no painel</small></article>
        <article><span>Com avaliação</span><strong>{completed.toString().padStart(2, "0")}</strong><small>fichas com dados clínicos</small></article>
        <article><span>Pendentes</span><strong>{(patients.length - completed).toString().padStart(2, "0")}</strong><small>aguardando preenchimento</small></article>
      </section>

      <section className="admin-data-panel">
        <div className="admin-data-heading"><div><p className="admin-eyebrow">Diretório</p><h2>Pacientes cadastrados</h2></div><span>{filtered.length} resultado(s)</span></div>
        <div className="admin-controls">
          <label className="admin-search"><span className="sr-only">Buscar paciente</span><b aria-hidden="true">⌕</b><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, e-mail ou final do CPF" /></label>
          <div className="admin-filter" aria-label="Filtrar pacientes">{([['all', 'Todos'], ['complete', 'Com avaliação'], ['pending', 'Pendentes']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
        </div>

        <div className="admin-desktop-table"><table><thead><tr><th>Paciente</th><th>CPF</th><th>Avaliações</th><th>Cadastro</th><th><span className="sr-only">Ação</span></th></tr></thead><tbody>{filtered.map((patient) => {
          const hasEvaluation = patient.procedure_questionnaire_count > 0 || patient.has_clinical_history;
          return <tr key={patient.user_id}><td><strong>{patient.full_name}</strong><small>{patient.email}</small></td><td>{maskCpf(patient.cpf)}</td><td><span className={`admin-record-status ${hasEvaluation ? "complete" : "pending"}`}>{patient.procedure_questionnaire_count > 0 ? `${patient.procedure_questionnaire_count} enviada(s)` : patient.has_clinical_history ? "Histórico anterior" : "Pendente"}</span></td><td>{new Date(patient.created_at).toLocaleDateString("pt-BR")}</td><td><Link href={`/admin/pacientes/${patient.user_id}`}>Abrir ficha <span aria-hidden="true">→</span></Link></td></tr>;
        })}</tbody></table></div>

        <div className="admin-patient-cards">{filtered.map((patient) => {
          const hasEvaluation = patient.procedure_questionnaire_count > 0 || patient.has_clinical_history;
          return <article key={patient.user_id}><header><div><strong>{patient.full_name}</strong><small>{patient.email}</small></div><span className={`admin-record-status ${hasEvaluation ? "complete" : "pending"}`}>{hasEvaluation ? "Com avaliação" : "Pendente"}</span></header><dl><div><dt>CPF</dt><dd>{maskCpf(patient.cpf)}</dd></div><div><dt>Cadastro</dt><dd>{new Date(patient.created_at).toLocaleDateString("pt-BR")}</dd></div></dl><Link href={`/admin/pacientes/${patient.user_id}`}>Abrir ficha clínica <span aria-hidden="true">→</span></Link></article>;
        })}</div>
        {filtered.length === 0 && <div className="admin-empty"><span aria-hidden="true">⌕</span><strong>Nenhum paciente encontrado</strong><p>Ajuste a busca ou selecione outro filtro.</p></div>}
      </section>
    </>}
  </AdminShell>;
}
