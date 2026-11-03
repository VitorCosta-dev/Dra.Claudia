"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { procedureById } from "@/lib/procedure-catalog";

const commonSafetyQuestions = [
  ["medical_treatment", "Atualmente está sob tratamento médico?", "Informe o motivo"],
  ["medications", "Utiliza algum medicamento atualmente?", "Informe nome e finalidade"],
  ["medication_allergy", "Possui alergia a medicamento, anestésico ou substância?", "Qual?"],
  ["anticoagulants", "Usa anticoagulante, AAS, aspirina ou medicamento semelhante?", "Qual?"],
  ["pregnant", "Está grávida, amamentando ou com suspeita de gestação?", "Descreva, se necessário"],
  ["healing_difficulty", "Possui dificuldade de cicatrização ou tendência a queloide?", "Descreva"],
  ["infectious_condition", "Possui infecção, inflamação ou doença contagiosa ativa?", "Descreva"],
] as const;

type SavedQuestionnaire = { answers: Record<string, unknown>; submitted_at: string };

export default function QuestionnairePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const procedureId = searchParams.get("procedimento") ?? "";
  const procedure = procedureById[procedureId];
  const [userId, setUserId] = useState("");
  const [saved, setSaved] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!procedure) { router.replace("/procedimentos"); return; }
    let active = true;
    const client = getSupabase();
    async function load() {
      const { data: auth } = await client.auth.getUser();
      if (!active) return;
      if (!auth.user) { router.replace("/acesso"); return; }
      setUserId(auth.user.id);
      const result = await client.from("procedure_questionnaires").select("answers,submitted_at")
        .eq("user_id", auth.user.id).eq("procedure_id", procedure.id).eq("questionnaire_version", `${procedure.id}-v1`).maybeSingle<SavedQuestionnaire>();
      if (!active) return;
      if (result.error) setError("Não foi possível carregar esta avaliação. Verifique se a atualização do banco foi aplicada.");
      else setSaved(result.data?.answers ?? {});
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [procedure, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!procedure) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const answers: Record<string, unknown> = {
      treatment_goal: form.get("treatment_goal"), treatment_area: form.get("treatment_area"),
      birth_date: form.get("birth_date"), phone: form.get("phone"),
      other_health_information: form.get("other_health_information"),
    };
    for (const [key] of [...commonSafetyQuestions, ...procedure.questions]) {
      answers[key] = form.get(key);
      answers[`${key}_details`] = form.get(`${key}_details`);
    }
    setBusy(true);
    const result = await getSupabase().from("procedure_questionnaires").upsert({
      user_id: userId, procedure_id: procedure.id, questionnaire_version: `${procedure.id}-v1`, answers,
    }, { onConflict: "user_id,procedure_id,questionnaire_version" });
    setBusy(false);
    if (result.error) { setError("Não foi possível salvar. Confira os campos e tente novamente."); return; }
    router.replace(`/procedimentos?procedimento=${procedure.id}`);
  }

  if (!procedure || loading) return <main className="patient-shell"><p className="loading-message">Carregando sua avaliação...</p></main>;
  const value = (key: string) => typeof saved[key] === "string" ? String(saved[key]) : "";

  return <main className="patient-shell questionnaire-shell">
    <nav className="patient-nav"><Link href={`/procedimentos?procedimento=${procedure.id}`}>← Voltar ao procedimento</Link><span>Avaliação</span></nav>
    <form className="patient-card questionnaire-card" onSubmit={submit}>
      <header className="questionnaire-header"><p className="patient-kicker">Avaliação específica</p><h1>{procedure.name}</h1><p>As perguntas abaixo foram selecionadas para este procedimento. Suas respostas são confidenciais e serão avaliadas pela profissional antes do atendimento.</p></header>
      <div className="questionnaire-progress"><span>Procedimento</span><b aria-hidden="true" /><strong>Avaliação</strong><b aria-hidden="true" /><span>Termo</span><b aria-hidden="true" /><span>Agendamento</span></div>

      <fieldset className="question-section"><legend>Objetivo e contato</legend><div className="form-grid">
        <label className="wide">O que deseja melhorar ou tratar?<textarea name="treatment_goal" required defaultValue={value("treatment_goal")} /></label>
        <label className="wide">Região que deseja tratar<input name="treatment_area" required defaultValue={value("treatment_area")} /></label>
        <label>Data de nascimento<input type="date" name="birth_date" required defaultValue={value("birth_date")} /></label>
        <label>Celular<input name="phone" required inputMode="tel" defaultValue={value("phone")} /></label>
      </div></fieldset>

      <fieldset className="question-section"><legend>Segurança clínica</legend><div className="clinical-list">{commonSafetyQuestions.map(([key, label, detail]) => <Question key={key} name={key} label={label} detail={detail} value={value} />)}</div></fieldset>
      <fieldset className="question-section"><legend>Perguntas sobre {procedure.name}</legend><div className="clinical-list">{procedure.questions.map(([key, label, detail]) => <Question key={key} name={key} label={label} detail={detail} value={value} />)}</div></fieldset>
      <fieldset className="question-section"><legend>Informações adicionais</legend><label className="block-label">Existe algo mais sobre sua saúde que a profissional precisa saber?<textarea name="other_health_information" defaultValue={value("other_health_information")} /></label></fieldset>

      <label className="truth-check"><input type="checkbox" required /> Confirmo que as respostas são verdadeiras e entendo que a realização do procedimento depende da avaliação profissional.</label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="patient-submit" disabled={busy}>{busy ? "Salvando..." : "Salvar e continuar para o termo"}</button>
    </form>
  </main>;
}

function Question({ name, label, detail, value }: { name: string; label: string; detail?: string; value: (key: string) => string }) {
  return <div className="clinical-question"><p>{label}</p><div className="binary-options">
    <label><input type="radio" name={name} value="Sim" required defaultChecked={value(name) === "Sim"} /> Sim</label>
    <label><input type="radio" name={name} value="Não" required defaultChecked={value(name) === "Não"} /> Não</label>
  </div>{detail && <label className="detail-field">{detail}<input name={`${name}_details`} defaultValue={value(`${name}_details`)} /></label>}</div>;
}
