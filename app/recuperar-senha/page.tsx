"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function ResetPage() {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const client = getSupabase();
    const { data } = client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    // Supabase's recovery link may redirect with a code instead of a hash.
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) client.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) setMessage("O link expirou. Solicite outro e-mail.");
      else setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    if (recovery) {
      const { error } = await getSupabase().auth.updateUser({ password });
      setMessage(error ? "Não foi possível alterar a senha. Solicite outro link." : "Senha atualizada. Você já pode entrar.");
      if (!error) setRecovery(false);
    } else {
      const email = String(new FormData(event.currentTarget).get("email") ?? "");
      await getSupabase().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/recuperar-senha` });
      setMessage("Se esse e-mail possui uma conta, você receberá um link de recuperação.");
    }
    setBusy(false);
  }
  return <main className="patient-shell"><section className="patient-card auth-card">
    <h1>{recovery ? "Criar nova senha" : "Recuperar senha"}</h1>
    <form className="patient-form" onSubmit={submit}>
      {recovery ? <label>Nova senha<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></label> : <label>E-mail da conta<input type="email" name="email" autoComplete="email" required /></label>}
      <button className="patient-submit" disabled={busy}>{busy ? "Aguarde..." : recovery ? "Salvar nova senha" : "Enviar link"}</button>
      {message && <p role="status">{message}</p>}
    </form><Link className="subtle-link" href="/acesso">Voltar para o acesso</Link>
  </section></main>;
}
