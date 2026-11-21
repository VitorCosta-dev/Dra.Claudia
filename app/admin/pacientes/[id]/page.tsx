"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getAdminAccess } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";
import { questionLabels } from "@/lib/clinical-questionnaire";
import { procedureCatalog } from "@/lib/procedure-catalog";

type Patient = { full_name: string; email: string; cpf: string; birth_date?: string | null; phone?: string | null; created_at: string };
type Questionnaire = { answers: Record<string, unknown>; submitted_at: string; questionnaire_version: string };
type ProcedureQuestionnaire = Questionnaire & { id: number; procedure_id: string; procedure_name: string; revision: number };
type Consent = { id: number; signer_name: string; signer_address?: string | null; signer_street?: string | null; signer_number?: string | null; signer_postal_code?: string | null; accepted_at: string; term_title_snapshot: string; term_version_snapshot: string; accepted_questionnaire_id: number | null };
type PatientRecord = { patient: Patient; legacy_questionnaire: Questionnaire | null; procedure_questionnaires: ProcedureQuestionnaire[]; consents: Consent[] };

export default function PatientRecordPage() {
  const params = useParams<{ id: string }>();
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [state, setState] = useState("Carregando ficha protegida...");
  const [needsMfa, setNeedsMfa] = useState(false);

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const access = await getAdminAccess(client);
      if (!active) return;
      if (access.status === "mfa_required") { setNeedsMfa(true); setState("Confirme o segundo fator para acessar esta ficha."); return; }
      if (access.status === "unauthenticated") { setState("Entre como administrador para acessar esta página."); return; }
      if (access.status === "forbidden") { setState("Esta área é restrita aos administradores."); return; }
      if (access.status !== "authorized") { setState("Não foi possível verificar sua permissão."); return; }

      const result = await client.rpc("admin_get_patient_record", { p_user_id: params.id });
      if (!active) return;
      if (result.error || !result.data) { setState("Não foi possível carregar a ficha deste paciente."); return; }
      setRecord(result.data as unknown as PatientRecord);
      setState("");
    }
    void load();
    return () => { active = false; };
  }, [params.id]);

  const printable = (value: unknown) => Array.isArray(value) ? (value.length ? value.join(", ") : "Nenhuma informada") : String(value || "Não informado");
  const procedureLabels = Object.fromEntries(procedureCatalog.flatMap((item) => item.questions.map(([key, label]) => [key, label])));
  const clinicalLabels: Record<string, string> = { ...questionLabels, ...procedureLabels, treatment_goal: "Objetivo do tratamento", treatment_area: "Região que deseja tratar", infectious_condition: "Possui infecção, inflamação ou doença contagiosa ativa?", other_health_information: "Outras informações de saúde" };
  const legacyEntries = record?.legacy_questionnaire ? Object.entries(record.legacy_questionnaire.answers).filter(([key]) => !key.endsWith("_details")) : [];

  return <AdminShell active="patients">
    <div className="admin-record-top"><Link href="/admin">← Voltar aos pacientes</Link><span>Ficha clínica auditada</span></div>
    {state && <section className="admin-feedback" role="status"><span aria-hidden="true">{needsMfa ? "!" : "…"}</span><div><strong>{state}</strong>{needsMfa && <Link href="/admin/seguranca">Confirmar autenticação →</Link>}</div></section>}
    {record && <>
      <header className="admin-page-header admin-patient-header"><div><p className="admin-eyebrow">Ficha do paciente</p><h1>{record.patient.full_name}</h1><span>Cadastro realizado em {new Date(record.patient.created_at).toLocaleString("pt-BR")}</span></div><div className="admin-record-actions"><span className="admin-session-badge"><i aria-hidden="true" /> Dados protegidos</span><button type="button" className="admin-print-button" onClick={() => window.print()}>Gerar PDF da ficha</button></div></header>

      <section className="admin-patient-summary"><article><span>E-mail</span><strong>{record.patient.email}</strong></article><article><span>CPF</span><strong>{record.patient.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</strong></article><article><span>Nascimento</span><strong>{record.patient.birth_date ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${record.patient.birth_date}T00:00:00Z`)) : "Não informado"}</strong></article><article><span>Celular</span><strong>{record.patient.phone || "Não informado"}</strong></article><article><span>Avaliações</span><strong>{record.procedure_questionnaires.length.toString().padStart(2, "0")}</strong></article><article><span>Consentimentos</span><strong>{record.consents.length.toString().padStart(2, "0")}</strong></article></section>

      <section className="admin-clinical-section"><header><span>01</span><div><h2>Avaliações por procedimento</h2><p>Respostas clínicas declaradas pelo paciente para cada cuidado escolhido.</p></div></header>{record.procedure_questionnaires.length ? <div className="admin-clinical-list">{record.procedure_questionnaires.map((item) => {
        const entries = Object.entries(item.answers).filter(([key]) => !key.endsWith("_details"));
        return <article className="admin-clinical-record" key={item.id}><header><div><p className="admin-eyebrow">Procedimento</p><h3>{item.procedure_name}</h3><small>Enviado em {new Date(item.submitted_at).toLocaleString("pt-BR")} · revisão {item.revision} · {item.questionnaire_version}</small></div><span>Concluída</span></header><dl>{entries.map(([key, answer]) => <div key={key}><dt>{clinicalLabels[key] ?? key}</dt><dd>{printable(answer)}{item.answers[`${key}_details`] ? <small>{String(item.answers[`${key}_details`])}</small> : null}</dd></div>)}</dl></article>;
      })}</div> : <div className="admin-empty compact"><strong>Nenhuma avaliação específica</strong><p>O paciente ainda não enviou uma avaliação por procedimento.</p></div>}</section>

      <section className="admin-clinical-section"><header><span>02</span><div><h2>Consentimentos</h2><p>Versões preservadas dos termos aceitos pelo paciente.</p></div></header>{record.consents.length ? <div className="admin-consent-list">{record.consents.map((consent) => <article key={consent.id}><header><span>Termo aceito</span><strong>{consent.term_title_snapshot}</strong></header><dl><div><dt>Versão preservada</dt><dd>{consent.term_version_snapshot}</dd></div><div><dt>Nome confirmado</dt><dd>{consent.signer_name}</dd></div><div className="admin-consent-address"><dt>Rua</dt><dd>{consent.signer_street || consent.signer_address || "Não registrada neste aceite anterior"}</dd></div><div><dt>Número</dt><dd>{consent.signer_number || "Não registrado"}</dd></div><div><dt>CEP</dt><dd>{consent.signer_postal_code ? consent.signer_postal_code.replace(/^(\d{5})(\d{3})$/, "$1-$2") : "Não registrado"}</dd></div><div><dt>Aceito em</dt><dd>{new Date(consent.accepted_at).toLocaleString("pt-BR")}</dd></div><div><dt>Avaliação vinculada</dt><dd>{consent.accepted_questionnaire_id ? `Registro ${consent.accepted_questionnaire_id}` : "Registro anterior à vinculação"}</dd></div></dl></article>)}</div> : <div className="admin-empty compact"><strong>Nenhum consentimento registrado</strong><p>Não há termos de procedimento aceitos por este paciente.</p></div>}</section>

      <details className="admin-legacy-record"><summary><span>03</span><div><strong>Histórico clínico anterior</strong><small>Ficha geral usada antes da jornada por procedimento</small></div><b aria-hidden="true">＋</b></summary>{record.legacy_questionnaire ? <div><p>Enviado em {new Date(record.legacy_questionnaire.submitted_at).toLocaleString("pt-BR")} · {record.legacy_questionnaire.questionnaire_version}</p><dl>{legacyEntries.map(([key, answer]) => <div key={key}><dt>{questionLabels[key] ?? key}</dt><dd>{printable(answer)}{record.legacy_questionnaire?.answers[`${key}_details`] ? <small>{String(record.legacy_questionnaire.answers[`${key}_details`])}</small> : null}</dd></div>)}</dl></div> : <p>O paciente não possui a ficha geral anterior.</p>}</details>
    </>}
  </AdminShell>;
}
