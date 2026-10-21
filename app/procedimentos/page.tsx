"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

type Term = {
  id: number;
  procedure_id: string;
  title: string;
  version: string;
  content: string;
  procedures: { name: string } | { name: string }[];
};
type Acceptance = { procedure_term_id: number; accepted_at: string };

export default function ProceduresPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [terms, setTerms] = useState<Term[]>([]);
  const [accepted, setAccepted] = useState<Acceptance[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [state, setState] = useState("Carregando procedimentos...");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const { data: auth } = await client.auth.getUser();
      if (!auth.user) { router.replace("/acesso"); return; }
      const questionnaire = await client.from("clinical_questionnaires").select("submitted_at").eq("user_id", auth.user.id).maybeSingle();
      if (!questionnaire.data?.submitted_at) { router.replace("/questionario"); return; }
      const [profile, availableTerms, acceptances] = await Promise.all([
        client.from("patients").select("full_name").eq("user_id", auth.user.id).single(),
        client.from("procedure_terms").select("id,procedure_id,title,version,content,procedures(name)").eq("active", true).order("title"),
        client.from("procedure_consents").select("procedure_term_id,accepted_at").eq("user_id", auth.user.id),
      ]);
      if (!active) return;
      if (profile.error || availableTerms.error || acceptances.error) { setState("Não foi possível carregar os procedimentos."); return; }
      setUserId(auth.user.id);
      setPatientName(profile.data.full_name);
      setTerms((availableTerms.data ?? []) as Term[]);
      setAccepted(acceptances.data ?? []);
      setState("");
    }
    void load();
    return () => { active = false; };
  }, [router]);

  const selected = useMemo(() => terms.find((term) => term.id === selectedId) ?? null, [terms, selectedId]);
  const acceptedIds = new Set(accepted.map((item) => item.procedure_term_id));
  const procedureName = (term: Term) => Array.isArray(term.procedures) ? term.procedures[0]?.name : term.procedures?.name;

  async function acceptTerm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const signerName = String(form.get("signerName") ?? "").trim();
    if (signerName.toLocaleLowerCase("pt-BR") !== patientName.toLocaleLowerCase("pt-BR")) {
      setError("Digite seu nome completo exatamente como aparece no cadastro."); return;
    }
    setBusy(true); setError("");
    const result = await getSupabase().from("procedure_consents").insert({
      user_id: userId, procedure_term_id: selected.id, signer_name: signerName,
    }).select("procedure_term_id,accepted_at").single<Acceptance>();
    setBusy(false);
    if (result.error) { setError("Não foi possível registrar o aceite. Tente novamente."); return; }
    setAccepted((items) => [...items, result.data]);
  }

  return <main className="patient-shell questionnaire-shell">
    <nav className="patient-nav"><Link href="/paciente">← Minha conta</Link><span>Procedimentos</span></nav>
    <section className="patient-card questionnaire-card">
      <p className="patient-kicker">Consentimentos específicos</p>
      <h1>Qual procedimento deseja realizar?</h1>
      <p className="procedure-intro">Escolha um procedimento para ler o termo correspondente. O aceite é registrado separadamente para cada procedimento e versão.</p>
      {state && <p role="status">{state}</p>}
      {!state && <div className="procedure-grid">{terms.map((term) => {
        const wasAccepted = acceptedIds.has(term.id);
        return <button type="button" className={selectedId === term.id ? "procedure-card selected" : "procedure-card"} onClick={() => { setSelectedId(term.id); setError(""); }} key={term.id}>
          <span>{procedureName(term)}</span><small>{wasAccepted ? "Termo aceito" : "Ver termo"}</small>
        </button>;
      })}</div>}
      {!state && terms.length === 0 && <p>Nenhum procedimento está disponível no momento.</p>}
      {selected && <section className="procedure-term">
        <h2>{selected.title}</h2>
        <p className="consent-version">Versão: {selected.version}</p>
        <div className="consent-scroll" tabIndex={0}>{selected.content.split("\n").map((paragraph, index) => paragraph && <p key={index}>{paragraph}</p>)}</div>
        {acceptedIds.has(selected.id) ? <p className="form-success">Você já aceitou esta versão do termo.</p> : <form className="patient-form" onSubmit={acceptTerm}>
          <label>Digite seu nome completo para confirmar<input name="signerName" required minLength={2} maxLength={150} /></label>
          <label className="consent-check"><input type="checkbox" required /> Li, compreendi e concordo com o termo deste procedimento.</label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="patient-submit" disabled={busy}>{busy ? "Registrando..." : "Aceitar termo"}</button>
        </form>}
      </section>}
    </section>
  </main>;
}
