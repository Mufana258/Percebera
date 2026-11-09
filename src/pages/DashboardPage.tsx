import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES, type Exchange } from "../data/types";
import { formatDateTime, formatLabel } from "../lib/format";
import { usePageMeta } from "../lib/usePageMeta";
import { useApp } from "../store/AppStore";
import { useUi } from "../store/UiStore";
import { SkillCard } from "../components/SkillCard";
import { WhatsAppConnect } from "../components/WhatsAppConnect";
import {
  Avatar,
  EmptyState,
  StatusBadge,
} from "../components/Primitives";
import {
  AlertIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CheckCircleIcon,
  ClockIcon,
  CloseIcon,
  MapPinIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
  SwapIcon,
  UsersIcon,
  WhatsAppIcon,
} from "../components/Icons";

type DashTab = "atividade" | "ofertas" | "guardados";

const TABS: { id: DashTab; label: string }[] = [
  { id: "atividade", label: "Actividade" },
  { id: "ofertas", label: "As minhas ofertas" },
  { id: "guardados", label: "Guardados" },
];

export function DashboardPage() {
  usePageMeta(
    "Painel pessoal",
    "Acompanhe trocas, ofertas e avaliações na Percebera.",
  );
  const {
    me,
    myOffers,
    myExchanges,
    incoming,
    savedIds,
    offerById,
    personById,
    acceptExchange,
    declineExchange,
    cancelExchange,
    completeExchange,
    addReview,
    toggleOfferActive,
  } = useApp();
  const { openSignIn, toast } = useUi();
  const [params, setParams] = useSearchParams();
  const [reviewExchange, setReviewExchange] = useState<Exchange | null>(null);
  const [whatsappExchange, setWhatsappExchange] = useState<Exchange | null>(null);

  const rawTab = params.get("tab");
  const tab: DashTab = TABS.some((item) => item.id === rawTab) ? (rawTab as DashTab) : "atividade";
  const setTab = (next: DashTab) => {
    const newParams = new URLSearchParams(params);
    newParams.set("tab", next);
    setParams(newParams, { replace: true });
  };

  const received = useMemo(
    () => (me ? myExchanges.filter((exchange) => exchange.toPersonId === me.id) : []),
    [myExchanges, me],
  );
  const sent = useMemo(
    () => (me ? myExchanges.filter((exchange) => exchange.fromPersonId === me.id) : []),
    [myExchanges, me],
  );
  const completed = myExchanges.filter((exchange) => exchange.status === "concluida").length;
  const pending = myExchanges.filter((exchange) => exchange.status === "pendente").length;
  const activeOffers = myOffers.filter((offer) => offer.active).length;
  const savedOffers = savedIds
    .map((id) => offerById(id))
    .filter((offer): offer is NonNullable<typeof offer> => Boolean(offer));

  if (!me) {
    return (
      <div className="page">
        <div className="container">
          <div className="gate-card">
            <span className="gate-card__icon">
              <UsersIcon size={24} />
            </span>
            <p className="eyebrow">Painel pessoal</p>
            <h1 className="display-2">Entre para acompanhar as suas trocas.</h1>
            <p>
              Nesta demonstração, pode entrar com um perfil de exemplo e testar propostas,
              conclusões e avaliações. Tudo fica guardado no seu navegador.
            </p>
            <div className="gate-card__actions">
              <button type="button" className="btn btn--primary" onClick={openSignIn}>
                Entrar na demonstração
                <ArrowRightIcon size={16} />
              </button>
              <Link to="/descobrir" className="btn btn--secondary">
                Explorar sem entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const runAction = (
    result: { ok: boolean; error?: string },
    successMessage: string,
  ) => {
    if (result.ok) toast(successMessage);
    else toast(result.error ?? "Não foi possível concluir a acção.", "error");
  };

  const whatsappPerson = whatsappExchange
    ? personById(
        whatsappExchange.fromPersonId === me.id
          ? whatsappExchange.toPersonId
          : whatsappExchange.fromPersonId,
      )
    : undefined;
  const whatsappOffer = whatsappExchange ? offerById(whatsappExchange.offerId) : undefined;

  const handleComplete = (exchange: Exchange) => {
    if (!window.confirm("Confirmar que a troca foi concluída? As duas pessoas passam a poder avaliar.")) {
      return;
    }
    const result = completeExchange(exchange.id);
    if (result.ok) {
      toast("Troca concluída. Pode avaliar a experiência.");
    } else {
      toast(result.error ?? "Não foi possível concluir a troca.", "error");
    }
  };

  return (
    <div className="page dashboard-page">
      <div className="container">
        <header className="dashboard-head">
          <div>
            <p className="eyebrow">Painel pessoal</p>
            <h1 className="display-1 display-1--page">Olá, {me.name.split(" ")[0]}.</h1>
            <p className="page-hero__lead">
              Acompanhe trocas e ofertas num só lugar. Tudo o que fizer aqui fica neste navegador.
            </p>
          </div>
          <div className="dashboard-head__actions">
            <Link to={`/perfil/${me.id}`} className="btn btn--ghost">
              Ver perfil público
            </Link>
            <Link to="/publicar" className="btn btn--primary">
              <PlusIcon size={16} />
              Publicar oferta
            </Link>
          </div>
        </header>

        <div className="stat-cards">
          <button type="button" className="stat-card" onClick={() => setTab("atividade")}>
            <span className="stat-card__icon">
              <SwapIcon size={19} />
            </span>
            <span className="mono-label">Pedidos em aberto</span>
            <strong>{pending}</strong>
            <span className="stat-card__note">
              {incoming.length} {incoming.length === 1 ? "recebido" : "recebidos"} à espera
            </span>
          </button>
          <button type="button" className="stat-card" onClick={() => setTab("atividade")}>
            <span className="stat-card__icon">
              <CheckCircleIcon size={19} />
            </span>
            <span className="mono-label">Trocas concluídas</span>
            <strong>{completed}</strong>
            <span className="stat-card__note">nesta demonstração</span>
          </button>
          <button type="button" className="stat-card" onClick={() => setTab("ofertas")}>
            <span className="stat-card__icon">
              <PlusIcon size={19} />
            </span>
            <span className="mono-label">Ofertas activas</span>
            <strong>{activeOffers}</strong>
            <span className="stat-card__note">{myOffers.length} publicadas</span>
          </button>
          <button type="button" className="stat-card" onClick={() => setTab("guardados")}>
            <span className="stat-card__icon">
              <BookmarkIcon size={19} />
            </span>
            <span className="mono-label">Ofertas guardadas</span>
            <strong>{savedOffers.length}</strong>
            <span className="stat-card__note">para rever mais tarde</span>
          </button>
        </div>

        <div className="tabs tabs--dashboard" role="tablist" aria-label="Secções do painel">
          {TABS.map((item) => {
            const count =
              item.id === "atividade"
                ? myExchanges.length
                : item.id === "ofertas"
                  ? myOffers.length
                  : savedOffers.length;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={tab === item.id ? "is-active" : ""}
                onClick={() => setTab(item.id)}
              >
                {item.label} <span>{count}</span>
              </button>
            );
          })}
        </div>

        {tab === "atividade" && (
          <div className="tab-panel">
            <div className="dashboard-columns">
              <section>
                <div className="panel-heading">
                  <h2>Pedidos recebidos</h2>
                  <span>{received.length}</span>
                </div>
                {received.length > 0 ? (
                  <div className="exchange-list">
                    {received.map((exchange) => (
                      <ExchangeCard
                        key={exchange.id}
                        exchange={exchange}
                        meId={me.id}
                        incoming
                        onAccept={() => runAction(acceptExchange(exchange.id), "Pedido aceite. Combinem os detalhes da sessão.")}
                        onDecline={() => runAction(declineExchange(exchange.id), "Pedido recusado.")}
                        onComplete={() => handleComplete(exchange)}
                        onReview={() => setReviewExchange(exchange)}
                        onWhatsApp={() => setWhatsappExchange(exchange)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Sem pedidos recebidos."
                    description="Quando alguém quiser aprender consigo, o pedido aparece aqui."
                    icon={<SwapIcon size={24} />}
                    action={{ label: "Ver as minhas ofertas", to: "/painel?tab=ofertas" }}
                  />
                )}
              </section>

              <section>
                <div className="panel-heading">
                  <h2>Pedidos enviados</h2>
                  <span>{sent.length}</span>
                </div>
                {sent.length > 0 ? (
                  <div className="exchange-list">
                    {sent.map((exchange) => (
                      <ExchangeCard
                        key={exchange.id}
                        exchange={exchange}
                        meId={me.id}
                        incoming={false}
                        onCancel={() => runAction(cancelExchange(exchange.id), "Pedido cancelado.")}
                        onComplete={() => handleComplete(exchange)}
                        onReview={() => setReviewExchange(exchange)}
                        onWhatsApp={() => setWhatsappExchange(exchange)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Ainda não enviou pedidos."
                    description="Encontre um saber que quer aprender e proponha uma troca."
                    icon={<SwapIcon size={24} />}
                    action={{ label: "Descobrir saberes", to: "/descobrir" }}
                  />
                )}
              </section>
            </div>

            <div className="dashboard-note">
              <WhatsAppIcon size={18} />
              <p>
                Quando uma troca é aceite, aparece o botão do WhatsApp para combinarem os detalhes.
                Use um nome de utilizador no WhatsApp para não expor o número.{" "}
                <Link to="/confianca#whatsapp" className="text-link">
                  Como proteger o número
                </Link>
              </p>
            </div>
          </div>
        )}

        {tab === "ofertas" && (
          <div className="tab-panel">
            <div className="panel-heading panel-heading--spaced">
              <div>
                <h2>As minhas ofertas</h2>
                <p>Pause uma oferta quando não puder receber novos pedidos.</p>
              </div>
              <Link to="/publicar" className="btn btn--primary btn--sm">
                <PlusIcon size={15} />
                Nova oferta
              </Link>
            </div>
            {myOffers.length > 0 ? (
              <div className="manage-list">
                {myOffers.map((offer) => {
                  const category = CATEGORIES.find((item) => item.id === offer.category);
                  return (
                    <article className={`manage-offer${offer.active ? "" : " is-paused"}`} key={offer.id}>
                      <div className="manage-offer__main">
                        <div className="manage-offer__labels">
                          <span className="badge badge--muted">{category?.label}</span>
                          <span className={`status ${offer.active ? "status--aceite" : "status--cancelada"}`}>
                            {offer.active ? "Activa" : "Pausada"}
                          </span>
                        </div>
                        <h3>{offer.title}</h3>
                        <p>
                          {formatLabel(offer.format)} · {offer.duration} · Troca direta ·{" "}
                          {offer.popularity > 0 ? `${offer.popularity} interessados` : "Ainda sem procura registada"}
                        </p>
                      </div>
                      <div className="manage-offer__actions">
                        <Link to={`/oferta/${offer.id}`} className="btn btn--ghost btn--sm">
                          Ver oferta
                        </Link>
                        <button
                          type="button"
                          className="btn btn--secondary btn--sm"
                          onClick={() => {
                            toggleOfferActive(offer.id);
                            toast(offer.active ? "Oferta pausada." : "Oferta reactivada.", "info");
                          }}
                        >
                          {offer.active ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
                          {offer.active ? "Pausar" : "Reactivar"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="Ainda não publicou nenhuma oferta."
                description="Comece pelo que já sabe fazer e pelo que quer aprender em troca."
                icon={<PlusIcon size={24} />}
                action={{ label: "Publicar oferta", to: "/publicar" }}
              />
            )}
          </div>
        )}

        {tab === "guardados" && (
          <div className="tab-panel">
            {savedOffers.length > 0 ? (
              <div className="offers-grid">
                {savedOffers.map((offer) => {
                  const person = personById(offer.personId);
                  return person ? (
                    <SkillCard key={offer.id} offer={offer} person={person} showInactive />
                  ) : null;
                })}
              </div>
            ) : (
              <EmptyState
                title="Ainda não guardou ofertas."
                description="Use o marcador numa oferta para a rever mais tarde."
                icon={<BookmarkIcon size={24} />}
                action={{ label: "Descobrir saberes", to: "/descobrir" }}
              />
            )}
          </div>
        )}
      </div>

      {reviewExchange && me && (
        <ReviewDialog
          exchange={reviewExchange}
          personName={
            (reviewExchange.fromPersonId === me.id
              ? personById(reviewExchange.toPersonId)?.name
              : personById(reviewExchange.fromPersonId)?.name) ?? "esta pessoa"
          }
          offerTitle={offerById(reviewExchange.offerId)?.title ?? "Troca de saberes"}
          onClose={() => setReviewExchange(null)}
          onSubmit={(rating, text) => {
            const result = addReview(reviewExchange.id, rating, text);
            if (result.ok) {
              toast("Avaliação publicada. Obrigado por ajudar a comunidade.");
              setReviewExchange(null);
            } else {
              toast(result.error ?? "Não foi possível publicar a avaliação.", "error");
            }
          }}
        />
      )}

      {whatsappExchange && whatsappPerson && (
        <WhatsAppConnect
          person={whatsappPerson}
          context={whatsappOffer?.title ?? "troca de saberes"}
          onClose={() => setWhatsappExchange(null)}
        />
      )}
    </div>
  );
}

function ExchangeCard({
  exchange,
  meId,
  incoming,
  onAccept,
  onDecline,
  onCancel,
  onComplete,
  onReview,
  onWhatsApp,
}: {
  exchange: Exchange;
  meId: string;
  incoming: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onReview?: () => void;
  onWhatsApp?: () => void;
}) {
  const { offerById, personById } = useApp();
  const offer = offerById(exchange.offerId);
  const other = personById(incoming ? exchange.fromPersonId : exchange.toPersonId);
  const reviewed = exchange.reviewedBy.includes(meId);

  if (!offer || !other) return null;

  return (
    <article className="exchange-card">
      <div className="exchange-card__head">
        <div className="exchange-card__person">
          <Avatar person={other} size="sm" />
          <div>
            <span className="mono-label">{incoming ? "Pedido recebido" : "Pedido enviado"}</span>
            <strong>{other.name}</strong>
            <span>
              <MapPinIcon size={11} />
              {other.city}
            </span>
          </div>
        </div>
        <StatusBadge status={exchange.status} />
      </div>

      <div className="exchange-card__skills">
        <div>
          <span className="mono-label">Quer aprender</span>
          <strong>{offer.title}</strong>
        </div>
        <span className="exchange-card__arrow">
          <SwapIcon size={17} />
        </span>
        <div>
          <span className="mono-label">{incoming ? "Oferece em troca" : "Ofereceu em troca"}</span>
          <strong>{exchange.offeredSkill ?? "Sem saber indicado"}</strong>
        </div>
      </div>

      <p className="exchange-card__message">“{exchange.message}”</p>

      <div className="exchange-card__meta">
        <span>
          <ClockIcon size={13} />
          {formatDateTime(exchange.createdAt)}
        </span>
        <span>{formatLabel(exchange.format)}</span>
        {exchange.timing && <span>{exchange.timing}</span>}
      </div>

      <div className="exchange-card__actions">
        <Link to={`/oferta/${offer.id}`} className="exchange-card__link">
          Ver oferta
          <ArrowRightIcon size={13} />
        </Link>
        <div className="exchange-card__buttons">
          {incoming && exchange.status === "pendente" && (
            <>
              <button type="button" className="btn btn--primary btn--sm" onClick={onAccept}>
                <CheckCircleIcon size={14} />
                Aceitar
              </button>
              <button type="button" className="btn btn--ghost btn--sm" onClick={onDecline}>
                Recusar
              </button>
            </>
          )}
          {!incoming && exchange.status === "pendente" && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
              Cancelar pedido
            </button>
          )}
          {exchange.status === "aceite" && (
            <button type="button" className="btn btn--primary btn--sm" onClick={onComplete}>
              <CheckCircleIcon size={14} />
              Marcar como concluída
            </button>
          )}
          {exchange.status === "aceite" && onWhatsApp && (
            <button
              type="button"
              className="btn btn--secondary btn--sm exchange-card__whatsapp"
              onClick={onWhatsApp}
            >
              <WhatsAppIcon size={14} />
              WhatsApp
            </button>
          )}
          {exchange.status === "concluida" &&
            (reviewed ? (
              <span className="exchange-card__reviewed">
                <CheckCircleIcon size={14} />
                Avaliada
              </span>
            ) : (
              <button type="button" className="btn btn--secondary btn--sm" onClick={onReview}>
                <StarIcon size={14} />
                Avaliar troca
              </button>
            ))}
        </div>
      </div>
    </article>
  );
}

function ReviewDialog({
  exchange,
  personName,
  offerTitle,
  onClose,
  onSubmit,
}: {
  exchange: Exchange;
  personName: string;
  offerTitle: string;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Fechar">
          <CloseIcon size={18} />
        </button>
        <p className="eyebrow">Avaliar troca</p>
        <h2 id="review-title" className="display-3">
          Como foi com {personName.split(" ")[0]}?
        </h2>
        <p className="modal__intro">
          A sua avaliação fica ligada a <strong>{offerTitle}</strong> e ajuda outras pessoas a
          escolher com confiança.
        </p>
        <div className="rating-input" role="group" aria-label="Nota de 1 a 5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className={value <= rating ? "is-active" : ""}
              aria-label={`${value} ${value === 1 ? "estrela" : "estrelas"}`}
              aria-pressed={value <= rating}
              onClick={() => setRating(value)}
            >
              <StarIcon size={28} fill={value <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
        <label className="field">
          <span className="field__label">A sua experiência</span>
          <textarea
            rows={4}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="O que aprendeu? Como foi a comunicação e a sessão?"
            maxLength={400}
          />
        </label>
        <div className="field-row-between">
          <span className="field-hint">Mínimo 10 caracteres.</span>
          <span className="field-hint">{text.length}/400</span>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled={text.trim().length < 10}
          onClick={() => onSubmit(rating, text)}
        >
          Publicar avaliação
          <ArrowRightIcon size={16} />
        </button>
        <button type="button" className="text-button modal__cancel" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
