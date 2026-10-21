"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { questionLabels } from "@/lib/clinical-questionnaire";

type Patient = { full_name: string; email: string; cpf: string; created_at: string };
type Questionnaire = { answers: Record<string, unknown>; submitted_at: string; questionnaire_version: string };
type Consent = {
  signer_name: string;
  accepted_at: string;
  procedure_terms: {
    title: string;
    version: string;
    procedures: { name: string } | { name: string }[];
  } | null;
};

export default function PatientRecordPage() {
  const params = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
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
      const [profile, history, acceptance] = await Promise.all([
        client.from("patients").select("full_name,email,cpf,created_at").eq("user_id", params.id).maybeSingle<Patient>(),
        client.from("clinical_questionnaires").select("answers,submitted_at,questionnaire_version").eq("user_id", params.id).maybeSingle<Questionnaire>(),
        client.from("procedure_consents").select("signer_name,accepted_at,procedure_terms(title,version,procedures(name))").eq("user_id", params.id).order("accepted_at", { ascending: false }),
      ]);
      if (!active) return;
      if (profile.error || history.error || acceptance.error) { setState("Não foi possível carregar a ficha deste paciente."); return; }
      setPatient(profile.data); setQuestionnaire(history.data); setConsents((acceptance.data ?? []) as Consent[]); setState("");
    }
    void load();
    return () => { active = false; };
  }, [params.id]);

  const answerEntries = questionnaire ? Object.entries(questionnaire.answers).filter(([key]) => !key.endsWith("_details")) : [];
  const printable = (value: unknown) => Array.isArray(value) ? (value.length ? value.join(", ") : "Nenhuma informada") : String(value || "Não informado");

  return <main className="patient-shell admin-shell">
    <nav className="patient-nav"><Link href="/admin">← Pacientes</Link><span>Ficha clínica</span></nav>
    <section className="patient-card admin-card record-card">
      {state && <p role="status">{state}</p>}
      {patient && <>
        <p className="patient-kicker">Paciente</p><h1>{patient.full_name}</h1>
        <dl className="record-summary"><div><dt>E-mail</dt><dd>{patient.email}</dd></div><div><dt>CPF</dt><dd>{patient.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</dd></div><div><dt>Cadastrado em</dt><dd>{new Date(patient.created_at).toLocaleString("pt-BR")}</dd></div></dl>
        <section className="record-section"><h2>Consentimentos por procedimento</h2>{consents.length ? consents.map((consent, index) => {
          const relation = consent.procedure_terms;
          const procedure = relation && (Array.isArray(relation.procedures) ? relation.procedures[0]?.name : relation.procedures?.name);
          return <dl className="record-list consent-record" key={`${consent.accepted_at}-${index}`}><div><dt>Procedimento</dt><dd>{procedure ?? "Não informado"}</dd></div><div><dt>Termo</dt><dd>{relation?.title ?? "Não informado"}</dd></div><div><dt>Versão</dt><dd>{relation?.version ?? "Não informada"}</dd></div><div><dt>Nome confirmado</dt><dd>{consent.signer_name}</dd></div><div><dt>Aceito em</dt><dd>{new Date(consent.accepted_at).toLocaleString("pt-BR")}</dd></div></dl>;
        }) : <p>Não há termos de procedimento aceitos por este paciente.</p>}</section>
        <section className="record-section"><h2>Histórico clínico</h2>{questionnaire ? <><p className="record-meta">Enviado em {new Date(questionnaire.submitted_at).toLocaleString("pt-BR")} · {questionnaire.questionnaire_version}</p><dl className="record-list">{answerEntries.map(([key, answer]) => <div key={key}><dt>{questionLabels[key] ?? key}</dt><dd>{printable(answer)}{questionnaire.answers[`${key}_details`] ? <small>{String(questionnaire.answers[`${key}_details`])}</small> : null}</dd></div>)}</dl></> : <p>O paciente ainda não preencheu o histórico clínico.</p>}</section>
      </>}
    </section>
  </main>;
}
