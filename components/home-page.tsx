"use client";

// Mantido fora de app/page.tsx para que o Vinext gere uma entrada de rota
// de servidor estável para a homepage no build do Cloudflare/Windows.

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  AtSign,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { procedureCatalog } from "@/lib/procedure-catalog";
import { clinicAddress, clinicDirectionsUrl, clinicEmbedUrl, siteConfig, whatsappUrl } from "@/lib/site";

const publicWhatsappUrl = whatsappUrl(
  "Olá, Dra. Claudia! Conheci seu trabalho pelo site e gostaria de tirar uma dúvida.",
);

const featuredProcedureIds = [
  "toxina-botulinica-a", "preenchimento-labial", "bioestimulador-colageno",
  "skinbooster", "laser-lavieen", "criolipolise", "microagulhamento", "terapia-capilar",
];
const treatments = featuredProcedureIds
  .map((id) => procedureCatalog.find((procedure) => procedure.id === id))
  .filter((procedure): procedure is (typeof procedureCatalog)[number] => Boolean(procedure));

const categoryOverview = [
  { name: "Facial", text: "Injetáveis, cuidado da pele e planejamento facial individual." },
  { name: "Corporal", text: "Protocolos selecionados conforme região, histórico e objetivo." },
  { name: "Capilar", text: "Avaliação do couro cabeludo e cuidado capilar personalizado." },
  { name: "Tecnologias", text: "Recursos aplicados com parâmetros definidos após avaliação." },
].map((category) => ({
  ...category,
  count: procedureCatalog.filter((procedure) => procedure.category === category.name).length,
}));

const concerns = [
  {
    label: "Linhas de expressão",
    title: "Preservar sua expressão, com leveza.",
    text: "A toxina botulínica pode fazer parte de um plano individual para suavizar marcas de expressão sem buscar um rosto padronizado.",
    tag: "Toxina botulínica",
  },
  {
    label: "Qualidade da pele",
    title: "Tecnologia e cuidado com indicação individual.",
    text: "Peeling químico, microagulhamento, Skinbooster e tecnologias podem integrar o plano após a avaliação da pele e do histórico clínico.",
    tag: "Cuidados faciais",
  },
  {
    label: "Corpo e cabelo",
    title: "Objetivos diferentes pedem avaliações diferentes.",
    text: "Os cuidados corporais e capilares começam com perguntas específicas para a região, o histórico e a necessidade apresentada.",
    tag: "Corporal & capilar",
  },
];

const instagramMoments = [
  {
    src: "/images/instagram-studio-01.jpg",
    alt: "Bastidores de um atendimento da Dra. Claudia Bonavoglia",
    label: "Planejamento",
    width: 360,
    height: 640,
  },
  {
    src: "/images/instagram-studio-02.jpg",
    alt: "Detalhes do espaço e dos materiais da Dra. Claudia Bonavoglia",
    label: "Bastidores",
    width: 361,
    height: 640,
  },
  {
    src: "/images/instagram-treatment.jpg",
    alt: "Aplicação de toxina botulínica realizada pela Dra. Claudia Bonavoglia",
    label: "Técnica & cuidado",
    width: 360,
    height: 640,
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`reveal is-visible ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [activeConcern, setActiveConcern] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryScrollProgress, setCategoryScrollProgress] = useState(0);
  const [treatmentScrollProgress, setTreatmentScrollProgress] = useState(0);

  useEffect(() => {
    function closeMenu(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }
    window.addEventListener("keydown", closeMenu);
    return () => window.removeEventListener("keydown", closeMenu);
  }, []);

  function readScrollProgress(element: HTMLDivElement) {
    const maximum = element.scrollWidth - element.clientWidth;
    return maximum > 0 ? Math.min(100, Math.max(0, (element.scrollLeft / maximum) * 100)) : 0;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const target = event.currentTarget;
    target.style.setProperty("--mx", `${event.clientX}px`);
    target.style.setProperty("--my", `${event.clientY}px`);
  }

  return (
    <>
      <main className="site-shell" onPointerMove={handlePointerMove}>
      <div className="noise" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Dra. Claudia Bonavoglia — início">
          <span className="brand-mark">CB</span>
          <span className="brand-copy">
            <strong>Claudia Bonavoglia</strong>
            <small>Biomedicina estética</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>
          <a href="#tratamentos">Tratamentos</a>
          <a href="#experiencia">Experiência</a>
          <a href="#local">Localização</a>
          <a className="patient-area-link" href="/acesso">Área do paciente</a>
        </nav>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>

        <nav id="mobile-navigation" className={`mobile-menu-panel${mobileMenuOpen ? " is-open" : ""}`} aria-label="Navegação móvel" aria-hidden={!mobileMenuOpen}>
          <a href="#sobre" onClick={() => setMobileMenuOpen(false)}>Sobre</a>
          <a href="#tratamentos" onClick={() => setMobileMenuOpen(false)}>Procedimentos</a>
          <a href="#experiencia" onClick={() => setMobileMenuOpen(false)}>Experiência</a>
          <a href="#local" onClick={() => setMobileMenuOpen(false)}>Localização</a>
          <a className="mobile-patient-link" href="/acesso">Área do paciente <ArrowRight size={16} aria-hidden="true" /></a>
        </nav>

        <a className="nav-cta" href="/acesso">
          <span className="nav-cta-full">Área do paciente</span>
          <span className="nav-cta-short">Portal</span>
          <ArrowDownRight size={17} aria-hidden="true" />
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />

        <div className="hero-content">
          <p className="eyebrow hero-kicker">
            <span /> Estética facial, corporal & capilar
          </p>
          <h1 className="hero-title">
            <span className="title-line"><span>Beleza que se</span></span>
            <span className="title-line"><span>reconhece.</span></span>
          </h1>
          <p className="hero-description">
            Cuidado estético com escuta, planejamento e respeito às características e aos objetivos de cada pessoa.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="/procedimentos">
              <span>Conhecer procedimentos</span>
              <ArrowRight size={19} aria-hidden="true" />
            </a>
            <a className="text-button" href="#tratamentos">
              Conhecer tratamentos <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="hero-trust" aria-label="Informações profissionais">
            <div><ShieldCheck size={18} /><span>CRBM 73824</span></div>
            <div><MapPin size={18} /><span>Guarulhos, SP</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Imagem conceitual de cuidados com a pele">
          <div className="hero-image-wrap">
            <img src="/images/hero-skin.webp" alt="Mulher com pele natural iluminada em fotografia editorial" width={1024} height={1536} fetchPriority="high" />
            <div className="image-shade" aria-hidden="true" />
          </div>
          <div className="floating-seal" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <path id="sealPath" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
              </defs>
              <text><textPath href="#sealPath">ESTÉTICA AVANÇADA • PELE & NATURALIDADE • </textPath></text>
            </svg>
            <Sparkles size={20} />
          </div>
          <div className="visual-caption">
            <span>01</span>
            <p>Resultados que valorizam, sem apagar quem você é.</p>
          </div>
        </div>

        <a className="scroll-cue" href="#manifesto" aria-label="Rolar para o conteúdo">
          <span>Explorar</span><i />
        </a>
      </section>

      <section className="marquee" aria-label="Princípios do atendimento">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
              <span>Naturalidade</span><i>✦</i>
              <span>Ciência</span><i>✦</i>
              <span>Cuidado individual</span><i>✦</i>
              <span>Saúde da pele</span><i>✦</i>
            </div>
          ))}
        </div>
      </section>

      <section className="manifesto section-pad" id="manifesto">
        <Reveal className="section-number"><span>01</span><p>Uma nova relação<br />com a estética</p></Reveal>
        <Reveal className="manifesto-copy" delay={120}>
          <p>
            Estética não precisa mudar <em>quem você é.</em> Pode ser um cuidado sutil, planejado e consciente daqueles que fazem você se olhar com mais carinho.
          </p>
        </Reveal>
        <Reveal className="manifesto-note" delay={220}>
          <div className="fine-line" />
          <p>Sem fórmulas prontas. Cada indicação começa por entender sua pele, seus traços e o que faz sentido para você.</p>
        </Reveal>
      </section>

      <section className="treatments section-pad" id="tratamentos">
        <Reveal className="section-heading">
          <p className="eyebrow">Cuidados em destaque</p>
          <h2>Um catálogo mais completo, organizado pela <em>sua</em> necessidade.</h2>
        </Reveal>

        <div
          className="category-overview"
          aria-label="Categorias de procedimentos"
          tabIndex={0}
          onScroll={(event) => setCategoryScrollProgress(readScrollProgress(event.currentTarget))}
        >
          {categoryOverview.map((category, index) => (
            <Reveal key={category.name} delay={index * 70}>
              <article><span>{String(category.count).padStart(2, "0")}</span><h3>{category.name}</h3><p>{category.text}</p></article>
            </Reveal>
          ))}
        </div>
        <div className="carousel-progress category-progress" aria-hidden="true"><span style={{ "--scroll-progress": categoryScrollProgress } as CSSProperties} /></div>

        <Reveal className="treatment-subheading"><p>Alguns dos procedimentos disponíveis</p><span>O catálogo completo reúne {procedureCatalog.length} opções.</span></Reveal>
        <p className="treatment-scroll-hint" aria-hidden="true">Deslize para conhecer <ArrowRight size={16} /></p>

        <div
          className="treatment-list"
          aria-label="Procedimentos em destaque"
          tabIndex={0}
          onScroll={(event) => setTreatmentScrollProgress(readScrollProgress(event.currentTarget))}
        >
          {treatments.map((treatment, index) => (
            <Reveal key={treatment.name} delay={index * 90}>
              <article className="treatment-card">
                <div className="treatment-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="treatment-main">
                  <p>{treatment.category}</p>
                  <h3>{treatment.name}</h3>
                </div>
                <p className="treatment-description">{treatment.summary}</p>
                <div className="treatment-action">
                  <span>Avaliação e orientação individual</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="carousel-progress treatment-progress" aria-hidden="true"><span style={{ "--scroll-progress": treatmentScrollProgress } as CSSProperties} /></div>
        <Reveal className="catalog-cta"><a className="primary-button" href="/procedimentos"><span>Explorar catálogo completo</span><ArrowRight size={19} aria-hidden="true" /></a><p>Conheça as opções sem cadastro. O acesso será solicitado somente quando você iniciar uma avaliação.</p></Reveal>
      </section>

      <section className="location section-pad" id="local" aria-labelledby="location-title">
        <Reveal className="location-portrait"><img src="/images/dra-claudia-agendamento.webp" alt="Dra. Claudia Bonavoglia em seu ambiente profissional" width={900} height={900} loading="lazy" decoding="async" /><span className="location-portrait-caption">Atendimento com hora marcada</span></Reveal>
        <div className="location-content">
          <Reveal><p className="eyebrow">Localização</p><h2 id="location-title">Onde atendemos.</h2><p className="location-intro">Um espaço em Guarulhos preparado para receber cada paciente com tranquilidade e cuidado.</p></Reveal>
          <Reveal className="location-address" delay={100}><span className="location-pin" aria-hidden="true"><MapPin size={25} /></span><div><strong>Clínica Dra. Claudia Bonavoglia</strong><address>{clinicAddress}</address><p>Atendimentos realizados somente com agendamento.</p></div></Reveal>
          <Reveal className="location-map" delay={160}><iframe src={clinicEmbedUrl} title="Mapa da localização da Clínica Dra. Claudia Bonavoglia" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a href={clinicDirectionsUrl} target="_blank" rel="noopener noreferrer">Abrir rota no Google Maps <ArrowDownRight size={18} aria-hidden="true" /></a></Reveal>
          <a className="location-text-link" href={clinicDirectionsUrl} target="_blank" rel="noopener noreferrer">Abrir rota no Google Maps <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="experience section-pad" id="experiencia">
        <div className="experience-image" aria-hidden="true">
          <img src="/images/editorial-renewal.webp" alt="" width={1536} height={1024} loading="lazy" decoding="async" />
          <span className="image-label">Cuidado em cada detalhe</span>
        </div>

        <div className="experience-content">
          <Reveal>
            <p className="eyebrow">Experiência personalizada</p>
            <h2>O cuidado certo começa com a pergunta certa.</h2>
            <p className="experience-intro">Selecione o que mais se aproxima do seu momento para entender como uma avaliação pode orientar os próximos passos.</p>
          </Reveal>

          <Reveal className="concern-selector" delay={120}>
            <div className="concern-tabs" role="tablist" aria-label="Objetivos de cuidado">
              {concerns.map((concern, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeConcern === index}
                  className={activeConcern === index ? "active" : ""}
                  onClick={() => setActiveConcern(index)}
                  key={concern.label}
                >
                  <span>0{index + 1}</span>{concern.label}
                </button>
              ))}
            </div>

            <div className="concern-result" role="tabpanel" aria-live="polite" key={activeConcern}>
              <span className="result-tag"><Check size={14} /> {concerns[activeConcern].tag}</span>
              <h3>{concerns[activeConcern].title}</h3>
              <p>{concerns[activeConcern].text}</p>
              <a href="/procedimentos">Ver procedimentos <ArrowRight size={17} /></a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="portal-flow section-pad" aria-labelledby="portal-flow-title">
        <Reveal className="portal-flow-heading">
          <p className="eyebrow">Do interesse ao agendamento</p>
          <h2 id="portal-flow-title">Uma jornada clara dentro do próprio site.</h2>
          <p>As avaliações e os procedimentos são realizados exclusivamente por agendamento. O portal organiza as informações antes do contato final.</p>
        </Reveal>
        <div className="portal-flow-grid">
          {[
            ["01", "Conheça as opções", `Pesquise entre ${procedureCatalog.length} procedimentos sem precisar criar uma conta.`],
            ["02", "Crie seu acesso", "Cadastre-se somente quando quiser iniciar uma avaliação."],
            ["03", "Responda à avaliação", "Preencha somente as perguntas específicas do procedimento escolhido."],
            ["04", "Revise o termo", "Leia o consentimento correspondente e confirme apenas quando estiver de acordo."],
            ["05", "Consulte a agenda", "Depois de concluir as etapas, abra o WhatsApp com uma mensagem pronta."],
          ].map(([number, title, text], index) => <Reveal key={number} delay={index * 70}><article><span>{number}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}
        </div>
        <Reveal className="appointment-notice"><ShieldCheck size={22} aria-hidden="true" /><div><strong>Atendimento somente com agendamento</strong><p>A disponibilidade é confirmada após a conclusão da avaliação correspondente ao procedimento.</p></div><a href="/procedimentos">Ver procedimentos <ArrowRight size={17} /></a></Reveal>
      </section>

      <section className="instagram-showcase section-pad" aria-labelledby="instagram-title">
        <Reveal className="instagram-heading">
          <div>
            <p className="eyebrow">Do consultório para o feed</p>
            <h2 id="instagram-title">Cuidado real, visto de <em>perto.</em></h2>
          </div>
          <div className="instagram-intro">
            <p>Um pouco da rotina, dos detalhes e da técnica por trás de cada atendimento.</p>
            <a href="https://www.instagram.com/draclaudiabonavoglia/" target="_blank" rel="noreferrer">
              Ver o Instagram <ArrowDownRight size={18} aria-hidden="true" />
            </a>
            <a className="whatsapp-channel-link" href={siteConfig.whatsappChannelUrl} target="_blank" rel="noopener noreferrer">Canal da Dra. Claudia <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </Reveal>

        <div className="instagram-grid">
          {instagramMoments.map((moment, index) => (
            <Reveal className={`instagram-card instagram-card-${index + 1}`} delay={index * 100} key={moment.src}>
              <a href="https://www.instagram.com/draclaudiabonavoglia/" target="_blank" rel="noreferrer" aria-label={`${moment.label} — ver no Instagram`}>
                <img src={moment.src} alt={moment.alt} width={moment.width} height={moment.height} loading="lazy" decoding="async" />
                <span className="instagram-card-shade" aria-hidden="true" />
                <span className="instagram-card-index">0{index + 1}</span>
                <span className="instagram-card-label">{moment.label}</span>
                <ArrowDownRight className="instagram-card-arrow" size={24} aria-hidden="true" />
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about section-pad" id="sobre">
        <Reveal className="about-title">
          <p className="eyebrow">Sobre a profissional</p>
          <h2>Conhecimento técnico com um olhar <em>humano.</em></h2>
        </Reveal>

        <Reveal className="about-card" delay={120}>
          <div className="about-portrait">
            <img src="/images/dra-claudia-agendamento.webp" alt="Dra. Claudia Bonavoglia durante um atendimento" width={900} height={900} loading="lazy" decoding="async" />
            <span aria-hidden="true">CB</span>
          </div>
          <div className="about-copy">
            <p className="about-lead">Dra. Claudia Bonavoglia</p>
            <p>Biomédica formada pela UniNorte e pós-graduanda em Estética Avançada pelo ITA. Sua atuação une saúde da pele e estética facial em atendimentos pautados por avaliação individual e naturalidade.</p>
            <div className="credentials">
              <span><Check size={15} /> Biomedicina — UniNorte</span>
              <span><Check size={15} /> Estética Avançada — ITA</span>
              <span><Check size={15} /> CRBM 73824</span>
            </div>
          </div>
          <a className="instagram-link" href="https://www.instagram.com/draclaudiabonavoglia/" target="_blank" rel="noreferrer">
            <AtSign size={20} /> <span>@draclaudiabonavoglia</span> <ArrowDownRight size={18} />
          </a>
        </Reveal>
      </section>

      <section className="faq section-pad">
        <Reveal className="faq-heading">
          <p className="eyebrow">Antes de agendar</p>
          <h2>Perguntas frequentes.</h2>
        </Reveal>
        <div className="faq-list">
          {[
            ["Como saber qual procedimento é indicado para mim?", "A indicação é feita após avaliação individual. Nesse momento, a profissional considera seus objetivos, características da pele e histórico para orientar uma conduta adequada."],
            ["Os resultados ficam naturais?", "O planejamento prioriza equilíbrio e preservação das suas características. O resultado possível depende do procedimento indicado e da resposta individual de cada pessoa."],
            ["Onde acontecem os atendimentos?", `Os atendimentos são realizados na ${clinicAddress}. Entre na Área do Paciente, escolha o procedimento e conclua a avaliação para consultar a disponibilidade.`],
            ["Preciso preencher uma anamnese ao criar a conta?", "Não. A avaliação aparece somente depois que você escolhe um procedimento, com perguntas relacionadas àquela opção."],
            ["Os atendimentos são por ordem de chegada?", "Não. Procedimentos e avaliações são realizados somente com agendamento, após a consulta de disponibilidade."],
          ].map(([question, answer], index) => (
            <Reveal delay={index * 80} key={question}>
              <details>
                <summary>{question}<ChevronDown size={20} /></summary>
                <p>{answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-orb orb-a" aria-hidden="true" />
        <div className="cta-orb orb-b" aria-hidden="true" />
        <Reveal>
          <p className="eyebrow">Seu momento pode começar aqui</p>
          <h2>Cuidar de si também é uma forma de se olhar com carinho.</h2>
          <a className="primary-button light" href="/acesso">
            <span>Entrar na Área do Paciente</span><ArrowRight size={19} />
          </a>
        </Reveal>
      </section>

      <footer>
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark">CB</span>
          <span className="brand-copy"><strong>Claudia Bonavoglia</strong><small>Biomedicina estética</small></span>
        </a>
        <p>{clinicAddress} · CRBM 73824</p>
        <div className="footer-links">
          <a href="https://www.instagram.com/draclaudiabonavoglia/" target="_blank" rel="noreferrer">Instagram</a>
          <a href={publicWhatsappUrl} target="_blank" rel="noreferrer" data-track="whatsapp">WhatsApp</a>
          <a href={siteConfig.whatsappChannelUrl} target="_blank" rel="noopener noreferrer">Canal da Dra. Claudia</a>
          <a href="/privacidade">Política de privacidade</a>
        </div>
        <small>As informações deste site são educativas e não substituem avaliação profissional.</small>
      </footer>

      </main>

    </>
  );
}
