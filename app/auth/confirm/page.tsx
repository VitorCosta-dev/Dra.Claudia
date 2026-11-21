"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function ConfirmPage() {
  const [message, setMessage] = useState("Confirmando seu e-mail...");
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const returnPath = next?.startsWith("/") && !next.startsWith("//") ? next : "/paciente";
  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token_hash");
    const code = params.get("code");
    const type = params.get("type");
    if (!code && (!token || type !== "signup")) {
      const timer = window.setTimeout(() => {
        if (active) setMessage("O link de confirmação está incompleto ou já foi utilizado.");
      }, 0);
      return () => { active = false; window.clearTimeout(timer); };
    }
    const client = getSupabase();
    const confirmation = code
      ? client.auth.exchangeCodeForSession(code)
      : client.auth.verifyOtp({ token_hash: token!, type: "signup" });
    confirmation.then(({ error }) => {
      if (active) setMessage(error ? "Não foi possível confirmar o e-mail. Solicite um novo link." : "E-mail confirmado. Você já pode entrar na sua conta.");
    });
    return () => { active = false; };
  }, []);
  return <main className="patient-shell"><section className="patient-card auth-card"><h1>Confirmar cadastro</h1><p role="status">{message}</p><Link className="patient-submit inline-button" href={`/acesso?next=${encodeURIComponent(returnPath)}`}>Ir para o acesso</Link></section></main>;
}
