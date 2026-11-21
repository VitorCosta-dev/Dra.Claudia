"use client";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CircleCheck, FileText, LockKeyhole, Search } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { procedureById, procedureCatalog, procedureCategories } from "@/lib/procedure-catalog";
import { whatsappUrl } from "@/lib/site";

type Term = { id: number; procedure_id: string; title: string; version: string; content: string };
type Acceptance = { procedure_term_id: number; accepted_at: string };
type Questionnaire = { procedure_id: string; submitted_at: string };
type PatientProfile = { full_name: string };
type AuthState = "checking" | "guest" | "authenticated";

export default function ProceduresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [accepted, setAccepted] = useState<Acceptance[]>([]);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string | null>(searchParams.get("procedimento"));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof procedureCategories)[number]>("Todos");
  const [accountMessage, setAccountMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const termScrolledIntoView = useRef(false);

  useEffect(() => { let active = true; const client = getSupabase(); async function load() {
    const { data: auth } = await client.auth.getUser(); if (!active) return;
    if (!auth.user) { setAuthState("guest"); return; }
    setAuthState("authenticated");
    const [profile, availableTerms, acceptances, saved] = await Promise.all([
      client.from("patients").select("full_name").eq("user_id", auth.user.id).single(),
      client.from("procedure_terms").select("id,procedure_id,title,version,content").eq("active", true).order("title"),
      client.from("procedure_consents").select("procedure_term_id,accepted_at").eq("user_id", auth.user.id),
      client.from("procedure_questionnaires").select("procedure_id,submitted_at").eq("user_id", auth.user.id),
    ]);
    if (!active) return;
    if (profile.error || availableTerms.error || acceptances.error || saved.error) { setAccountMessage("O catálogo está disponível, mas não foi possível carregar o progresso da sua conta agora."); return; }
    setPatientProfile(profile.data as PatientProfile); setTerms((availableTerms.data ?? []) as Term[]); setAccepted((acceptances.data ?? []) as Acceptance[]); setQuestionnaires((saved.data ?? []) as Questionnaire[]);
  } void load(); return () => { active = false; }; }, []);

  const filtered = useMemo(() => { const normalized = query.trim().toLocaleLowerCase("pt-BR"); return procedureCatalog.filter((item) => (category === "Todos" || item.category === category) && (!normalized || `${item.name} ${item.summary} ${item.category}`.toLocaleLowerCase("pt-BR").includes(normalized))); }, [category, query]);
  const selected = selectedProcedureId ? procedureById[selectedProcedureId] : null;
  const selectedTerm = selected ? terms.find((term) => term.procedure_id === selected.id) ?? null : null;
  const questionnaireDone = selected ? questionnaires.some((item) => item.procedure_id === selected.id) : false;
  const termAccepted = selectedTerm ? accepted.some((item) => item.procedure_term_id === selectedTerm.id) : false;
  const selectedAcceptance = selectedTerm ? accepted.find((item) => item.procedure_term_id === selectedTerm.id) : null;
  const patientName = patientProfile?.full_name ?? "";
  const selectedPath = selected ? `/procedimentos?procedimento=${selected.id}` : "/procedimentos";
  const accessUrl = `/acesso?next=${encodeURIComponent(selectedPath)}`;

  useEffect(() => {
    const shouldOpenTerm = searchParams.get("etapa") === "termo";
    if (!shouldOpenTerm || !questionnaireDone || termScrolledIntoView.current) return;
    termScrolledIntoView.current = true;
    window.setTimeout(() => document.getElementById("procedure-term")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, [questionnaireDone, searchParams, selectedTerm]);

  function chooseProcedure(id: string) { setSelectedProcedureId(id); setError(""); router.replace(`/procedimentos?procedimento=${id}`, { scroll: false }); window.setTimeout(() => document.getElementById("procedure-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }), 20); }
  async function acceptTerm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedTerm || !questionnaireDone || authState !== "authenticated") return;
    const formData = new FormData(event.currentTarget);
    const signerName = String(formData.get("signerName") ?? "").trim();
    const signerStreet = String(formData.get("signerStreet") ?? "").trim();
    const signerNumber = String(formData.get("signerNumber") ?? "").trim();
    const signerPostalCode = String(formData.get("signerPostalCode") ?? "").replace(/\D/g, "");
    if (signerName.toLocaleLowerCase("pt-BR") !== patientName.toLocaleLowerCase("pt-BR")) { setError("Digite seu nome completo exatamente como aparece no cadastro."); return; }
    if (signerStreet.length < 3) { setError("Informe o nome completo da rua."); return; }
    if (!signerNumber) { setError("Informe o número do endereço."); return; }
    if (signerPostalCode.length !== 8) { setError("Informe um CEP válido com 8 números."); return; }
    setBusy(true); setError("");
    const result = await getSupabase().rpc("accept_procedure_term", { p_procedure_term_id: selectedTerm.id, p_signer_name: signerName, p_signer_street: signerStreet, p_signer_number: signerNumber, p_signer_postal_code: signerPostalCode });
    setBusy(false); if (result.error) { setError("Não foi possível registrar o aceite. Verifique se a atualização do Supabase foi aplicada."); return; }
    setAccepted((items) => [...items, { procedure_term_id: selectedTerm.id, accepted_at: new Date().toISOString() }]);
  }
  const schedulingUrl = selected ? whatsappUrl(`Olá, meu nome é ${patientName}. Conheci o procedimento ${selected.name} pelo site, concluí minha avaliação e gostaria de verificar a disponibilidade para agendamento.`) : "#";

  return <main className="patient-shell procedure-shell">
    <nav className="patient-nav"><Link className="return-button" href={authState === "authenticated" ? "/paciente" : "/"}>← {authState === "authenticated" ? "Voltar para minha conta" : "Voltar ao site"}</Link>{authState === "authenticated" ? <Link href="/paciente">Minha conta</Link> : <Link href={accessUrl}>Entrar</Link>}</nav>
    <header className="catalog-header"><p className="patient-kicker">Cuidado personalizado</p><h1>Qual procedimento combina com o seu objetivo?</h1><p>Explore o catálogo livremente. O acesso à conta será solicitado somente quando você decidir iniciar uma avaliação.</p></header>
    <section className="catalog-tools" aria-label="Filtros do catálogo"><label className="catalog-search"><Search aria-hidden="true" size={20}/><span className="sr-only">Pesquisar procedimento</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar procedimento ou objetivo" /></label><div className="category-filter" aria-label="Filtrar por categoria">{procedureCategories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div></section>
    {accountMessage && <p className="catalog-state" role="status">{accountMessage}</p>}
    <section className="catalog-grid" aria-label="Catálogo de procedimentos">{filtered.map((item) => <button type="button" className={selectedProcedureId === item.id ? "catalog-card selected" : "catalog-card"} key={item.id} aria-pressed={selectedProcedureId === item.id} onClick={() => chooseProcedure(item.id)}><span className="catalog-visual" aria-hidden="true"><span>{item.accent}</span></span><span className="catalog-card-body"><small>{item.category}</small><strong>{item.name}</strong><span>{item.summary}</span><b>Conhecer detalhes →</b></span></button>)}{filtered.length === 0 && <p className="catalog-empty">Nenhum procedimento encontrado. Tente outro termo.</p>}</section>
    {selected && <section className="procedure-journey" id="procedure-detail">
      <div className="journey-heading"><div className="journey-monogram" aria-hidden="true">{selected.accent}</div><div><p className="patient-kicker">Procedimento selecionado</p><h2>{selected.name}</h2><p>{selected.summary}</p></div></div>
      {authState !== "authenticated" ? <div className="guest-procedure-action"><p>Você pode conhecer todo o catálogo sem cadastro. Para responder à avaliação clínica e salvar dados, entre ou crie sua conta.</p><Link className="patient-submit inline-button journey-action" href={accessUrl}>Entrar para iniciar avaliação</Link></div> : <>
        <ol className="journey-steps" aria-label="Etapas da avaliação"><li className="complete"><span>1</span><div><strong>Procedimento escolhido</strong><small>Você pode trocar sua escolha a qualquer momento.</small></div></li><li className={questionnaireDone ? "complete" : "active"}><span>2</span><div><strong>Avaliação específica</strong><small>{questionnaireDone ? "Avaliação preenchida." : "Responda às perguntas relacionadas a este procedimento."}</small></div></li><li className={termAccepted ? "complete" : questionnaireDone ? "active" : ""}><span>3</span><div><strong>Termo de consentimento</strong><small>Leia e confirme somente após concluir a avaliação.</small></div></li><li className={termAccepted ? "active" : ""}><span>4</span><div><strong>Solicitar agendamento</strong><small>O WhatsApp será aberto com uma mensagem pronta.</small></div></li></ol>
        {!questionnaireDone && <Link className="patient-submit inline-button journey-action" href={`/questionario?procedimento=${selected.id}`}>Iniciar avaliação de {selected.name}</Link>}
        {questionnaireDone && selectedTerm && <section className="procedure-term" id="procedure-term">
          {searchParams.get("salvo") === "1" && <div className="questionnaire-return-success" role="status"><CircleCheck size={21} aria-hidden="true"/><div><strong>Avaliação salva com sucesso</strong><span>Agora leia o termo abaixo e confirme somente se estiver de acordo.</span></div></div>}
          <div className="term-heading"><div><p className="patient-kicker">Documento para leitura</p><h3>{selectedTerm.title}</h3><p className="consent-version">Versão: {selectedTerm.version}</p></div><span><LockKeyhole size={17} aria-hidden="true"/> Somente leitura</span></div>
          <div className="term-readonly-note"><FileText size={20} aria-hidden="true"/><p><strong>Não é necessário preencher o texto abaixo.</strong> Os traços e espaços em branco fazem parte do modelo original. Confira o conteúdo e use somente os campos de confirmação depois do documento.</p></div>
          <div className="consent-scroll" tabIndex={0} role="document" aria-label={`Conteúdo do termo de ${selected.name}`}>{selectedTerm.content.split(/\n{2,}/).map((paragraph,index) => paragraph.trim() && <p key={index}>{paragraph.trim()}</p>)}</div>
          {termAccepted ? <div className="term-success" role="status"><CircleCheck size={22} aria-hidden="true"/><div><strong>Aceite registrado com sucesso</strong><span>{selectedAcceptance ? `Registrado em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(selectedAcceptance.accepted_at))}. ` : ""}O próximo passo é consultar a disponibilidade de atendimento.</span></div></div> : <form className="patient-form consent-confirmation-form" onSubmit={acceptTerm}><div className="consent-confirmation-fields"><label className="consent-name-field">Digite seu nome completo para confirmar<input name="signerName" required minLength={2} maxLength={150} autoComplete="name"/></label><label className="consent-street-field">Rua<input name="signerStreet" required minLength={3} maxLength={180} autoComplete="address-line1" placeholder="Ex.: Rua Flor do Campo"/></label><label className="consent-number-field">Número<input name="signerNumber" required maxLength={20} inputMode="numeric" autoComplete="address-line2" placeholder="Ex.: 174"/></label><label className="consent-postal-field">CEP<input name="signerPostalCode" required inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" pattern="[0-9]{5}-?[0-9]{3}" maxLength={9}/></label></div><p className="consent-address-note">Rua, número e CEP ficarão vinculados somente a este aceite e aparecerão na ficha clínica protegida.</p><label className="consent-check"><input type="checkbox" required/> Li, compreendi e concordo com o termo deste procedimento.</label>{error && <p className="form-error" role="alert">{error}</p>}<button className="patient-submit" disabled={busy}>{busy ? "Registrando..." : "Aceitar termo"}</button></form>}
        </section>}
        {questionnaireDone && !selectedTerm && <div className="term-review-note"><strong>Termo em revisão</strong><p>A avaliação foi salva. O termo deste procedimento está sendo conferido antes de ser disponibilizado para assinatura.</p></div>}
        {termAccepted && <a className="patient-submit inline-button whatsapp-finish" href={schedulingUrl} target="_blank" rel="noopener noreferrer" data-track="whatsapp">Consultar disponibilidade pelo WhatsApp</a>}
      </>}
    </section>}
  </main>;
}
