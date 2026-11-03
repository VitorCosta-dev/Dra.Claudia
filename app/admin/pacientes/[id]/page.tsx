"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { questionLabels } from "@/lib/clinical-questionnaire";
import { procedureCatalog } from "@/lib/procedure-catalog";

type Patient = { full_name: string; email: string; cpf: string; created_at: string };
type Questionnaire = { answers: Record<string, unknown>; submitted_at: string; questionnaire_version: string };
type ProcedureQuestionnaire = Questionnaire & {
  procedure_id: string;
  procedures: { name: string } | { name: string }[] | null;
};
type ProcedureTerm = {
  title: string;
  version: string;
  procedures: { name: string } | { name: string }[];
};
type Consent = {
  signer_name: string;
  accepted_at: string;
  procedure_terms: ProcedureTerm | ProcedureTerm[] | null;
};

export default function PatientRecordPage() {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [procedureQuestionnaires, setProcedureQuestionnaires] = useState<ProcedureQuestionnaire[]>([]);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [state, setState] = useState("Carregando ficha...");

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const { data: auth } = await client.auth.getUser();
      if (!auth.user) { setState("Entre como administrador para acessar esta página."); return; }
      const membership = await client.from("admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
      if (!membership.data) { setState("Esta área é restrita aos administradores."); return; }
      const [profile, history, procedureHistory, acceptance] = await Promise.all([
        client.from("patients").select("full_name,email,cpf,created_at").eq("user_id", params.id).maybeSingle<Patient>(),
        client.from("clinical_questionnaires").select("answers,submitted_at,questionnaire_version").eq("user_id", params.id).maybeSingle<Questionnaire>(),
        client.from("procedure_questionnaires").select("procedure_id,answers,submitted_at,questionnaire_version,procedures(name)").eq("user_id", params.id).order("submitted_at", { ascending: false }),
        client.from("procedure_consents").select("signer_name,accepted_at,procedure_terms(title,version,procedures(name))").eq("user_id", params.id).order("accepted_at", { ascending: false }),
      ]);
      if (!active) return;
      if (profile.error || history.error || acceptance.error) { setState("Não foi possível carregar a ficha deste paciente."); return; }
      setPatient(profile.data); setQuestionnaire(history.data); setProcedureQuestionnaires((procedureHistory.data ?? []) as ProcedureQuestionnaire[]); setConsents((acceptance.data ?? []) as Consent[]); setState("");
    }
    void load();
    return () => { active = false; };
  }, [params.id]);

  const answerEntries = questionnaire ? Object.entries(questionnaire.answers).filter(([key]) => !key.endsWith("_details")) : [];
  const printable = (value: unknown) => Array.isArray(value) ? (value.length ? value.join(", ") : "Nenhuma informada") : String(value || "Não informado");
  const procedureLabels = Object.fromEntries(procedureCatalog.flatMap((item) => item.questions.map(([key, label]) => [key, label])));
  const clinicalLabels: Record<string, string> = {
    ...questionLabels, ...procedureLabels,
    treatment_goal: "Objetivo do tratamento", treatment_area: "Região que deseja tratar",
    infectious_condition: "Possui infecção, inflamação ou doença contagiosa ativa?",
    other_health_information: "Outras informações de saúde",
  };

  return <main className="patient-shell admin-shell">
    <nav className="patient-nav"><Link href="/admin">← Pacientes</Link><span>Ficha clínica</span></nav>
    <section className="patient-card admin-card record-card">
      {state && <p role="status">{state}</p>}
      {patient && <>
        <p className="patient-kicker">Paciente</p><h1>{patient.full_name}</h1>
        <dl className="record-summary"><div><dt>E-mail</dt><dd>{patient.email}</dd></div><div><dt>CPF</dt><dd>{patient.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</dd></div><div><dt>Cadastrado em</dt><dd>{new Date(patient.created_at).toLocaleString("pt-BR")}</dd></div></dl>
        <section className="record-section"><h2>Avaliações por procedimento</h2>{procedureQuestionnaires.length ? procedureQuestionnaires.map((item) => {
          const relation = Array.isArray(item.procedures) ? item.procedures[0] : item.procedures;
          const procedureName = relation?.name ?? procedureCatalog.find((procedure) => procedure.id === item.procedure_id)?.name ?? item.procedure_id;
          const entries = Object.entries(item.answers).filter(([key]) => !key.endsWith("_details"));
          return <article className="procedure-record" key={`${item.procedure_id}-${item.questionnaire_version}`}><h3>{procedureName}</h3><p className="record-meta">Enviado em {new Date(item.submitted_at).toLocaleString("pt-BR")} · {item.questionnaire_version}</p><dl className="record-list">{entries.map(([key, answer]) => <div key={key}><dt>{clinicalLabels[key] ?? key}</dt><dd>{printable(answer)}{item.answers[`${key}_details`] ? <small>{String(item.answers[`${key}_details`])}</small> : null}</dd></div>)}</dl></article>;
        }) : <p>O paciente ainda não enviou uma avaliação específica.</p>}</section>
        <section className="record-section"><h2>Consentimentos por procedimento</h2>{consents.length ? consents.map((consent, index) => {
          const relation = Array.isArray(consent.procedure_terms) ? consent.procedure_terms[0] : consent.procedure_terms;
          const procedure = relation && (Array.isArray(relation.procedures) ? relation.procedures[0]?.name : relation.procedures?.name);
          return <dl className="record-list consent-record" key={`${consent.accepted_at}-${index}`}><div><dt>Procedimento</dt><dd>{procedure ?? "Não informado"}</dd></div><div><dt>Termo</dt><dd>{relation?.title ?? "Não informado"}</dd></div><div><dt>Versão</dt><dd>{relation?.version ?? "Não informada"}</dd></div><div><dt>Nome confirmado</dt><dd>{consent.signer_name}</dd></div><div><dt>Aceito em</dt><dd>{new Date(consent.accepted_at).toLocaleString("pt-BR")}</dd></div></dl>;
        }) : <p>Não há termos de procedimento aceitos por este paciente.</p>}</section>
        <section className="record-section"><h2>Histórico clínico</h2>{questionnaire ? <><p className="record-meta">Enviado em {new Date(questionnaire.submitted_at).toLocaleString("pt-BR")} · {questionnaire.questionnaire_version}</p><dl className="record-list">{answerEntries.map(([key, answer]) => <div key={key}><dt>{questionLabels[key] ?? key}</dt><dd>{printable(answer)}{questionnaire.answers[`${key}_details`] ? <small>{String(questionnaire.answers[`${key}_details`])}</small> : null}</dd></div>)}</dl></> : <p>O paciente ainda não preencheu o histórico clínico.</p>}</section>
      </>}
    </section>
  </main>;
}
