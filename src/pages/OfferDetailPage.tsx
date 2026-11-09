import { Link, useParams } from "react-router-dom";
import { CATEGORIES } from "../data/types";
import { formatLabel, ratingLabel } from "../lib/format";
import { usePageMeta } from "../lib/usePageMeta";
import { useApp } from "../store/AppStore";
import { ReviewCard } from "../components/ReviewCard";
import { SkillCard } from "../components/SkillCard";
import {
  Avatar,
  RatingBadge,
  SectionHeading,
  StatusBadge,
  VerificationBadge,
} from "../components/Primitives";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeIcon,
  MapPinIcon,
  ShieldCheckIcon,
  WhatsAppIcon,
} from "../components/Icons";

export function OfferDetailPage() {
  const { offerId } = useParams();
  const { state, me, personById, reviewsByPerson } = useApp();
  const offer = offerId ? state.offers.find((item) => item.id === offerId) : undefined;
  const person = offer ? personById(offer.personId) : undefined;
  const reviews = person ? reviewsByPerson(person.id) : [];
  const category = CATEGORIES.find((item) => item.id === offer?.category);
  const otherOffers = person
    ? state.offers.filter(
        (item) => item.personId === person.id && item.id !== offer?.id && item.active,
      )
    : [];

  usePageMeta(
    offer?.title ?? "Oferta não encontrada",
    offer?.description ?? "Oferta de troca de saberes na Percebera.",
  );

  if (!offer || !person) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state empty-state--page">
            <span className="empty-state__icon">
              <AlertIcon size={26} />
            </span>
            <h1 className="display-3">Esta oferta já não está disponível.</h1>
            <p>Pode ter sido pausada ou removida pelo membro. Explore outras trocas activas.</p>
            <Link className="btn btn--primary" to="/descobrir">
              Descobrir saberes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMine = me?.id === person.id;
  const existing = me
    ? state.exchanges.find(
        (exchange) =>
          exchange.offerId === offer.id &&
          exchange.fromPersonId === me.id &&
          (exchange.status === "pendente" || exchange.status === "aceite"),
      )
    : undefined;
  const wantedByMe = me
    ? state.exchanges.find(
        (exchange) =>
          exchange.offerId === offer.id &&
          exchange.toPersonId === me.id &&
          exchange.status === "pendente",
      )
    : undefined;

  return (
    <div className="page offer-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Caminho">
          <Link to="/">Início</Link>
          <span>/</span>
          <Link to="/descobrir">Descobrir</Link>
          <span>/</span>
          <span>{offer.title}</span>
        </nav>

        <div className="offer-layout">
          <article className="offer-main">
            <div className="offer-head">
              <div className="offer-head__labels">
                <span className="badge badge--muted">{category?.label}</span>
                {!offer.active && <span className="badge badge--warn">Oferta pausada</span>}
              </div>
              <h1 className="display-1 display-1--page">{offer.title}</h1>
              <div className="offer-meta-row">
                <RatingBadge value={person.rating} count={person.reviewCount} />
                <span>
                  <MapPinIcon size={15} />
                  {person.city}, {person.province}
                </span>
                <span>
                  <ClockIcon size={15} />
                  {offer.duration} por sessão
                </span>
                <span>
                  <GlobeIcon size={15} />
                  {formatLabel(offer.format)}
                </span>
              </div>
            </div>

            <Link to={`/perfil/${person.id}`} className="offer-person-strip">
              <Avatar person={person} size="lg" />
              <div className="offer-person-strip__text">
                <span className="mono-label">Ensinado por</span>
                <strong>{person.name}</strong>
                <span>{person.headline}</span>
                <VerificationBadge level={person.verification} />
              </div>
              <span className="offer-person-strip__link">
                Ver perfil
                <ArrowRightIcon size={15} />
              </span>
            </Link>

            <section className="offer-section">
              <h2>Sobre esta troca</h2>
              <p>{offer.description}</p>
            </section>

            {offer.outcomes.length > 0 && (
              <section className="offer-section">
                <h2>O que vai aprender</h2>
                <ul className="check-list">
                  {offer.outcomes.map((outcome) => (
                    <li key={outcome}>
                      <CheckCircleIcon size={16} />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="offer-section">
              <h2>O que procura em troca</h2>
              <div className="tag-row">
                {offer.wants.map((want) => (
                  <span className="tag" key={want}>
                    {want}
                  </span>
                ))}
              </div>
              <p className="offer-section__hint">
                Proponha uma troca direta com um saber seu. As duas pessoas ensinam e aprendem.
              </p>
            </section>

            <section className="offer-section">
              <h2>Detalhes da sessão</h2>
              <dl className="detail-grid">
                <div>
                  <dt>Formato</dt>
                  <dd>{formatLabel(offer.format)}</dd>
                </div>
                <div>
                  <dt>Duração</dt>
                  <dd>{offer.duration}</dd>
                </div>
                <div>
                  <dt>Disponibilidade</dt>
                  <dd>{offer.availability}</dd>
                </div>
                <div>
                  <dt>Línguas da sessão</dt>
                  <dd>{offer.languages.join(", ")}</dd>
                </div>
                <div>
                  <dt>Modelo</dt>
                  <dd>Troca direta de saberes</dd>
                </div>
                <div>
                  <dt>Localização</dt>
                  <dd>
                    {person.city}, {person.province}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="offer-section">
              <div className="offer-section__head">
                <h2>Avaliações de {person.name.split(" ")[0]}</h2>
                <Link to={`/perfil/${person.id}`} className="text-link">
                  Ver todas
                  <ArrowRightIcon size={15} />
                </Link>
              </div>
              {reviews.length > 0 ? (
                <div className="review-list review-list--compact">
                  {reviews.slice(0, 2).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="muted-copy">Ainda não há avaliações. Esta pode ser a primeira troca.</p>
              )}
            </section>

            <div className="safety-note">
              <ShieldCheckIcon size={20} />
              <div>
                <strong>A troca acontece entre pessoas.</strong>
                <p>
                  A Percebera não cobra dinheiro nem processa pagamentos. Nunca envie códigos
                  M-Pesa, e-Mola ou transferências para reservar uma sessão.
                </p>
              </div>
            </div>
          </article>

          <aside className="offer-side">
            <div className="offer-action-card">
              <p className="mono-label">Como pode acontecer</p>
              <span className="badge badge--outline">Troca direta</span>
              <dl className="offer-action-card__facts">
                <div>
                  <dt>Duração</dt>
                  <dd>{offer.duration}</dd>
                </div>
                <div>
                  <dt>Formato</dt>
                  <dd>{formatLabel(offer.format)}</dd>
                </div>
                <div>
                  <dt>Disponibilidade</dt>
                  <dd>{offer.availability}</dd>
                </div>
              </dl>

              {isMine ? (
                <div className="offer-owner-note">
                  <p>Esta é a sua oferta.</p>
                  <Link to="/painel?tab=ofertas" className="btn btn--secondary btn--block">
                    Gerir oferta
                  </Link>
                </div>
              ) : existing ? (
                <div className="offer-owner-note">
                  <p>Já enviou um pedido para esta oferta.</p>
                  <StatusBadge status={existing.status} />
                  <Link to="/painel" className="btn btn--secondary btn--block">
                    Ver no painel
                  </Link>
                </div>
              ) : wantedByMe ? (
                <div className="offer-owner-note">
                  <p>Esta pessoa quer aprender consigo.</p>
                  <Link to="/painel" className="btn btn--secondary btn--block">
                    Responder ao pedido
                  </Link>
                </div>
              ) : (
                <Link
                  to={`/propor/${offer.id}`}
                  className={`btn btn--primary btn--block${offer.active ? "" : " is-disabled"}`}
                  aria-disabled={!offer.active}
                  onClick={(event) => {
                    if (!offer.active) event.preventDefault();
                  }}
                >
                  Propor uma troca
                  <ArrowRightIcon size={16} />
                </Link>
              )}
              <p className="offer-action-card__note">
                <ShieldCheckIcon size={14} />
                Sem pagamentos. A troca é combinada directamente entre as duas pessoas.
              </p>
              <p className="offer-action-card__note offer-action-card__note--whatsapp">
                <WhatsAppIcon size={14} />
                Depois de aceite, a conversa continua no WhatsApp. Use um nome de utilizador para
                não expor o número.{" "}
                <Link to="/confianca#whatsapp" className="text-link">
                  Saber mais
                </Link>
              </p>
            </div>

            <div className="mini-trust">
              <h3>Porque pode confiar</h3>
              <VerificationBadge level={person.verification} />
              <ul>
                <li>
                  <strong>{ratingLabel(person.rating)}</strong> de 5 em {person.reviewCount}{" "}
                  avaliações
                </li>
                <li>
                  <strong>{person.exchanges}</strong> trocas na comunidade
                </li>
                <li>
                  Responde a <strong>{person.responseRate}%</strong> dos pedidos
                </li>
                <li>Membro desde {person.since}</li>
              </ul>
              <Link to="/confianca" className="text-link">
                Como verificamos
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </aside>
        </div>

        {otherOffers.length > 0 && (
          <section className="section section--related">
            <SectionHeading
              eyebrow={person.name.split(" ")[0]}
              title={`Outros saberes de ${person.name.split(" ")[0]}`}
              description={`Mais formas de trocar com ${person.name.split(" ")[0]}, na mesma província.`}
            />
            <div className="offers-grid">
              {otherOffers.slice(0, 3).map((item) => (
                <SkillCard key={item.id} offer={item} person={person} showInactive />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
