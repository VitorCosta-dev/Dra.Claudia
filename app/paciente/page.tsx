"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

type Patient = { full_name: string; email: string; cpf: string };

export default function PatientPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [admin, setAdmin] = useState(false);
  const [state, setState] = useState("Carregando seus dados...");

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function load() {
      const { data: auth } = await client.auth.getUser();
      if (!active) return;
      if (!auth.user) { router.replace("/acesso"); return; }
      const [profile, membership] = await Promise.all([
        client.from("patients").select("full_name,email,cpf").eq("user_id", auth.user.id).maybeSingle(),
        client.from("admins").select("user_id").eq("user_id", auth.user.id).maybeSingle(),
      ]);
      if (!active) return;
      if (profile.error || membership.error) {
        setState("Não foi possível carregar seus dados. Tente novamente mais tarde.");
      } else {
        const questionnaire = await client.from("clinical_questionnaires")
          .select("submitted_at").eq("user_id", auth.user.id).maybeSingle();
        if (!questionnaire.data?.submitted_at) { router.replace("/questionario"); return; }
        setPatient(profile.data);
        setAdmin(Boolean(membership.data));
        setState("");
      }
    }
    void load();
    return () => { active = false; };
  }, [router]);

  async function signOut() {
    await getSupabase().auth.signOut();
    router.replace("/acesso");
  }

  return <main className="patient-shell">
    <nav className="patient-nav"><Link href="/">Dra. Claudia Bonavoglia</Link><button onClick={signOut}>Sair</button></nav>
    <section className="patient-card">
      <p className="patient-kicker">Minha conta</p>
      <h1>{patient ? `Olá, ${patient.full_name.split(" ")[0]}` : "Área do paciente"}</h1>
      {state && <p role="status">{state}</p>}
      {patient && <dl className="patient-details">
        <div><dt>Nome</dt><dd>{patient.full_name}</dd></div>
        <div><dt>E-mail</dt><dd>{patient.email}</dd></div>
        <div><dt>CPF</dt><dd>•••.•••.•••-{patient.cpf.slice(-2)}</dd></div>
      </dl>}
      {patient && <Link className="subtle-link" href="/questionario">Revisar meu histórico clínico</Link>}
      {patient && <Link className="patient-submit inline-button" href="/procedimentos">Escolher procedimento e consultar termos</Link>}
      {admin && <Link className="patient-submit inline-button" href="/admin">Abrir área ADMIN</Link>}
    </section>
  </main>;
}
