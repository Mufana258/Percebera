import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import { Reveal } from "../components/SiteLayout";
import { SectionHeading } from "../components/Primitives";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CloseIcon,
  ClockIcon,
  GlobeIcon,
  SearchIcon,
  SwapIcon,
  UsersIcon,
} from "../components/Icons";

const STEPS = [
  {
    number: "01",
    title: "Diga o que sabe",
    text: "Crie um perfil com o que já faz bem, o que quer aprender e as línguas em que se sente à vontade. Não precisa de currículo nem de diploma.",
    icon: UsersIcon,
  },
  {
    number: "02",
    title: "Publique uma oferta",
    text: "Escolha um saber concreto, o tempo que leva, o formato e o que procura em troca. Uma boa oferta é específica e possível.",
    icon: SearchIcon,
  },
  {
    number: "03",
    title: "Descubra e compare",
    text: "Pesquise por saber, província ou língua. Veja o nível de verificação, as avaliações e o que cada pessoa procura.",
    icon: GlobeIcon,
  },
  {
    number: "04",
    title: "Proponha a troca",
    text: "Escolha um saber seu para oferecer em troca. Escreva uma mensagem com o que quer aprender e quando pode.",
    icon: SwapIcon,
  },
  {
    number: "05",
    title: "Combinem a sessão",
    text: "Escolham o formato, o horário e o ponto de encontro. A conversa continua no WhatsApp, com um nome de utilizador em vez do número. Para uma primeira troca, prefira um espaço público e avise alguém.",
    icon: ClockIcon,
  },
  {
    number: "06",
    title: "Concluam e avaliem",
    text: "Depois da sessão, marquem a troca como concluída e avaliem o que aprenderam. As avaliações ficam ligadas a trocas reais.",
    icon: CheckCircleIcon,
  },
];

const FAQ = [
  {
    q: "Preciso de dinheiro para participar?",
    a: "Não. A Percebera foi desenhada para quem não tem dinheiro para pagar uma formação. Cada pessoa oferece um saber seu em troca do saber da outra.",
  },
  {
    q: "Posso ensinar sem ter diploma?",
    a: "Sim. A verificação de identidade não é um diploma. O nível de mentor confirma experiência ou credencial quando existe, mas a maioria dos saberes é validada pela comunidade através das avaliações.",
  },
  {
    q: "Como sei que a outra pessoa é de confiança?",
    a: "Veja o nível de verificação, as avaliações ligadas a trocas concluídas e a taxa de resposta. Comece com uma sessão curta, em local público se for presencial, e conte a alguém onde vai estar.",
  },
  {
    q: "A conversa acontece no WhatsApp?",
    a: "Sim. Depois de uma proposta ser aceite, as duas pessoas podem abrir a conversa no WhatsApp a partir do painel. Recomendamos usar um nome de utilizador do WhatsApp em vez do número, para proteger a privacidade. A Percebera não publica números nas ofertas nem nos perfis.",
  },
  {
    q: "E se a sessão não acontecer?",
    a: "Podem remarcar ou cancelar a proposta antes da conclusão. Depois do lançamento, a equipa poderá mediar conflitos.",
  },
  {
    q: "A Percebera cobra comissão?",
    a: "Não. As trocas são diretas e não têm dinheiro pelo meio. A plataforma não retira uma parte do seu tempo.",
  },
  {
    q: "E sessões com menores de idade?",
    a: "Um menor deve ter consentimento do responsável. A sessão deve acontecer com o responsável presente ou num espaço supervisionado, como uma escola ou associação.",
  },
  {
    q: "O que não posso ensinar?",
    a: "Serviços ilegais, práticas perigosas sem qualificação ou qualquer coisa que exija uma licença que não tem. Em caso de dúvida, fale com a equipa antes de publicar.",
  },
];

export function HowItWorksPage() {
  usePageMeta(
    "Como funciona",
    "Entenda o modelo de troca de saberes da Percebera: troca direta, verificação, avaliações e segurança.",
  );

  return (
    <div className="page">
      <section className="page-hero page-hero--statement">
        <div className="container">
          <p className="eyebrow">Como funciona</p>
          <h1 className="display-1 display-1--page">Antes de trocar, perceber.</h1>
          <p className="page-hero__lead page-hero__lead--wide">
            Ku twisisa significa compreender. A Percebera não é um catálogo de cursos. É uma forma
            de encontrar alguém que já sabe o que quer aprender e que também quer aprender algo
            consigo.
          </p>
          <div className="statement-tags">
            <span>Pessoas, não cursos</span>
            <span>Saberes, não diplomas</span>
            <span>Tempo, não dinheiro</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Na prática"
              title="Seis passos, nenhum pagamento."
              description="O mesmo mecanismo serve para uma aula de Excel, uma tarde de carpintaria ou conversas em Makhuwa."
            />
          </Reveal>
          <div className="process-grid">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.number} delay={index * 60}>
                  <article className="process-card">
                    <div className="process-card__top">
                      <span className="mono-label">{step.number}</span>
                      <span className="process-card__icon">
                        <Icon size={20} />
                      </span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Fronteiras claras"
              title="O que a Percebera não é."
              description="A clareza faz parte do produto. Não queremos prometer o que não somos."
            />
          </Reveal>
          <div className="not-grid">
            <article className="not-card">
              <span className="not-card__label">
                <CloseIcon size={14} />
                Não é
              </span>
              <h3>Uma plataforma de cursos</h3>
              <p>
                Não há vídeos gravados nem certificados automáticos. Há pessoas que se encontram
                para ensinar e aprender.
              </p>
            </article>
            <article className="not-card">
              <span className="not-card__label">
                <CloseIcon size={14} />
                Não é
              </span>
              <h3>Um mercado de empregos</h3>
              <p>
                Não promete emprego nem substitui um concurso. Ajuda a criar confiança e a tornar
                saberes visíveis.
              </p>
            </article>
            <article className="not-card">
              <span className="not-card__label">
                <CloseIcon size={14} />
                Não é
              </span>
              <h3>Um chatbot</h3>
              <p>
                A plataforma aproxima pessoas. A conversa e a decisão de trocar são humanas, com
                contexto e responsabilidade.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container faq-layout">
          <div>
            <p className="eyebrow">Perguntas frequentes</p>
            <h2 className="display-2">Dúvidas antes de começar.</h2>
            <p className="faq-intro">
              Se faltar alguma resposta, escreva para a equipa na página da lista de espera.
            </p>
            <Link to="/confianca" className="text-link">
              Ler a política de confiança
              <ArrowRightIcon size={15} />
            </Link>
          </div>
          <div className="faq-list">
            {FAQ.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>
                  {item.q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <p className="eyebrow">Lista de espera</p>
            <h2 className="display-2">A primeira troca começa com um convite.</h2>
            <p>
              Deixe o seu email e LinkedIn para receber o lançamento oficial e as vagas do piloto.
            </p>
          </div>
          <div className="cta-band__actions">
            <Link to="/lista-de-espera" className="btn btn--accent btn--lg">
              Entrar na lista
              <ArrowRightIcon size={17} />
            </Link>
            <Link to="/descobrir" className="btn btn--secondary btn--lg">
              Explorar a demonstração
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
