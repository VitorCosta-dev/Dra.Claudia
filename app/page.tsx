"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  AtSign,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const whatsappUrl =
  "https://wa.me/5511954114425?text=Ol%C3%A1%2C%20Dra.%20Claudia!%20Conheci%20seu%20trabalho%20pelo%20site%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o.";

const treatments = [
  {
    number: "01",
    name: "Toxina botulínica",
    eyebrow: "Expressão & prevenção",
    description:
      "Uma abordagem personalizada para suavizar linhas de expressão, preservando a naturalidade e a identidade do seu rosto.",
    note: "Planejamento individual após avaliação",
  },
  {
    number: "02",
    name: "Peeling coreano",
    eyebrow: "Uniformidade & luminosidade",
    description:
      "Protocolo voltado à renovação da pele, com foco em aparência mais uniforme, iluminada e bem cuidada.",
    note: "Indicação conforme as necessidades da pele",
  },
  {
    number: "03",
    name: "Peeling orgânico",
    eyebrow: "Renovação & textura",
    description:
      "Cuidado pensado para apoiar a renovação celular e melhorar a percepção de textura sem perder de vista o conforto da pele.",
    note: "Conduta definida em avaliação profissional",
  },
];

const concerns = [
  {
    label: "Linhas de expressão",
    title: "Preservar sua expressão, com leveza.",
    text: "A toxina botulínica pode fazer parte de um plano individual para suavizar marcas de expressão sem buscar um rosto padronizado.",
    tag: "Toxina botulínica",
  },
  {
    label: "Textura e viço",
    title: "Renovação que respeita a sua pele.",
    text: "Os protocolos de peeling são escolhidos após observar textura, sensibilidade e objetivos — porque cada pele responde de um jeito.",
    tag: "Peelings",
  },
  {
    label: "Cuidado contínuo",
    title: "Um plano, não uma solução genérica.",
    text: "A avaliação organiza prioridades e orienta uma jornada de cuidados coerente com a fase atual da sua pele.",
    tag: "Avaliação personalizada",
  },
];

const instagramMoments = [
  {
    src: "/images/instagram-studio-01.jpg",
    alt: "Bastidores de um atendimento da Dra. Claudia Bonavoglia",
    label: "Planejamento",
  },
  {
    src: "/images/instagram-studio-02.jpg",
    alt: "Detalhes do espaço e dos materiais da Dra. Claudia Bonavoglia",
    label: "Bastidores",
  },
  {
    src: "/images/instagram-treatment.jpg",
    alt: "Aplicação de toxina botulínica realizada pela Dra. Claudia Bonavoglia",
    label: "Técnica & cuidado",
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.14 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [activeConcern, setActiveConcern] = useState(0);

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
          <a href="/acesso">Área do paciente</a>
        </nav>

        <a className="nav-cta" href={whatsappUrl} target="_blank" rel="noreferrer">
          Agendar avaliação <ArrowDownRight size={17} aria-hidden="true" />
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />

        <div className="hero-content">
          <p className="eyebrow hero-kicker">
            <span /> Saúde da pele & estética facial
          </p>
          <h1 className="hero-title">
            <span className="title-line"><span>Beleza que se</span></span>
            <span className="title-line"><span>reconhece.</span></span>
          </h1>
          <p className="hero-description">
            Cuidado estético com escuta, planejamento e respeito às características que tornam o seu rosto único.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href={whatsappUrl} target="_blank" rel="noreferrer">
              <span>Agendar pelo WhatsApp</span>
              <MessageCircle size={19} aria-hidden="true" />
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
            <img src="/images/hero-skin.webp" alt="Mulher com pele natural iluminada em fotografia editorial" />
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
          <h2>Protocolos que começam pela <em>sua</em> necessidade.</h2>
        </Reveal>

        <div className="treatment-list">
          {treatments.map((treatment, index) => (
            <Reveal key={treatment.name} delay={index * 90}>
              <article className="treatment-card">
                <div className="treatment-number">{treatment.number}</div>
                <div className="treatment-main">
                  <p>{treatment.eyebrow}</p>
                  <h3>{treatment.name}</h3>
                </div>
                <p className="treatment-description">{treatment.description}</p>
                <div className="treatment-action">
                  <ArrowDownRight size={23} aria-hidden="true" />
                  <span>{treatment.note}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="experience section-pad" id="experiencia">
        <div className="experience-image" aria-hidden="true">
          <img src="/images/editorial-renewal.webp" alt="" />
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
              <a href={whatsappUrl} target="_blank" rel="noreferrer">Conversar com a Dra. Claudia <ArrowRight size={17} /></a>
            </div>
          </Reveal>
        </div>
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
          </div>
        </Reveal>

        <div className="instagram-grid">
          {instagramMoments.map((moment, index) => (
            <Reveal className={`instagram-card instagram-card-${index + 1}`} delay={index * 100} key={moment.src}>
              <a href="https://www.instagram.com/draclaudiabonavoglia/" target="_blank" rel="noreferrer" aria-label={`${moment.label} — ver no Instagram`}>
                <img src={moment.src} alt={moment.alt} />
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
            <img src="/images/instagram-profile.jpg" alt="Dra. Claudia Bonavoglia durante um atendimento" />
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
            ["Onde acontecem os atendimentos?", "Os atendimentos são realizados em Guarulhos, São Paulo. Ao chamar no WhatsApp, você recebe as informações de localização e disponibilidade."],
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
          <a className="primary-button light" href={whatsappUrl} target="_blank" rel="noreferrer">
            <span>Agendar minha avaliação</span><MessageCircle size={19} />
          </a>
        </Reveal>
      </section>

      <footer>
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark">CB</span>
          <span className="brand-copy"><strong>Claudia Bonavoglia</strong><small>Biomedicina estética</small></span>
        </a>
        <p>Guarulhos, SP · CRBM 73824</p>
        <div className="footer-links">
          <a href="https://www.instagram.com/draclaudiabonavoglia/" target="_blank" rel="noreferrer">Instagram</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        <small>As informações deste site são educativas e não substituem avaliação profissional.</small>
      </footer>
      </main>

      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar com a Dra. Claudia pelo WhatsApp">
        <MessageCircle size={22} />
        <span>Agendar</span>
      </a>
    </>
  );
}
