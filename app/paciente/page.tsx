"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { procedureById } from "@/lib/procedure-catalog";
type Patient = { full_name: string; email: string; cpf: string; birth_date: string | null; phone: string | null };
type ProcedureEvaluation = { procedure_id: string; submitted_at: string; revision: number };
type ProcedureTermRelation = { procedure_id: string; version: string; title: string };
type ProcedureConsent = { accepted_at: string; procedure_terms: ProcedureTermRelation | ProcedureTermRelation[] | null };
type ProcedureProgress = { id: string; name: string; evaluatedAt?: string; acceptedAt?: string; termVersion?: string };

export default function PatientPage() {
  const router = useRouter();
  const [patient,setPatient] = useState<Patient|null>(null); const [admin,setAdmin] = useState(false); const [evaluations,setEvaluations] = useState<ProcedureEvaluation[]>([]); const [consents,setConsents] = useState<ProcedureConsent[]>([]); const [state,setState] = useState("Carregando seus dados...");
  useEffect(() => { let active=true; const client=getSupabase(); async function load(){ const {data:auth}=await client.auth.getUser(); if(!active)return; if(!auth.user){router.replace("/acesso?next=%2Fpaciente");return;} const [profile,membership,evaluations,consents]=await Promise.all([
    client.from("patients").select("full_name,email,cpf,birth_date,phone").eq("user_id",auth.user.id).maybeSingle(), client.from("admins").select("user_id").eq("user_id",auth.user.id).maybeSingle(), client.from("procedure_questionnaires").select("procedure_id,submitted_at,revision").eq("user_id",auth.user.id).order("submitted_at",{ascending:false}), client.from("procedure_consents").select("accepted_at,procedure_terms(procedure_id,version,title)").eq("user_id",auth.user.id).order("accepted_at",{ascending:false}),
  ]); if(!active)return; if(profile.error||membership.error){setState("Não foi possível carregar seus dados. Tente novamente mais tarde.");return;} setPatient(profile.data);setAdmin(Boolean(membership.data));setEvaluations((evaluations.data??[]) as ProcedureEvaluation[]);setConsents((consents.data??[]) as unknown as ProcedureConsent[]);setState(evaluations.error||consents.error?"Seus dados foram carregados, mas o andamento não pôde ser atualizado agora.":""); } void load(); return()=>{active=false;};},[router]);
  async function signOut(){await getSupabase().auth.signOut();router.replace("/acesso");}
  const hasEvaluation=evaluations.length>0, hasConsent=consents.length>0;
  const procedureProgress = (() => {
    const items = new Map<string, ProcedureProgress>();
    for (const evaluation of evaluations) {
      if (!items.has(evaluation.procedure_id)) items.set(evaluation.procedure_id,{id:evaluation.procedure_id,name:procedureById[evaluation.procedure_id]?.name??evaluation.procedure_id,evaluatedAt:evaluation.submitted_at});
    }
    for (const consent of consents) {
      const relation=Array.isArray(consent.procedure_terms)?consent.procedure_terms[0]:consent.procedure_terms;
      if(!relation) continue;
      const current=items.get(relation.procedure_id)??{id:relation.procedure_id,name:procedureById[relation.procedure_id]?.name??relation.title};
      items.set(relation.procedure_id,{...current,acceptedAt:consent.accepted_at,termVersion:relation.version});
    }
    return [...items.values()].sort((a,b)=>new Date(b.acceptedAt??b.evaluatedAt??0).getTime()-new Date(a.acceptedAt??a.evaluatedAt??0).getTime());
  })();
  const formatDate=(value?:string)=>value?new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value)):"";
  const nextAction=hasConsent?{eyebrow:"Acompanhamento",title:"Consulte seus procedimentos",text:"Revise as etapas concluídas e escolha como deseja continuar.",label:"Ver meus procedimentos"}:hasEvaluation?{eyebrow:"Próxima etapa",title:"Revise o termo do procedimento",text:"Sua avaliação foi salva. Volte ao procedimento escolhido para ler e confirmar o termo disponível.",label:"Continuar meu processo"}:{eyebrow:"Comece por aqui",title:"Encontre o cuidado ideal para você",text:"Conheça as opções e inicie somente a avaliação relacionada ao procedimento que escolher.",label:"Explorar procedimentos"};
  return <main className="patient-shell patient-home"><nav className="patient-nav"><Link className="return-button" href="/">← Voltar ao site da Dra. Claudia</Link><button className="patient-nav-action" onClick={signOut}>Sair da conta</button></nav><div className="patient-dashboard">
    <header className="patient-welcome"><div><p className="patient-kicker">Minha conta</p><h1>{patient?`Olá, ${patient.full_name.split(" ")[0]}`:"Área do paciente"}</h1></div><p>Acompanhe seu cuidado com clareza e saiba sempre qual é o próximo passo.</p></header>
    {state&&<p className="patient-status" role="status">{state}</p>}
    {patient&&<><section className="patient-progress-card" aria-labelledby="progress-title"><div className="patient-section-heading"><div><p className="patient-kicker">Seu andamento</p><h2 id="progress-title">Etapas do cuidado</h2></div><span>{hasConsent?"Termo concluído":hasEvaluation?"Avaliação concluída":"Pronta para começar"}</span></div><ol className="patient-stepper">
      <li className="complete"><span><Check size={16} aria-hidden="true"/></span><div><strong>Conta criada</strong><small>Dados de acesso protegidos</small></div></li>
      <li className={hasEvaluation?"complete":"current"}><span>{hasEvaluation?<Check size={16} aria-hidden="true"/>:"2"}</span><div><strong>Escolher procedimento</strong><small>Catálogo público</small></div></li>
      <li className={hasEvaluation?"complete":"pending"}><span>{hasEvaluation?<Check size={16} aria-hidden="true"/>:"3"}</span><div><strong>Avaliação</strong><small>Perguntas específicas</small></div></li>
      <li className={hasConsent?"complete":hasEvaluation?"current":"pending"}><span>{hasConsent?<Check size={16} aria-hidden="true"/>:"4"}</span><div><strong>Termo</strong><small>Leitura e confirmação</small></div></li>
    </ol></section>
    <section className="patient-next-card"><div><p className="patient-kicker">{nextAction.eyebrow}</p><h2>{nextAction.title}</h2><p>{nextAction.text}</p></div><Link className="patient-submit patient-primary-action" href="/procedimentos">{nextAction.label}<ChevronRight size={18} aria-hidden="true"/></Link></section>
    <section className="patient-procedures-card" aria-labelledby="patient-procedures-title"><header><div><p className="patient-kicker">Acompanhamento</p><h2 id="patient-procedures-title">Seus procedimentos</h2><p>Acompanhe as avaliações enviadas e confirme se cada aceite foi registrado.</p></div><span>{procedureProgress.length} {procedureProgress.length===1?"procedimento":"procedimentos"}</span></header>{procedureProgress.length>0?<div className="patient-procedure-list">{procedureProgress.map((item)=><article className="patient-procedure-item" key={item.id}><div className="patient-procedure-main"><span className={item.acceptedAt?"patient-procedure-status accepted":"patient-procedure-status pending"}>{item.acceptedAt?<><Check size={15} aria-hidden="true"/> Termo aceito</>:"Termo pendente"}</span><h3>{item.name}</h3><p>{item.acceptedAt?"Aceite registrado com sucesso. Próximo passo: consultar disponibilidade.":"Sua avaliação foi salva. O próximo passo é ler e confirmar o termo."}</p></div><dl className="patient-procedure-meta"><div><dt>Avaliação</dt><dd>{item.evaluatedAt?formatDate(item.evaluatedAt):"Registro anterior"}</dd></div><div><dt>Termo</dt><dd>{item.acceptedAt?formatDate(item.acceptedAt):"Ainda não aceito"}</dd></div>{item.termVersion&&<div><dt>Versão</dt><dd>{item.termVersion}</dd></div>}</dl><Link className="patient-procedure-action" href={`/procedimentos?procedimento=${item.id}&etapa=termo#procedure-term`}>{item.acceptedAt?"Revisar procedimento":"Continuar para o termo"}<ChevronRight size={17} aria-hidden="true"/></Link></article>)}</div>:<div className="patient-empty-progress"><p>Você ainda não iniciou uma avaliação.</p><Link href="/procedimentos">Conhecer procedimentos <ChevronRight size={17} aria-hidden="true"/></Link></div>}</section>
    <details className="patient-data-card"><summary><span><strong>Meus dados pessoais</strong><small>Consulte as informações usadas na sua conta</small></span><ChevronRight size={18} aria-hidden="true"/></summary><dl className="patient-details"><div><dt>Nome</dt><dd>{patient.full_name}</dd></div><div><dt>E-mail</dt><dd>{patient.email}</dd></div><div><dt>CPF</dt><dd>•••.•••.•••-{patient.cpf.slice(-2)}</dd></div><div><dt>Data de nascimento</dt><dd>{patient.birth_date ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${patient.birth_date}T00:00:00Z`)) : "Será confirmada na próxima avaliação"}</dd></div><div><dt>Celular</dt><dd>{patient.phone || "Será confirmado na próxima avaliação"}</dd></div></dl><p className="patient-data-help">Para corrigir ou excluir dados, registre uma solicitação de privacidade. Cada caso será analisado pela Dra. Claudia e sua equipe.</p><Link className="secondary-button inline-button patient-secondary-action" href="/privacidade/solicitacao">Gerenciar meus dados</Link></details>
    <details className="legacy-history"><summary>Histórico clínico anterior</summary><p>Se você já preencheu a ficha geral, ela permanece protegida em seu prontuário.</p></details>{admin&&<Link className="secondary-button inline-button patient-secondary-action" href="/admin">Abrir painel administrativo</Link>}</>}
  </div></main>;
}
