"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function safeReturnPath(value: string | null) { return value?.startsWith("/") && !value.startsWith("//") ? value : "/paciente"; }

export default function AccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = safeReturnPath(searchParams.get("next"));
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const client = getSupabase();
    client.auth.getUser().then(({ data }) => {
      if (data.user) router.replace(returnPath);
    });
  }, [returnPath, router]);

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
      const birthDate = String(form.get("birthDate") ?? "");
      const phone = String(form.get("phone") ?? "").replace(/\D/g, "");
      const acknowledgedPrivacy = form.get("privacyAcknowledgement") === "on";
      if (fullName.length < 2 || !validCpf(cpf)) {
        setError("Confira seu nome e CPF antes de continuar.");
        return;
      }
      if (password.length < 12) {
        setError("Crie uma senha com pelo menos 12 caracteres.");
        return;
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || phone.length < 10 || phone.length > 13) {
        setError("Confira sua data de nascimento e seu celular antes de continuar.");
        return;
      }
      if (!acknowledgedPrivacy) {
        setError("Confirme que você leu a Política de Privacidade para criar a conta.");
        return;
      }
      setBusy(true);
      const { data: signUpData, error: signUpError } = await client.auth.signUp({
        email, password,
        options: {
          data: { full_name: fullName, cpf, birth_date: birthDate, phone, privacy_policy_version: "privacidade-2026-11-21" },
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(returnPath)}`,
        },
      });
      setBusy(false);
      if (signUpError) setError("Não foi possível concluir o cadastro. Confira os dados e tente novamente.");
      else if (signUpData.session) router.replace(returnPath);
      else setMessage("Cadastro recebido. Confira seu e-mail e confirme a conta para entrar.");
      return;
    }
    setBusy(true);
    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) setError("E-mail ou senha incorretos, ou conta ainda não confirmada.");
    else router.replace(returnPath);
  }

  return (
    <main className="patient-shell auth-shell">
      <nav className="patient-nav"><Link className="return-button" href="/procedimentos">← Voltar aos procedimentos</Link></nav>
      <div className="auth-layout">
        <aside className="auth-showcase">
          <div className="auth-monogram" aria-hidden="true">CB</div>
          <p className="patient-kicker">Cuidado individual</p>
          <h2>Seu histórico começa com informação e confiança.</h2>
          <p>Uma área reservada para escolher seu procedimento, responder à avaliação correspondente e revisar os consentimentos.</p>
          <ol className="auth-steps" aria-label="Etapas do cadastro">
            <li><span>1</span><div><strong>Escolha o procedimento</strong><small>O catálogo é público e pode ser consultado sem cadastro.</small></div></li>
            <li><span>2</span><div><strong>Crie sua conta</strong><small>Informe apenas os dados necessários para iniciar a avaliação.</small></div></li>
            <li><span>3</span><div><strong>Responda à avaliação</strong><small>Cada procedimento possui perguntas específicas.</small></div></li>
          </ol>
          <p className="auth-security-note"><span aria-hidden="true">✓</span> Seus dados clínicos são protegidos e acessíveis somente por você e pela profissional autorizada.</p>
        </aside>
        <section className="patient-card auth-card">
          <p className="patient-kicker">Área de pacientes</p>
          <h1>{mode === "login" ? "Que bom ter você de volta" : "Crie seu acesso seguro"}</h1>
          <p className="auth-card-intro">{mode === "login" ? "Entre para continuar seu acompanhamento." : "Leva poucos minutos. Sua escolha será preservada para você iniciar a avaliação."}</p>
          <div className="auth-tabs" role="group" aria-label="Tipo de acesso">
            <button type="button" aria-pressed={mode === "login"} onClick={() => { setMode("login"); setError(""); setMessage(""); }}>Já tenho conta</button>
            <button type="button" aria-pressed={mode === "signup"} onClick={() => { setMode("signup"); setError(""); setMessage(""); }}>Quero me cadastrar</button>
          </div>
          <form onSubmit={submit} className="patient-form">
            {mode === "signup" && <>
              <label>Nome completo<input name="fullName" autoComplete="name" required minLength={2} maxLength={150} placeholder="Como aparece no seu documento" /></label>
              <label>CPF<input name="cpf" inputMode="numeric" autoComplete="off" required maxLength={14} placeholder="Somente números" /><small className="field-help">Utilizado para identificar seu cadastro com segurança.</small></label>
              <label>Data de nascimento<input name="birthDate" type="date" autoComplete="bday" required /></label>
              <label>Celular<input name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={10} maxLength={20} placeholder="(11) 99999-9999" /></label>
            </>}
            <label>E-mail<input name="email" type="email" autoComplete="email" required placeholder="voce@exemplo.com" /></label>
              <label>Senha<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "signup" ? 12 : undefined} placeholder={mode === "signup" ? "Mínimo de 12 caracteres" : "Sua senha"} />{mode === "signup" && <small className="field-help">Use uma senha exclusiva, com pelo menos 12 caracteres.</small>}</label>
            {mode === "signup" && <label className="consent-check"><input name="privacyAcknowledgement" type="checkbox" required /><span>Li e estou ciente da <Link href="/privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</Link> e do tratamento dos dados necessário para usar a Área do Paciente.</span></label>}
            {error && <p className="form-error" role="alert">{error}</p>}
            {message && <p className="form-success" role="status">{message}</p>}
            <button className="patient-submit" disabled={busy}>{busy ? "Aguarde..." : mode === "login" ? "Entrar na minha conta" : "Criar conta e continuar"}</button>
          </form>
          {mode === "login" && <Link className="subtle-link" href="/recuperar-senha">Esqueci minha senha</Link>}
          {mode === "signup" && <p className="auth-privacy">Você poderá revisar suas informações antes de enviar qualquer avaliação.</p>}
        </section>
      </div>
    </main>
  );
}
