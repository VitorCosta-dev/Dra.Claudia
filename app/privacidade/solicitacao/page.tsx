"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const requestLabels: Record<string, string> = {
  access: "Acesso aos meus dados",
  correction: "Correção de dados",
  deletion: "Eliminação ou anonimização",
  revocation: "Revogação de consentimento",
  other: "Outra solicitação",
};

type PrivacyRequest = { id: string; request_type: string; status: string; created_at: string };

export default function PrivacyRequestPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [requestType, setRequestType] = useState("access");
  const [details, setDetails] = useState("");
  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [state, setState] = useState("Carregando...");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const { data: auth } = await client.auth.getUser();
      if (!auth.user) { router.replace("/acesso?next=%2Fprivacidade%2Fsolicitacao"); return; }
      const result = await client.from("privacy_requests").select("id,request_type,status,created_at").eq("user_id", auth.user.id).order("created_at", { ascending: false });
      if (!active) return;
      setUserId(auth.user.id);
      if (result.error) { setState("Não foi possível carregar suas solicitações."); return; }
      setRequests((result.data ?? []) as PrivacyRequest[]);
      setState("");
    }
    void load();
    return () => { active = false; };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanDetails = details.trim();
    if (cleanDetails.length < 10) { setState("Descreva sua solicitação com pelo menos 10 caracteres."); return; }
    setSubmitting(true);
    setState("Registrando solicitação...");
    const result = await getSupabase().rpc("submit_privacy_request", { p_request_type: requestType, p_details: cleanDetails });
    setSubmitting(false);
    if (result.error) { setState("Não foi possível registrar agora. Tente novamente ou use o WhatsApp indicado na política."); return; }
    setRequests((current) => [{ id: String(result.data), request_type: requestType, status: "received", created_at: new Date().toISOString() }, ...current]);
    setDetails("");
    setState("Solicitação registrada. A Dra. Claudia e sua equipe analisarão o caso e retornarão o mais breve possível, respeitando as obrigações legais aplicáveis.");
  }

  return <main className="patient-shell">
    <nav className="patient-nav"><Link className="return-button" href="/paciente">← Voltar para minha conta</Link><Link href="/privacidade">Ler política</Link></nav>
    <section className="patient-card privacy-request-card">
      <p className="patient-kicker">Direitos do titular</p>
      <h1>Solicitação de privacidade</h1>
      <p>Use este canal autenticado para registrar um pedido relacionado aos seus dados. Cada caso será analisado pela Dra. Claudia e sua equipe, com retorno o mais breve possível, respeitando as obrigações legais aplicáveis. A solicitação poderá exigir confirmação adicional de identidade.</p>
      <form className="privacy-request-form" onSubmit={submit}>
        <label htmlFor="request-type">Tipo de solicitação</label>
        <select id="request-type" value={requestType} onChange={(event) => setRequestType(event.target.value)}>
          {Object.entries(requestLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <label htmlFor="request-details">Explique o que você precisa</label>
        <textarea id="request-details" value={details} onChange={(event) => setDetails(event.target.value.slice(0, 2000))} minLength={10} maxLength={2000} rows={6} required />
        <small>{details.length}/2000 caracteres</small>
        <button className="patient-submit" type="submit" disabled={submitting || !userId}>{submitting ? "Enviando..." : "Registrar solicitação"}</button>
      </form>
      <p role="status">{state}</p>
      {requests.length > 0 && <section className="privacy-request-history"><h2>Solicitações anteriores</h2><ul>{requests.map((request) => <li key={request.id}><strong>{requestLabels[request.request_type] ?? request.request_type}</strong><span>{new Date(request.created_at).toLocaleDateString("pt-BR")} · {request.status === "received" ? "Recebida" : request.status}</span></li>)}</ul></section>}
    </section>
  </main>;
}
