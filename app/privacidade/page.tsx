import type { Metadata } from "next";
import Link from "next/link";
import { clinicAddress, whatsappUrl } from "@/lib/site";

// RASCUNHO OPERACIONAL: validar com a profissional e assessoria jurídica antes da produção.
export const metadata: Metadata = {
  title: "Política de privacidade | Dra. Claudia Bonavoglia",
  description: "Informações sobre o tratamento de dados pessoais na Área do Paciente.",
  alternates: { canonical: "/privacidade" },
};

const contactUrl = whatsappUrl("Olá! Gostaria de falar sobre meus dados pessoais na Área do Paciente.");

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <nav className="privacy-nav"><Link className="return-button" href="/">← Voltar ao site</Link></nav>
      <article className="privacy-document">
        <p className="patient-kicker">Privacidade e proteção de dados</p>
        <h1>Política de privacidade</h1>
        <p className="privacy-lead">Esta política explica como os dados pessoais são tratados no site e na Área do Paciente da Dra. Claudia Bonavoglia.</p>
        <p className="privacy-version">Versão operacional: 21 de novembro de 2026</p>
        <section><h2>1. Controladora</h2><p>A responsável pelas decisões sobre o tratamento é a Dra. Claudia Bonavoglia, biomédica esteta com atendimento na {clinicAddress}. Solicitações relacionadas à privacidade podem ser feitas pelo canal indicado ao final desta política.</p></section>
        <section><h2>2. Dados tratados</h2><p>Podemos tratar nome completo, e-mail, CPF, data de nascimento, telefone, dados necessários à autenticação, respostas de histórico clínico e avaliações, procedimentos selecionados, versões e comprovantes dos consentimentos, endereço informado no momento do aceite, solicitações de privacidade e registros técnicos de segurança e auditoria. A senha é processada pelo serviço de autenticação do Supabase e não fica disponível em texto legível para a profissional ou para a equipe.</p></section>
        <section><h2>3. Finalidades e bases legais</h2><p>Os dados são utilizados para criar e autenticar a conta, identificar corretamente o paciente, organizar avaliações, apoiar o atendimento, registrar consentimentos, cumprir obrigações aplicáveis e proteger direitos. Conforme o contexto, o tratamento pode se apoiar nas hipóteses previstas nos artigos 7º e 11 da Lei Geral de Proteção de Dados, inclusive consentimento, execução de procedimentos solicitados, cumprimento de obrigação legal ou regulatória, exercício regular de direitos e tutela da saúde.</p></section>
        <section><h2>4. Operadores e infraestrutura</h2><p>O Supabase fornece serviços de autenticação e banco de dados. A Cloudflare fornece hospedagem, entrega e proteção da aplicação. Esses fornecedores tratam dados segundo as instruções da controladora e seus próprios compromissos contratuais e de segurança.</p></section>
        <section><h2>5. Transferência internacional</h2><p>A infraestrutura dos fornecedores pode processar ou armazenar informações fora do Brasil. Quando aplicável, a transferência deve observar os mecanismos e requisitos previstos na LGPD.</p></section>
        <section><h2>6. Retenção e exclusão</h2><p>Os dados são conservados enquanto forem necessários às finalidades descritas, às obrigações profissionais e legais aplicáveis, ao exercício regular de direitos, à rastreabilidade dos consentimentos e à segurança do serviço. Os prazos concretos devem seguir a política de retenção aprovada pela controladora. Solicitações de exclusão serão analisadas individualmente, pois determinados registros clínicos, consentimentos e evidências de atendimento podem precisar ser preservados por obrigação legal, regulatória ou para exercício regular de direitos.</p></section>
        <section><h2>7. Segurança</h2><p>São adotadas medidas técnicas e administrativas compatíveis com a natureza das informações, incluindo autenticação, controle de acesso por usuário, regras de segurança no banco de dados, autenticação multifator para acessos administrativos, registros de auditoria e comunicação protegida por HTTPS no ambiente publicado. Nenhum sistema conectado à internet, contudo, é totalmente imune a incidentes.</p></section>
        <section><h2>8. Sessão, armazenamento e mensuração</h2><p>A Área do Paciente utiliza armazenamento essencial no navegador para manter a autenticação e a segurança da sessão. A preferência entre tema claro e escuro também pode ser guardada localmente no navegador e não contém informação clínica. O site pode usar o Cloudflare Web Analytics quando essa funcionalidade estiver configurada, com a finalidade de produzir métricas agregadas de acesso sem registrar, por meio deste site, respostas clínicas, CPF ou conteúdo dos formulários como eventos de mensuração.</p></section>
        <section><h2>9. Direitos do titular</h2><p>Nos termos do artigo 18 da LGPD, o titular pode solicitar, conforme aplicável, confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre compartilhamentos e revisão ou revogação do consentimento. Algumas solicitações podem depender da confirmação de identidade e da existência de obrigação legítima de conservação. Cada caso será analisado pela Dra. Claudia e sua equipe, com retorno o mais breve possível, respeitando as obrigações legais aplicáveis.</p><Link className="privacy-contact" href="/privacidade/solicitacao">Registrar solicitação pela Área do Paciente</Link></section>
        <section><h2>10. Atualizações desta política</h2><p>A versão aceita no cadastro pode ser registrada junto ao perfil. Alterações relevantes serão publicadas nesta página, com indicação da nova versão e da data de vigência, e poderão exigir nova ciência quando necessário.</p></section>
        <section><h2>11. Contato</h2><p>Para dúvidas ou solicitações relacionadas aos seus dados pessoais, utilize o formulário autenticado ou fale pelo WhatsApp público da profissional.</p><a className="privacy-contact" href={contactUrl} target="_blank" rel="noopener noreferrer" data-track="whatsapp">Falar sobre privacidade pelo WhatsApp</a></section>
        <p className="privacy-review"><strong>Documento em revisão:</strong> esta política deve ser validada pela profissional e, se necessário, por assessoria jurídica antes da publicação definitiva.</p>
      </article>
    </main>
  );
}
