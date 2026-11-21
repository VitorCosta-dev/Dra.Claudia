"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getAdminAccess } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";

type PrivacyRequest = { id: string; patient_name: string; request_type: string; details: string; status: string; created_at: string; resolution_notes: string | null };
const labels: Record<string, string> = { access: "Acesso", correction: "Correção", deletion: "Eliminação", revocation: "Revogação", other: "Outra" };
const statusLabels: Record<string, string> = { received: "Recebida", in_review: "Em análise", completed: "Concluída", rejected: "Recusada com fundamento" };

export default function AdminPrivacyPage() {
  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [state, setState] = useState("Carregando solicitações...");
  const [needsMfa, setNeedsMfa] = useState(false);

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const access = await getAdminAccess(client);
      if (!active) return;
      if (access.status === "mfa_required") { setNeedsMfa(true); setState("Confirme o segundo fator para consultar solicitações."); return; }
      if (access.status !== "authorized") { setState("Acesso administrativo não autorizado."); return; }
      const result = await client.rpc("admin_list_privacy_requests");
      if (!active) return;
      if (result.error) { setState("Não foi possível carregar as solicitações."); return; }
      setRequests((result.data ?? []) as PrivacyRequest[]);
      setState("");
    }
    void load();
    return () => { active = false; };
  }, []);

  async function update(request: PrivacyRequest, status: string, notes: string) {
    setState("Atualizando solicitação...");
    const result = await getSupabase().rpc("admin_update_privacy_request", { p_request_id: request.id, p_status: status, p_resolution_notes: notes || null });
    if (result.error) { setState("Não foi possível atualizar a solicitação."); return; }
    setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status, resolution_notes: notes || null } : item));
    setState("Solicitação atualizada.");
  }

  const open = requests.filter((request) => request.status !== "completed" && request.status !== "rejected").length;
  return <AdminShell active="privacy">
    <header className="admin-page-header"><div><p className="admin-eyebrow">LGPD e atendimento</p><h1>Privacidade</h1><span>Acompanhe solicitações dos pacientes e registre cada decisão.</span></div><Link className="admin-outline-link" href="/privacidade">Ver política pública ↗</Link></header>
    {state && <section className="admin-feedback slim" role="status"><span aria-hidden="true">{needsMfa ? "!" : "✓"}</span><div><strong>{state}</strong>{needsMfa && <Link href="/admin/seguranca">Confirmar autenticação →</Link>}</div></section>}
    <section className="admin-overview privacy"><article><span>Total de solicitações</span><strong>{requests.length.toString().padStart(2, "0")}</strong><small>registros disponíveis</small></article><article><span>Em andamento</span><strong>{open.toString().padStart(2, "0")}</strong><small>exigem acompanhamento</small></article><article><span>Finalizadas</span><strong>{(requests.length - open).toString().padStart(2, "0")}</strong><small>concluídas ou fundamentadas</small></article></section>
    <section className="admin-data-panel"><div className="admin-data-heading"><div><p className="admin-eyebrow">Solicitações</p><h2>Direitos dos titulares</h2></div><span>{requests.length} registro(s)</span></div><div className="admin-privacy-requests">{requests.map((request) => <PrivacyRequestItem key={request.id} request={request} onUpdate={update} />)}</div>{!state && requests.length === 0 && <div className="admin-empty"><span aria-hidden="true">✓</span><strong>Nenhuma solicitação pendente</strong><p>Quando um paciente enviar um pedido, ele aparecerá aqui.</p></div>}</section>
  </AdminShell>;
}

function PrivacyRequestItem({ request, onUpdate }: { request: PrivacyRequest; onUpdate: (request: PrivacyRequest, status: string, notes: string) => Promise<void> }) {
  const [status, setStatus] = useState(request.status);
  const [notes, setNotes] = useState(request.resolution_notes ?? "");
  return <article><header><div><p className="admin-eyebrow">{labels[request.request_type] ?? request.request_type}</p><h3>{request.patient_name}</h3><small>Recebida em {new Date(request.created_at).toLocaleString("pt-BR")}</small></div><span className={`admin-request-status ${request.status}`}>{statusLabels[request.status] ?? request.status}</span></header><p>{request.details}</p><div className="admin-request-fields"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="received">Recebida</option><option value="in_review">Em análise</option><option value="completed">Concluída</option><option value="rejected">Recusada com fundamento</option></select></label><label>Notas da análise<textarea value={notes} onChange={(event) => setNotes(event.target.value.slice(0, 4000))} rows={4} maxLength={4000} placeholder="Registre a análise e a decisão tomada." /></label></div><button className="admin-primary-button" type="button" onClick={() => void onUpdate(request, status, notes)}>Salvar andamento</button></article>;
}
