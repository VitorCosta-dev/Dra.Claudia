"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";

function validCpf(value: string) {
  const cpf = value.replace(/\D/g, "");
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;
  for (const size of [9, 10]) {
    const sum = Array.from(cpf.slice(0, size)).reduce(
      (total, digit, index) => total + Number(digit) * (size + 1 - index), 0,
    );
    const expected = ((sum * 10) % 11) % 10;
    if (expected !== Number(cpf[size])) return false;
  }
  return true;
}

export default function AccessPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const client = getSupabase();
    client.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/paciente");
    });
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const client = getSupabase();
    if (mode === "signup") {
      const fullName = String(form.get("fullName") ?? "").trim();
      const cpf = String(form.get("cpf") ?? "").replace(/\D/g, "");
      if (fullName.length < 2 || !validCpf(cpf)) {
        setError("Confira seu nome e CPF antes de continuar.");
        return;
      }
      if (password.length < 8) {
        setError("Crie uma senha com pelo menos 8 caracteres.");
        return;
      }
      setBusy(true);
      const { error: signUpError } = await client.auth.signUp({
        email, password,
        options: {
          data: { full_name: fullName, cpf },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      setBusy(false);
      if (signUpError) setError("Não foi possível concluir o cadastro. Confira os dados e tente novamente.");
      else setMessage("Cadastro recebido. Confira seu e-mail e confirme a conta para entrar.");
      return;
    }
    setBusy(true);
    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) setError("E-mail ou senha incorretos, ou conta ainda não confirmada.");
    else router.replace("/paciente");
  }

  return (
    <main className="patient-shell">
      <nav className="patient-nav"><Link href="/">← Dra. Claudia Bonavoglia</Link></nav>
      <section className="patient-card auth-card">
        <p className="patient-kicker">Área de pacientes</p>
        <h1>{mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}</h1>
        <div className="auth-tabs" role="group" aria-label="Tipo de acesso">
          <button type="button" aria-pressed={mode === "login"} onClick={() => { setMode("login"); setError(""); setMessage(""); }}>Entrar</button>
          <button type="button" aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setError(""); setMessage(""); }}>Cadastrar</button>
        </div>
        <form onSubmit={submit} className="patient-form">
          {mode === "signup" && <>
            <label>Nome completo<input name="fullName" autoComplete="name" required minLength={2} maxLength={150} /></label>
            <label>CPF<input name="cpf" inputMode="numeric" autoComplete="off" required maxLength={14} placeholder="Somente para seu cadastro" /></label>
          </>}
          <label>E-mail<input name="email" type="email" autoComplete="email" required /></label>
          <label>Senha<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "signup" ? 8 : undefined} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="form-success" role="status">{message}</p>}
          <button className="patient-submit" disabled={busy}>{busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}</button>
        </form>
        {mode === "login" && <Link className="subtle-link" href="/recuperar-senha">Esqueci minha senha</Link>}
      </section>
    </main>
  );
}
