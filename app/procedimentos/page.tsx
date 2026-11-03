"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { procedureById, procedureCatalog, procedureCategories } from "@/lib/procedure-catalog";

type Term = { id: number; procedure_id: string; title: string; version: string; content: string };
type Acceptance = { procedure_term_id: number; accepted_at: string };
type Questionnaire = { procedure_id: string; submitted_at: string };

export default function ProceduresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [terms, setTerms] = useState<Term[]>([]);
  const [accepted, setAccepted] = useState<Acceptance[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(searchParams.get("procedimento"));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof procedureCategories)[number]>("Todos");
  const [state, setState] = useState("Carregando procedimentos...");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const { data: auth } = await client.auth.getUser();
      if (!auth.user) { router.replace("/acesso"); return; }
      const [profile, availableTerms, acceptances, savedQuestionnaires] = await Promise.all([
        client.from("patients").select("full_name").eq("user_id", auth.user.id).single(),
        client.from("procedure_terms").select("id,procedure_id,title,version,content").eq("active", true).order("title"),
        client.from("procedure_consents").select("procedure_term_id,accepted_at").eq("user_id", auth.user.id),
        client.from("procedure_questionnaires").select("procedure_id,submitted_at").eq("user_id", auth.user.id),
      ]);
      if (!active) return;
      if (profile.error || availableTerms.error || acceptances.error) { setState("Não foi possível carregar sua área de procedimentos."); return; }
      setUserId(auth.user.id);
      setPatientName(profile.data.full_name);
      setTerms((availableTerms.data ?? []) as Term[]);
      setAccepted(acceptances.data ?? []);
      setQuestionnaires((savedQuestionnaires.data ?? []) as Questionnaire[]);
      setState("");
    }
    void load();
    return () => { active = false; };
  }, [router]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return procedureCatalog.filter((item) =>
      (category === "Todos" || item.category === category) &&
      (!normalized || `${item.name} ${item.summary} ${item.category}`.toLocaleLowerCase("pt-BR").includes(normalized))
    );
  }, [category, query]);

  const selected = selectedProcedureId ? procedureById[selectedProcedureId] : null;
  const selectedTerm = selected ? terms.find((term) => term.procedure_id === selected.id) ?? null : null;
  const questionnaireDone = selected ? questionnaires.some((item) => item.procedure_id === selected.id) : false;
  const termAccepted = selectedTerm ? accepted.some((item) => item.procedure_term_id === selectedTerm.id) : false;

  function chooseProcedure(id: string) {
    setSelectedProcedureId(id);
    setError("");
    window.setTimeout(() => document.getElementById("procedure-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  }

  async function acceptTerm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTerm || !questionnaireDone) return;
    const signerName = String(new FormData(event.currentTarget).get("signerName") ?? "").trim();
    if (signerName.toLocaleLowerCase("pt-BR") !== patientName.toLocaleLowerCase("pt-BR")) { setError("Digite seu nome completo exatamente como aparece no cadastro."); return; }
    setBusy(true); setError("");
    const result = await getSupabase().from("procedure_consents").insert({ user_id: userId, procedure_term_id: selectedTerm.id, signer_name: signerName })
      .select("procedure_term_id,accepted_at").single<Acceptance>();
    setBusy(false);
    if (result.error) { setError("Não foi possível registrar o aceite. Tente novamente."); return; }
    setAccepted((items) => [...items, result.data]);
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_CLINIC_WHATSAPP ?? "5511954426916";
  const whatsappMessage = selected ? encodeURIComponent(`Olá, meu nome é ${patientName}. Conheci o procedimento ${selected.name} pelo site, concluí minha avaliação e gostaria de verificar a disponibilidade para agendamento.`) : "";

  return <main className="patient-shell procedure-shell">
    <nav className="patient-nav"><Link href="/paciente">← Minha conta</Link><span>Procedimentos</span></nav>
    <header className="catalog-header"><p className="patient-kicker">Cuidado personalizado</p><h1>Qual procedimento combina com o seu objetivo?</h1><p>Pesquise, conheça as opções e inicie sua avaliação. Você responderá somente às perguntas relacionadas ao procedimento escolhido.</p></header>
    <section className="catalog-tools" aria-label="Filtros do catálogo">
      <label className="catalog-search"><Search aria-hidden="true" size={20} /><span className="sr-only">Pesquisar procedimento</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar procedimento ou objetivo" /></label>
      <div className="category-filter">{procedureCategories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    </section>
    {state && <p className="catalog-state" role="status">{state}</p>}
    {!state && <section className="catalog-grid" aria-label="Catálogo de procedimentos">{filtered.map((item) => <button type="button" className={selectedProcedureId === item.id ? "catalog-card selected" : "catalog-card"} key={item.id} onClick={() => chooseProcedure(item.id)}>
      <span className="catalog-visual" aria-hidden="true"><span>{item.accent}</span></span><span className="catalog-card-body"><small>{item.category}</small><strong>{item.name}</strong><span>{item.summary}</span><b>Conhecer e iniciar avaliação →</b></span>
    </button>)}{filtered.length === 0 && <p className="catalog-empty">Nenhum procedimento encontrado. Tente outro termo.</p>}</section>}

    {selected && <section className="procedure-journey" id="procedure-detail">
      <div className="journey-heading"><div className="journey-monogram" aria-hidden="true">{selected.accent}</div><div><p className="patient-kicker">Sua escolha</p><h2>{selected.name}</h2><p>{selected.summary}</p></div></div>
      <ol className="journey-steps">
        <li className="complete"><span>1</span><div><strong>Procedimento escolhido</strong><small>Você pode trocar sua escolha a qualquer momento.</small></div></li>
        <li className={questionnaireDone ? "complete" : "active"}><span>2</span><div><strong>Avaliação específica</strong><small>{questionnaireDone ? "Avaliação preenchida." : "Responda às perguntas relacionadas a este procedimento."}</small></div></li>
        <li className={termAccepted ? "complete" : questionnaireDone ? "active" : ""}><span>3</span><div><strong>Termo de consentimento</strong><small>Leia e confirme somente após concluir a avaliação.</small></div></li>
        <li className={termAccepted ? "active" : ""}><span>4</span><div><strong>Solicitar agendamento</strong><small>O WhatsApp será aberto com uma mensagem pronta.</small></div></li>
      </ol>
      {!questionnaireDone && <Link className="patient-submit inline-button journey-action" href={`/questionario?procedimento=${selected.id}`}>Iniciar avaliação de {selected.name}</Link>}
      {questionnaireDone && selectedTerm && <section className="procedure-term"><h3>{selectedTerm.title}</h3><p className="consent-version">Versão: {selectedTerm.version}</p><div className="consent-scroll" tabIndex={0}>{selectedTerm.content.split("\n").map((paragraph, index) => paragraph && <p key={index}>{paragraph}</p>)}</div>
        {termAccepted ? <p className="form-success">Avaliação e termo concluídos. Você já pode solicitar o agendamento.</p> : <form className="patient-form" onSubmit={acceptTerm}><label>Digite seu nome completo para confirmar<input name="signerName" required minLength={2} maxLength={150} /></label><label className="consent-check"><input type="checkbox" required /> Li, compreendi e concordo com o termo deste procedimento.</label>{error && <p className="form-error" role="alert">{error}</p>}<button className="patient-submit" disabled={busy}>{busy ? "Registrando..." : "Aceitar termo"}</button></form>}
      </section>}
      {questionnaireDone && !selectedTerm && <div className="term-review-note"><strong>Termo em revisão</strong><p>A avaliação foi salva. O termo deste procedimento está sendo conferido antes de ser disponibilizado para assinatura.</p></div>}
      {termAccepted && <a className="patient-submit inline-button whatsapp-finish" href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer">Consultar disponibilidade pelo WhatsApp</a>}
    </section>}
  </main>;
}
