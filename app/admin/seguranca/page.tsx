"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { getSupabase } from "@/lib/supabase";

type Enrollment = { factorId: string; qrCode: string; secret: string };

export default function AdminSecurityPage() {
  const router = useRouter();
  const [factorId, setFactorId] = useState("");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [state, setState] = useState("Verificando sua conta...");
  const [ready, setReady] = useState(false);
  const [sessionVerified, setSessionVerified] = useState(false);

  useEffect(() => {
    let active = true;
    const client = getSupabase();
    async function prepare() {
      const { data: auth } = await client.auth.getUser();
      if (!auth.user) { router.replace("/acesso"); return; }
      const membership = await client.from("admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
      if (!active) return;
      if (!membership.data) { setState("Esta configuração está disponível somente para administradores."); return; }

      const assurance = await client.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assurance.data?.currentLevel === "aal2") {
        setSessionVerified(true);
        setState("Verificação em duas etapas ativa nesta sessão.");
        return;
      }

      const factors = await client.auth.mfa.listFactors();
      if (!active) return;
      if (factors.error) { setState("Não foi possível consultar o segundo fator."); return; }
      const verified = factors.data.totp[0];
      if (verified) {
        setFactorId(verified.id);
        setReady(true);
        setState("Digite o código atual do aplicativo autenticador.");
        return;
      }

      for (const stale of factors.data.all.filter((factor) => factor.factor_type === "totp" && factor.status === "unverified")) {
        await client.auth.mfa.unenroll({ factorId: stale.id });
      }
      const enrolled = await client.auth.mfa.enroll({ factorType: "totp", friendlyName: "Painel clínico" });
      if (!active) return;
      if (enrolled.error) { setState("Não foi possível iniciar a configuração do autenticador."); return; }
      const qrCode = enrolled.data.totp.qr_code.startsWith("data:")
        ? enrolled.data.totp.qr_code
        : `data:image/svg+xml;utf-8,${encodeURIComponent(enrolled.data.totp.qr_code)}`;
      setFactorId(enrolled.data.id);
      setEnrollment({ factorId: enrolled.data.id, qrCode, secret: enrolled.data.totp.secret });
      setReady(true);
      setState("Escaneie o QR Code e confirme o primeiro código.");
    }
    void prepare();
    return () => { active = false; };
  }, [router]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) { setState("Digite o código de seis números exibido no aplicativo."); return; }
    setReady(false);
    setState("Confirmando código...");
    const result = await getSupabase().auth.mfa.challengeAndVerify({ factorId, code });
    if (result.error) {
      setReady(true);
      setState("Código inválido ou expirado. Aguarde o próximo código e tente novamente.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return <AdminShell active="security">
    <header className="admin-page-header"><div><p className="admin-eyebrow">Proteção de acesso</p><h1>Segurança</h1><span>Confirme sua identidade antes de consultar informações clínicas.</span></div><Link className="admin-outline-link" href="/privacidade">Política de privacidade ↗</Link></header>
    <section className="admin-security-intro"><div className="admin-security-icon" aria-hidden="true">◇</div><div><p className="admin-eyebrow">Camada adicional</p><h2>Verificação em duas etapas</h2><p>O painel administrativo só libera fichas clínicas após a confirmação de um código temporário no aplicativo autenticador.</p></div></section>
    {enrollment && <section className="admin-enrollment"><div className="admin-qr"><img src={enrollment.qrCode} width="220" height="220" alt="QR Code para configurar o aplicativo autenticador" /></div><div><p className="admin-eyebrow">Configuração inicial</p><h2>Configure uma única vez</h2><ol><li><span>01</span>Abra o Google Authenticator, Microsoft Authenticator ou outro aplicativo TOTP.</li><li><span>02</span>Escaneie o QR Code exibido ao lado.</li><li><span>03</span>Digite abaixo o código de seis números.</li></ol><p>Se não conseguir escanear, use esta chave:</p><code>{enrollment.secret}</code></div></section>}
    <section className={`admin-security-confirm${sessionVerified ? " verified" : ""}`}><div><p className="admin-eyebrow">{sessionVerified ? "Sessão protegida" : "Confirmação"}</p><h2>{sessionVerified ? "Acesso verificado" : "Código temporário"}</h2><p role="status">{state}</p></div>{sessionVerified && <div className="admin-security-active"><span aria-hidden="true">✓</span><div><strong>Segundo fator confirmado</strong><small>Os dados clínicos estão liberados somente durante esta sessão autenticada.</small></div></div>}{ready && <form onSubmit={verify}><label htmlFor="mfa-code">Código do autenticador</label><input id="mfa-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" required /><button className="admin-primary-button" type="submit">Confirmar e abrir painel</button></form>}</section>
  </AdminShell>;
}
