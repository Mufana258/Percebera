import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import { useApp } from "../store/AppStore";
import { Reveal } from "../components/SiteLayout";
import { Avatar, SectionHeading } from "../components/Primitives";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  GlobeIcon,
  QuoteIcon,
  ShieldCheckIcon,
  SwapIcon,
  UsersIcon,
} from "../components/Icons";

const PROVINCE_DATA = [
  { province: "Maputo Cidade", value: 28 },
  { province: "Sofala", value: 13 },
  { province: "Nampula", value: 12 },
  { province: "Zambézia", value: 10 },
  { province: "Manica", value: 9 },
  { province: "Tete", value: 7 },
  { province: "Gaza", value: 6 },
  { province: "Cabo Delgado", value: 5 },
  { province: "Inhambane", value: 4 },
  { province: "Niassa", value: 3 },
  { province: "Maputo Província", value: 3 },
];

const VALUES = [
  {
    icon: SwapIcon,
    title: "Sem dinheiro pelo meio",
    text: "O ponto de partida é quem não tem dinheiro para pagar uma formação, mas tem tempo, saber e vontade de aprender.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Confiança construída localmente",
    text: "Verificação, avaliações e referências da comunidade. A reputação vem de trocas reais, não de anúncios.",
  },
  {
    icon: UsersIcon,
    title: "Aprender a ensinar",
    text: "Ensinar também é uma competência. A plataforma dá contexto, regras e retorno para quem partilha o que sabe.",
  },
];

const ROADMAP = [
  {
    phase: "Fase 1",
    title: "Piloto em Maputo e Matola",
    points: [
      "Primeiros 300 membros com acompanhamento",
      "Parcerias com associações e escolas de bairro",
      "Categorias iniciais: ofícios, línguas e tecnologia",
    ],
  },
  {
    phase: "Fase 2",
    title: "Beira, Nampula e Tete",
    points: [
      "Expansão com coordenadores locais",
      "Acesso por SMS e modo de poupança de dados",
      "Painel para organizações e relatórios de participação",
    ],
  },
  {
    phase: "Fase 3",
    title: "Cobertura nacional",
    points: [
      "Todas as províncias, com foco em zonas periurbanas",
      "Modo offline para sessões sem ligação",
      "Relatório público de impacto e aprendizagem",
    ],
  },
];

export function CommunityPage() {
  usePageMeta(
    "Comunidade e impacto",
    "A visão comunitária da Percebera em Moçambique: troca de saberes, confiança local, organizações parceiras e roteiro do piloto.",
  );
  const { personById } = useApp();
  const amina = personById("p-amina");
  const celina = personById("p-celina");
  const vania = personById("p-vania");
  const lucia = personById("p-lucia");
  const graca = personById("p-graca");
  const helder = personById("p-helder");

  return (
    <div className="page">
      <section className="page-hero page-hero--statement">
        <div className="container">
          <p className="eyebrow">Comunidade e impacto</p>
          <h1 className="display-1 display-1--page">
            O saber já existe.
            <em>Falta torná-lo visível.</em>
          </h1>
          <p className="page-hero__lead page-hero__lead--wide">
            Em cada bairro há quem saiba coser, soldar, cozinhar, programar, negociar ou ensinar a
            ler. A Percebera dá a esse saber um lugar, uma reputação e uma forma de circular.
          </p>
          <div className="statement-tags">
            <span>11 províncias representadas</span>
            <span>9 categorias de saberes</span>
            <span>Sem comissões</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Porque existimos"
              title="A comunidade é o produto."
              description="A Percebera não cria saber. Cria as condições para que o saber que já existe encontre quem precisa dele."
            />
          </Reveal>
          <div className="value-grid">
            {VALUES.map((value, index) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} delay={index * 70}>
                  <article className="value-card">
                    <span className="value-card__icon">
                      <Icon size={22} />
                    </span>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container coverage-grid">
          <Reveal>
            <p className="eyebrow">Cobertura</p>
            <h2 className="display-2">Onde a comunidade já está.</h2>
            <p>
              Moçambique é grande e diverso. O piloto começa nas cidades com maior densidade de
              membros e cresce com coordenadores locais, não por decreto.
            </p>
            <div className="coverage-note">
              <GlobeIcon size={18} />
              <p>
                Distribuição ilustrativa dos primeiros membros. Nesta demonstração, os perfis
                representam todas as províncias, mas os números não são medições reais.
              </p>
            </div>
            <Link to="/descobrir" className="btn btn--secondary btn--sm">
              Ver ofertas por província
              <ArrowRightIcon size={15} />
            </Link>
          </Reveal>
          <Reveal delay={80}>
            <div className="coverage-list">
              {PROVINCE_DATA.map((item) => (
                <div className="coverage-row" key={item.province}>
                  <span>{item.province}</span>
                  <div>
                    <span style={{ width: `${(item.value / 28) * 100}%` }} />
                  </div>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Histórias"
              title="Trocas que mudaram uma semana."
              description="Histórias ilustrativas, baseadas nos perfis de demonstração. Cada uma começa com uma oferta e termina com uma avaliação."
            />
          </Reveal>
          <div className="story-grid">
            {amina && celina && (
              <Reveal>
                <article className="story-card">
                  <div className="story-card__top">
                    <Avatar person={amina} size="md" />
                    <div>
                      <strong>Amina</strong>
                      <span>Maputo · aprendeu costura com a Celina</span>
                    </div>
                    <QuoteIcon size={20} />
                  </div>
                  <blockquote>
                    “A Celina ensina com calma e mostra o porquê de cada medida. Fiz a minha
                    primeira saia.”
                  </blockquote>
                  <p className="story-card__swap">
                    Deu: Excel para o negócio <span>⇄</span> Recebeu: corte e costura
                  </p>
                </article>
              </Reveal>
            )}
            {vania && lucia && (
              <Reveal delay={70}>
                <article className="story-card">
                  <div className="story-card__top">
                    <Avatar person={vania} size="md" />
                    <div>
                      <strong>Vânia</strong>
                      <span>Matola · aprendeu pastelaria com a Lúcia</span>
                    </div>
                    <QuoteIcon size={20} />
                  </div>
                  <blockquote>
                    “Aprender pastelaria com a Lúcia mudou a minha renda ao fim de semana. Ensina
                    também a calcular os custos.”
                  </blockquote>
                  <p className="story-card__swap">
                    Deu: cuidados de cabelo <span>⇄</span> Recebeu: pastelaria para vender
                  </p>
                </article>
              </Reveal>
            )}
            {graca && helder && (
              <Reveal delay={140}>
                <article className="story-card">
                  <div className="story-card__top">
                    <Avatar person={graca} size="md" />
                    <div>
                      <strong>Graça</strong>
                      <span>Maputo · aprendeu a criar uma página web</span>
                    </div>
                    <QuoteIcon size={20} />
                  </div>
                  <blockquote>
                    “Aprendi a colocar a minha página no ar na primeira sessão. O Hélder explica
                    sem pressa.”
                  </blockquote>
                  <p className="story-card__swap">
                    Deu: edição de vídeo <span>⇄</span> Recebeu: primeira página web
                  </p>
                </article>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Roteiro"
              title="Crescer sem perder a raiz."
              description="Roteiro indicativo, sujeito a financiamento, parcerias e aprendizagem do piloto."
            />
          </Reveal>
          <div className="roadmap-grid">
            {ROADMAP.map((item, index) => (
              <Reveal key={item.phase} delay={index * 70}>
                <article className="roadmap-card">
                  <div className="roadmap-card__top">
                    <span className="mono-label">{item.phase}</span>
                    <span className="roadmap-card__dot" aria-hidden="true" />
                  </div>
                  <h3>{item.title}</h3>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>
                        <CheckCircleIcon size={14} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <p className="eyebrow">Comunidade</p>
            <h2 className="display-2">O próximo saber está a dois quarteirões.</h2>
            <p>Entre na lista de lançamento e ajude a abrir a primeira praça de trocas.</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/lista-de-espera" className="btn btn--accent btn--lg">
              Entrar na lista
              <ArrowRightIcon size={17} />
            </Link>
            <Link to="/descobrir" className="btn btn--secondary btn--lg">
              Explorar ofertas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
