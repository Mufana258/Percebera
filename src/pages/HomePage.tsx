import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../store/AppStore";
import { usePageMeta } from "../lib/usePageMeta";
import { Reveal } from "../components/SiteLayout";
import { SectionHeading, Avatar, RatingBadge } from "../components/Primitives";
import { SkillCard } from "../components/SkillCard";
import { WaitlistForm } from "../components/WaitlistForm";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  QuoteIcon,
  SearchIcon,
  ShieldCheckIcon,
  SwapIcon,
  UsersIcon,
} from "../components/Icons";

const STEPS = [
  {
    icon: UsersIcon,
    title: "Crie o seu perfil",
    text: "Diga o que sabe fazer e o que quer aprender. Sem currículos e sem diplomas obrigatórios.",
  },
  {
    icon: PlusIcon,
    title: "Publique um saber",
    text: "Uma hora de Excel, uma tarde de carpintaria, conversas em Makhuwa. Escolha o formato e o que procura em troca.",
  },
  {
    icon: SearchIcon,
    title: "Encontre a pessoa certa",
    text: "Pesquise por saber, província ou língua. Veja avaliações e níveis de verificação antes de propor.",
  },
  {
    icon: SwapIcon,
    title: "Combine a troca",
    text: "Proponha uma troca direta, combine o dia e o local, e ensinem um ao outro. Sem dinheiro pelo meio.",
  },
];

const TRUST = [
  {
    icon: ShieldCheckIcon,
    title: "Verificação em níveis",
    text: "Identidade, comunidade e credencial profissional. Cada nível diz exactamente o que foi confirmado.",
  },
  {
    icon: CheckCircleIcon,
    title: "Avaliações de trocas reais",
    text: "Só quem concluiu uma troca pode avaliar. Sem estrelas compradas, sem currículos inventados.",
  },
  {
    icon: UsersIcon,
    title: "Um acordo comunitário",
    text: "Respeito, consentimento e segurança. Regras claras para sessões com menores e para dinheiro fora da plataforma.",
  },
];

const POPULAR = ["Costura", "Excel", "Inglês", "Makhuwa", "Carpintaria"];

export function HomePage() {
  usePageMeta(
    "Troca de saberes em Moçambique",
    "Ensine o que sabe, aprenda o que procura. A Percebera liga pessoas para trocar conhecimentos, ofícios e serviços sem dinheiro pelo meio.",
  );
  const { state, personById } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const celina = personById("p-celina");
  const amina = personById("p-amina");
  const lucia = personById("p-lucia");
  const vania = personById("p-vania");

  const featured = ["o-costura-celina", "o-pastelaria-lucia", "o-web-helder"]
    .map((id) => state.offers.find((offer) => offer.id === id))
    .filter((offer): offer is NonNullable<typeof offer> => Boolean(offer));

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/descobrir?q=${encodeURIComponent(term)}` : "/descobrir");
  };

  if (!celina || !amina || !lucia || !vania) return null;

  return (
    <>
      <section className="hero">
        <div className="hero__wash" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Plataforma comunitária de saberes · Moçambique</p>
            <h1 className="display-1">
              Todos têm algo para ensinar.
              <em>E algo para aprender.</em>
            </h1>
            <p className="hero__lead">
              A Percebera liga pessoas que querem trocar conhecimentos, ofícios e serviços. Sem
              dinheiro pelo meio: o que se aprende, devolve-se a ensinar.
            </p>
            <div className="hero__actions">
              <Link to="/descobrir" className="btn btn--primary btn--lg">
                Explorar trocas
                <ArrowRightIcon size={17} />
              </Link>
              <Link to="/lista-de-espera" className="btn btn--secondary btn--lg">
                Entrar na lista
              </Link>
            </div>
            <p className="hero__proof">
              <ShieldCheckIcon size={15} />
              Troca direta de saberes. Sem comissões e sem subscrições.
            </p>
          </div>

          <div className="hero__visual">
            <div className="hero__pattern" aria-hidden="true" />
            <article className="swap-ticket">
              <div className="swap-ticket__band" aria-hidden="true" />
              <div className="swap-ticket__head">
                <span className="mono-label">Troca em destaque</span>
                <span className="badge badge--outline">
                  <SwapIcon size={12} />
                  Troca direta
                </span>
              </div>
              <div className="swap-ticket__pair">
                <div className="swap-ticket__person">
                  <Avatar person={celina} size="lg" />
                  <span className="mono-label">A Celina ensina</span>
                  <strong>Corte e costura com capulana</strong>
                  <span className="swap-ticket__place">
                    <MapPinIcon size={12} />
                    Chimoio, Manica
                  </span>
                </div>
                <div className="swap-ticket__connector" aria-hidden="true">
                  <span className="swap-ticket__connector-icon">
                    <SwapIcon size={19} />
                  </span>
                  <span>troca de saberes</span>
                </div>
                <div className="swap-ticket__person swap-ticket__person--right">
                  <Avatar person={amina} size="lg" />
                  <span className="mono-label">A Amina ensina</span>
                  <strong>Excel para o negócio</strong>
                  <span className="swap-ticket__place">
                    <MapPinIcon size={12} />
                    Maputo
                  </span>
                </div>
              </div>
              <div className="swap-ticket__meta">
                <span>
                  <ClockIcon size={13} />
                  Sábado, 08h30 · 3h
                </span>
                <RatingBadge value={4.9} />
              </div>
              <p className="swap-ticket__note">
                Uma tarde de cada lado. Nenhum metical. A troca começa por perceber o que a outra
                pessoa já sabe.
              </p>
            </article>
          </div>
        </div>
      </section>

      <div className="container search-band-wrap">
        <div className="search-band">
          <form className="search-capsule" onSubmit={submitSearch} role="search">
            <SearchIcon size={19} />
            <label htmlFor="home-search" className="sr-only">
              O que quer aprender?
            </label>
            <input
              id="home-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="O que quer aprender? Ex: costura, Excel, inglês"
            />
            <button type="submit" className="btn btn--primary btn--sm">
              Procurar
            </button>
          </form>
          <div className="search-band__popular">
            <span>Populares</span>
            {POPULAR.map((term) => (
              <Link key={term} to={`/descobrir?q=${encodeURIComponent(term)}`}>
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Como funciona"
              title="Encontrar alguém começa por saber o que já tem."
              description="A Percebera não vende cursos nem promete empregos. Aproxima pessoas que querem ensinar e aprender, com tempo e saberes como moeda."
              action={{ label: "Ver o modelo completo", to: "/como-funciona" }}
            />
          </Reveal>
          <div className="steps-grid">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={index * 70} className="step-wrap">
                  <article className="step">
                    <div className="step__top">
                      <span className="step__number">0{index + 1}</span>
                      <span className="step__icon">
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

      <section className="section section--paper">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Em destaque"
              title="Saberes que já estão a circular."
              description="Três exemplos de ofertas publicadas nesta demonstração. Cada uma abre uma troca direta de saberes."
              action={{ label: "Ver todas as trocas", to: "/descobrir" }}
            />
          </Reveal>
          <div className="offers-grid">
            {featured.map((offer, index) => {
              const person = personById(offer.personId);
              if (!person) return null;
              return (
                <Reveal key={offer.id} delay={index * 80}>
                  <SkillCard offer={offer} person={person} />
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
              eyebrow="Confiança por desenho"
              title="Perfis que mostram quem está do outro lado."
              description="A troca só funciona quando há confiança. Por isso, cada perfil mostra o que foi verificado, o que a comunidade avaliou e o que ainda não sabemos."
              action={{ label: "Ler a política de confiança", to: "/confianca" }}
            />
          </Reveal>
          <div className="trust-grid">
            {TRUST.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 70}>
                  <article className="trust-card">
                    <span className="trust-card__icon">
                      <Icon size={22} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--paper" id="comunidade">
        <div className="container community-grid">
          <Reveal className="community-copy">
            <p className="eyebrow">Comunidade</p>
            <h2 className="display-2">O saber já existe. A plataforma só o torna visível.</h2>
            <p>
              Em cada bairro há quem saiba coser, soldar, cozinhar, programar, negociar ou ensinar
              a ler. Muitas vezes, esse saber não tem onde ser encontrado. A Percebera dá-lhe um
              lugar, uma reputação e uma forma de circular.
            </p>
            <div className="stat-row">
              <div>
                <strong>11</strong>
                <span>províncias representadas</span>
              </div>
              <div>
                <strong>9</strong>
                <span>categorias de saberes</span>
              </div>
              <div>
                <strong>0 MZN</strong>
                <span>para começar uma troca</span>
              </div>
              <div>
                <strong>2</strong>
                <span>saberes por cada troca</span>
              </div>
            </div>
          </Reveal>
          <div className="quote-stack">
            <Reveal delay={80}>
              <figure className="quote-card">
                <QuoteIcon size={24} className="quote-card__icon" />
                <blockquote>
                  A Celina ensina com calma e mostra o porquê de cada medida. Fiz a minha primeira
                  saia.
                </blockquote>
                <figcaption>
                  <Avatar person={amina} size="sm" />
                  <div>
                    <strong>Amina Mabunda</strong>
                    <span>Maputo · aprendeu costura</span>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={160}>
              <figure className="quote-card quote-card--offset">
                <QuoteIcon size={24} className="quote-card__icon" />
                <blockquote>
                  Aprender pastelaria com a Lúcia mudou a minha renda ao fim de semana. Ensina
                  também a calcular os custos.
                </blockquote>
                <figcaption>
                  <Avatar person={vania} size="sm" />
                  <div>
                    <strong>Vânia Muianga</strong>
                    <span>Matola · aprendeu pastelaria</span>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="launch-band" id="lista">
        <div className="launch-band__pattern" aria-hidden="true" />
        <div className="container launch-band__grid">
          <Reveal className="launch-band__copy">
            <p className="eyebrow">Lançamento oficial</p>
            <h2 className="display-2">Seja dos primeiros a trocar saberes.</h2>
            <p>
              A Percebera está em piloto fechado. Deixe o seu email e o seu LinkedIn para receber
              o convite de lançamento e as vagas do piloto em Maputo.
            </p>
            <ul className="check-list check-list--inverse">
              <li>
                <CheckCircleIcon size={16} />
                Convite antes da abertura pública
              </li>
              <li>
                <CheckCircleIcon size={16} />
                Prioridade nas vagas do piloto
              </li>
            </ul>
          </Reveal>
          <Reveal delay={100} className="launch-band__form">
            <p className="mono-label">Lista de espera</p>
            <h3>Receba o primeiro convite.</h3>
            <WaitlistForm source="home" compact />
          </Reveal>
        </div>
      </section>
    </>
  );
}
