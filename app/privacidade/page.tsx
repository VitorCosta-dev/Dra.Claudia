import type { Metadata } from "next";
import Link from "next/link";
import { whatsappUrl } from "@/lib/site";

// RASCUNHO: revisar com a profissional/assessoria jurídica.
export const metadata: Metadata = {
  title: "Política de privacidade | Dra. Claudia Bonavoglia",
  description: "Informações sobre o tratamento de dados pessoais na Área do Paciente.",
  alternates: { canonical: "/privacidade" },
};

const contactUrl = whatsappUrl("Olá! Gostaria de falar sobre meus dados pessoais na Área do Paciente.");

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <nav className="privacy-nav"><Link href="/">← Voltar ao site</Link></nav>
      <article className="privacy-document">
        <p className="patient-kicker">Privacidade e proteção de dados</p>
        <h1>Política de privacidade</h1>
        <p className="privacy-lead">Esta política explica como os dados pessoais são tratados no site e na Área do Paciente da Dra. Claudia Bonavoglia.</p>
        <section><h2>1. Controladora</h2><p>A responsável pelas decisões sobre o tratamento é a Dra. Claudia Bonavoglia, biomédica esteta com atendimento em Guarulhos, SP. Solicitações relacionadas à privacidade podem ser feitas pelo canal indicado ao final desta política.</p></section>
        <section><h2>2. Dados tratados</h2><p>Podemos tratar dados de cadastro e contato, nome completo, e-mail, CPF, credenciais de acesso, respostas de histórico clínico e anamneses, procedimentos selecionados, consentimentos e registros técnicos necessários para manter a segurança da conta.</p></section>
        <section><h2>3. Finalidades e bases legais</h2><p>Os dados são utilizados para criar e autenticar a conta, identificar corretamente o paciente, organizar avaliações, apoiar o atendimento, registrar consentimentos, cumprir obrigações aplicáveis e proteger direitos. Conforme o contexto, o tratamento pode se apoiar nas hipóteses previstas nos artigos 7º e 11 da Lei Geral de Proteção de Dados, inclusive consentimento, execução de procedimentos solicitados, cumprimento de obrigação legal ou regulatória, exercício regular de direitos e tutela da saúde.</p></section>
        <section><h2>4. Operadores e infraestrutura</h2><p>O Supabase fornece serviços de autenticação e banco de dados. A Cloudflare fornece hospedagem, entrega e proteção da aplicação. Esses fornecedores tratam dados segundo as instruções da controladora e seus próprios compromissos contratuais e de segurança.</p></section>
        <section><h2>5. Transferência internacional</h2><p>A infraestrutura dos fornecedores pode processar ou armazenar informações fora do Brasil. Quando aplicável, a transferência deve observar os mecanismos e requisitos previstos na LGPD.</p></section>
        <section><h2>6. Retenção</h2><p>Os dados são conservados pelo tempo necessário às finalidades descritas, às obrigações profissionais e legais aplicáveis, ao exercício regular de direitos e à segurança do serviço. Depois desse período, poderão ser eliminados ou anonimizados, quando não houver fundamento para conservação.</p></section>
        <section><h2>7. Segurança</h2><p>São adotadas medidas técnicas e administrativas compatíveis com a natureza das informações, incluindo controle de acesso, autenticação e regras de acesso no banco de dados. Nenhum sistema conectado à internet, contudo, é totalmente imune a incidentes.</p></section>
        <section><h2>8. Sessão, armazenamento e mensuração</h2><p>A Área do Paciente utiliza armazenamento essencial no navegador para manter a autenticação e a segurança da sessão. O site pode usar o Cloudflare Web Analytics quando essa funcionalidade estiver configurada, com a finalidade de produzir métricas agregadas de acesso sem registrar, por meio deste site, respostas clínicas, CPF ou conteúdo dos formulários como eventos de mensuração.</p></section>
        <section><h2>9. Direitos do titular</h2><p>Nos termos do artigo 18 da LGPD, o titular pode solicitar, conforme aplicável, confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre compartilhamentos e revisão ou revogação do consentimento. Algumas solicitações podem depender da confirmação de identidade e da existência de obrigação legítima de conservação.</p></section>
        <section><h2>10. Contato</h2><p>Para dúvidas ou solicitações relacionadas aos seus dados pessoais, fale pelo WhatsApp público da profissional.</p><a className="privacy-contact" href={contactUrl} target="_blank" rel="noreferrer" data-track="whatsapp">Falar sobre privacidade pelo WhatsApp</a></section>
        <p className="privacy-review"><strong>Documento em revisão:</strong> esta política deve ser validada pela profissional e, se necessário, por assessoria jurídica antes da publicação definitiva.</p>
      </article>
    </main>
  );
}
