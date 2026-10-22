"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { pathologyOptions, QUESTIONNAIRE_VERSION, yesNoQuestions } from "@/lib/clinical-questionnaire";

type SavedQuestionnaire = { answers: Record<string, unknown>; submitted_at: string | null };

export default function QuestionnairePage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [saved, setSaved] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const { data: auth } = await client.auth.getUser();
      if (!active) return;
      if (!auth.user) { router.replace("/acesso"); return; }
      setUserId(auth.user.id);
      const result = await client.from("clinical_questionnaires")
        .select("answers,submitted_at").eq("user_id", auth.user.id).maybeSingle<SavedQuestionnaire>();
      if (!active) return;
      if (result.error) setError("Não foi possível carregar o questionário.");
      else setSaved(result.data?.answers ?? {});
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const answers: Record<string, unknown> = {
      treatment_expectation: form.get("treatment_expectation"),
      birth_date: form.get("birth_date"), phone: form.get("phone"),
      address: form.get("address"), neighborhood: form.get("neighborhood"),
      blood_type: form.get("blood_type"),
      other_health_problems: form.get("other_health_problems"),
      pathologies: form.getAll("pathologies"),
    };
    for (const [key] of yesNoQuestions) {
      answers[key] = form.get(key);
      answers[`${key}_details`] = form.get(`${key}_details`);
    }
    setBusy(true);
    const client = getSupabase();
    const result = await client.from("clinical_questionnaires").upsert({
      user_id: userId,
      questionnaire_version: QUESTIONNAIRE_VERSION,
      answers,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setBusy(false);
    if (result.error) { setError("Não foi possível salvar. Confira os campos e tente novamente."); return; }
    router.replace("/paciente");
  }

  if (loading) return <main className="patient-shell"><p className="loading-message">Carregando seu histórico clínico...</p></main>;

  const value = (key: string) => typeof saved[key] === "string" ? String(saved[key]) : "";
  const selectedPathologies = Array.isArray(saved.pathologies) ? saved.pathologies.map(String) : [];

  return <main className="patient-shell questionnaire-shell">
    <nav className="patient-nav"><Link href="/paciente">Dra. Claudia Bonavoglia</Link><span>Histórico clínico</span></nav>
    <form className="patient-card questionnaire-card" onSubmit={submit}>
      <header className="questionnaire-header">
        <p className="patient-kicker">Etapa obrigatória</p>
        <h1>Conte um pouco sobre sua saúde</h1>
        <p>Estas informações são confidenciais e ajudam a profissional a avaliar a segurança do atendimento. Responda com atenção.</p>
      </header>

      <fieldset className="question-section">
        <legend>Dados pessoais e objetivo</legend>
        <div className="form-grid">
          <label className="wide">O que espera do tratamento?<textarea name="treatment_expectation" required defaultValue={value("treatment_expectation")} /></label>
          <label>Data de nascimento<input type="date" name="birth_date" required defaultValue={value("birth_date")} /></label>
          <label>Celular<input name="phone" required inputMode="tel" defaultValue={value("phone")} /></label>
          <label className="wide">Endereço<input name="address" required defaultValue={value("address")} /></label>
          <label>Bairro<input name="neighborhood" required defaultValue={value("neighborhood")} /></label>
          <label>Tipo sanguíneo<select name="blood_type" required defaultValue={value("blood_type")}><option value="">Selecione</option>{["A+","A-","B+","B-","AB+","AB-","O+","O-","Não sei"].map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
      </fieldset>

      <fieldset className="question-section">
        <legend>Dados clínicos</legend>
        <div className="clinical-list">
          {yesNoQuestions.map(([key, label, detail]) => <div className="clinical-question" key={key}>
            <p>{label}</p>
            <div className="binary-options">
              <label><input type="radio" name={key} value="Sim" required defaultChecked={value(key) === "Sim"} /> Sim</label>
              <label><input type="radio" name={key} value="Não" required defaultChecked={value(key) === "Não"} /> Não</label>
            </div>
            {detail && <label className="detail-field">{detail}<input name={`${key}_details`} defaultValue={value(`${key}_details`)} /></label>}
          </div>)}
        </div>
      </fieldset>

      <fieldset className="question-section">
        <legend>Patologias existentes</legend>
        <p className="field-help">Marque todas as opções que se aplicam.</p>
        <div className="check-grid">{pathologyOptions.map((item) => <label key={item}><input type="checkbox" name="pathologies" value={item} defaultChecked={selectedPathologies.includes(item)} /> {item}</label>)}</div>
        <label className="block-label">Outro(s) problema(s) de saúde<textarea name="other_health_problems" defaultValue={value("other_health_problems")} /></label>
      </fieldset>

      <label className="truth-check"><input type="checkbox" required /> Responsabilizo-me pela veracidade das respostas e entendo que devo informar mudanças no meu estado de saúde.</label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="patient-submit" disabled={busy}>{busy ? "Salvando..." : "Salvar histórico clínico"}</button>
    </form>
  </main>;
}
