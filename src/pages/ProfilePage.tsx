import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CATEGORIES } from "../data/types";
import { ratingLabel } from "../lib/format";
import { usePageMeta } from "../lib/usePageMeta";
import { useApp } from "../store/AppStore";
import { ReviewCard } from "../components/ReviewCard";
import { SkillCard } from "../components/SkillCard";
import {
  Avatar,
  EmptyState,
  RatingBadge,
  VerificationBadge,
  Stars,
} from "../components/Primitives";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  GlobeIcon,
  MapPinIcon,
  PlusIcon,
  ShieldCheckIcon,
  WhatsAppIcon,
} from "../components/Icons";

type ProfileTab = "oferece" | "procura" | "avaliacoes";

export function ProfilePage() {
  const { personId } = useParams();
  const { state, me, personById, reviewsByPerson } = useApp();
  const person = personId ? personById(personId) : undefined;
  const [tab, setTab] = useState<ProfileTab>("oferece");

  const offers = useMemo(
    () => (person ? state.offers.filter((offer) => offer.personId === person.id) : []),
    [state.offers, person],
  );
  const reviews = person ? reviewsByPerson(person.id) : [];
  const wants = useMemo(
    () => Array.from(new Set(offers.flatMap((offer) => offer.wants))),
    [offers],
  );
  const activeOffers = offers.filter((offer) => offer.active);
  const isMine = me?.id === person?.id;

  usePageMeta(
    person ? `${person.name} · ${person.headline}` : "Perfil não encontrado",
    person ? `Perfil de ${person.name} em ${person.city}, ${person.province}. ${person.headline}.` : undefined,
  );

  if (!person) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state empty-state--page">
            <span className="empty-state__icon">
              <AlertIcon size={26} />
            </span>
            <h1 className="display-3">Este perfil não existe.</h1>
            <p>O membro pode ter removido o perfil ou o endereço está incompleto.</p>
            <Link className="btn btn--primary" to="/descobrir">
              Descobrir saberes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => Math.round(review.rating) === star).length,
  }));
  const maxCount = Math.max(...ratingCounts.map((item) => item.count), 1);

  return (
    <div className="page profile-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Caminho">
          <Link to="/descobrir">Descobrir</Link>
          <span>/</span>
          <span>{person.name}</span>
        </nav>

        <section className="profile-hero">
          <div className="profile-hero__band" aria-hidden="true" />
          <div className="profile-hero__main">
            <Avatar person={person} size="xl" />
            <div className="profile-hero__text">
              <div className="profile-hero__labels">
                <span className="mono-label">Perfil de membro</span>
                <VerificationBadge level={person.verification} />
              </div>
              <h1 className="display-2">{person.name}</h1>
              <p className="profile-hero__headline">{person.headline}</p>
              <div className="profile-hero__meta">
                <span>
                  <MapPinIcon size={15} />
                  {person.city}, {person.province}
                </span>
                <span>
                  <GlobeIcon size={15} />
                  {person.languages.join(", ")}
                </span>
                <span>Membro desde {person.since}</span>
              </div>
            </div>
            <div className="profile-hero__actions">
              {isMine ? (
                <>
                  <Link to="/painel?tab=ofertas" className="btn btn--primary">
                    Gerir as minhas ofertas
                  </Link>
                  <Link to="/publicar" className="btn btn--secondary">
                    <PlusIcon size={16} />
                    Nova oferta
                  </Link>
                </>
              ) : (
                <>
                  {activeOffers[0] ? (
                    <Link to={`/propor/${activeOffers[0].id}`} className="btn btn--primary">
                      Propor uma troca
                      <ArrowRightIcon size={16} />
                    </Link>
                  ) : (
                    <button type="button" className="btn btn--primary" disabled>
                      Sem ofertas activas
                    </button>
                  )}
                  <a href="#oferece" className="btn btn--ghost">
                    Ver os saberes
                  </a>
                </>

              )}
            </div>
          </div>
          <div className="profile-hero__stats">
            <div>
              <strong>{ratingLabel(person.rating)}</strong>
              <span>Avaliação média</span>
            </div>
            <div>
              <strong>{person.reviewCount}</strong>
              <span>Avaliações</span>
            </div>
            <div>
              <strong>{person.exchanges}</strong>
              <span>Trocas na comunidade</span>
            </div>
            <div>
              <strong>{person.responseRate}%</strong>
              <span>Responde aos pedidos</span>
            </div>
          </div>
        </section>

        <div className="profile-layout">
          <div className="profile-main">
            <div className="tabs" role="tablist" aria-label="Secções do perfil">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "oferece"}
                className={tab === "oferece" ? "is-active" : ""}
                onClick={() => setTab("oferece")}
              >
                Oferece <span>{offers.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "procura"}
                className={tab === "procura" ? "is-active" : ""}
                onClick={() => setTab("procura")}
              >
                Procura <span>{wants.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "avaliacoes"}
                className={tab === "avaliacoes" ? "is-active" : ""}
                onClick={() => setTab("avaliacoes")}
              >
                Avaliações <span>{reviews.length}</span>
              </button>
            </div>

            {tab === "oferece" && (
              <div id="oferece" className="tab-panel">
                {offers.length > 0 ? (
                  <div className="offers-grid offers-grid--two">
                    {offers.map((offer) => (
                      <SkillCard key={offer.id} offer={offer} person={person} showInactive />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Ainda não há ofertas neste perfil."
                    description={
                      isMine
                        ? "Publique um saber para começar a receber propostas."
                        : "Este membro ainda não publicou ofertas activas."
                    }
                    icon={<PlusIcon size={24} />}
                    action={isMine ? { label: "Publicar oferta", to: "/publicar" } : undefined}
                  />
                )}
              </div>
            )}

            {tab === "procura" && (
              <div className="tab-panel">
                <div className="wants-panel">
                  <h2 className="display-3">O que {isMine ? "procura" : `${person.name.split(" ")[0]} procura`}</h2>
                  <p>
                    Estes são os saberes que aparecem nas ofertas desta pessoa. Se tem um deles,
                    pode propor uma troca.
                  </p>
                  {wants.length > 0 ? (
                    <div className="tag-row tag-row--large">
                      {wants.map((want) => (
                        <Link className="tag tag--link" key={want} to={`/descobrir?q=${encodeURIComponent(want)}`}>
                          {want}
                          <ArrowRightIcon size={13} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="muted-copy">Ainda não indicou o que procura.</p>
                  )}
                  <div className="wants-panel__note">
                    <CheckCircleIcon size={18} />
                    <p>
                      A troca não precisa de ser um espelho. Pode oferecer outro saber que a outra
                      pessoa queira aprender.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {tab === "avaliacoes" && (
              <div className="tab-panel">
                <div className="reviews-summary">
                  <div className="reviews-summary__score">
                    <strong>{ratingLabel(person.rating)}</strong>
                    <Stars value={person.rating} size={17} />
                    <span>{reviews.length} avaliações nesta demonstração</span>
                  </div>
                  <div className="reviews-summary__bars">
                    {ratingCounts.map((item) => (
                      <div className="rating-bar" key={item.star}>
                        <span>{item.star}</span>
                        <div>
                          <span style={{ width: `${(item.count / maxCount) * 100}%` }} />
                        </div>
                        <strong>{item.count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="reviews-summary__note">
                  <ShieldCheckIcon size={15} />
                  Todas as avaliações estão ligadas a trocas concluídas nesta conta.
                </p>
                {reviews.length > 0 ? (
                  <div className="review-list">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Ainda não há avaliações."
                    description="Depois da primeira troca concluída, a avaliação aparece aqui."
                    icon={<Stars value={0} />}
                  />
                )}
              </div>
            )}
          </div>

          <aside className="profile-side">
            <div className="profile-side__card">
              <h3>Confiança neste perfil</h3>
              <VerificationBadge level={person.verification} />
              <p className="profile-side__verify-text">
                {person.verification === "mentor"
                  ? "Experiência ou credencial profissional confirmada pela equipa, além da identidade."
                  : person.verification === "comunidade"
                    ? "Identidade confirmada e pelo menos três trocas concluídas com boa avaliação."
                    : "Documento de identidade confirmado. As avaliações mostram o resto."}
              </p>
              <ul className="profile-side__list">
                <li>
                  <span>Resposta</span>
                  <strong>{person.responseRate}%</strong>
                </li>
                <li>
                  <span>Trocas</span>
                  <strong>{person.exchanges}</strong>
                </li>
                <li>
                  <span>Desde</span>
                  <strong>{person.since}</strong>
                </li>
                <li>
                  <span>Província</span>
                  <strong>{person.province}</strong>
                </li>
              </ul>
              <Link to="/confianca" className="text-link">
                O que significa cada nível
                <ArrowRightIcon size={14} />
              </Link>
            </div>

            <div className="profile-side__card">
              <WhatsAppIcon size={20} />
              <h3>Conversa com privacidade</h3>
              <p>
                A conversa continua no WhatsApp só depois de uma troca aceite. Recomendamos um nome
                de utilizador em vez do número, para proteger a sua privacidade.
              </p>
              <Link to="/confianca#whatsapp" className="text-link">
                Como proteger o número
                <ArrowRightIcon size={14} />
              </Link>
            </div>

            <div className="profile-side__card">
              <h3>Línguas</h3>
              <div className="tag-row">
                {person.languages.map((language) => (
                  <span className="tag" key={language}>
                    {language}
                  </span>
                ))}
              </div>
              <p className="profile-side__bio">{person.bio}</p>
            </div>
          </aside>
        </div>

        <section className="profile-next">
          <div>
            <p className="mono-label">Próximo passo</p>
            <h2 className="display-3">
              {isMine ? "Veja quem procura o que sabe." : `Tem algo que ${person.name.split(" ")[0]} procura?`}
            </h2>
            <p>
              {isMine
                ? "Explore ofertas activas e encontre a próxima troca."
                : "Publique uma oferta ou proponha uma troca direta com um saber seu."}
            </p>
          </div>
          <div className="profile-next__actions">
            <Link to="/descobrir" className="btn btn--primary">
              Explorar saberes
              <ArrowRightIcon size={16} />
            </Link>
            {!isMine && (
              <Link to="/publicar" className="btn btn--secondary">
                Publicar oferta
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
