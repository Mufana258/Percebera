import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { OfferFormat } from "../data/types";
import { formatLabel } from "../lib/format";
import { usePageMeta } from "../lib/usePageMeta";
import { useApp } from "../store/AppStore";
import { useUi } from "../store/UiStore";
import {
  Avatar,
  RatingBadge,
  StatusBadge,
  VerificationBadge,
} from "../components/Primitives";
import {
  AlertIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SwapIcon,
  WhatsAppIcon,
} from "../components/Icons";

const ALL_FORMATS: OfferFormat[] = ["Online", "Presencial", "Híbrido"];

export function ProposePage() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { state, me, myOffers, personById, propose } = useApp();
  const { openSignIn, toast } = useUi();

  const offer = offerId ? state.offers.find((item) => item.id === offerId) : undefined;
  const person = offer ? personById(offer.personId) : undefined;

  const [offeredOfferId, setOfferedOfferId] = useState(() => {
    const first = state.offers.find(
      (item) => item.personId === state.accountId && item.active,
    );
    return first?.id ?? "";
  });
  const [message, setMessage] = useState("");
  const [format, setFormat] = useState<OfferFormat>(offer?.format ?? "Online");
  const [timing, setTiming] = useState("");
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  usePageMeta(
    offer ? `Propor troca: ${offer.title}` : "Propor uma troca",
    "Proponha uma troca direta de saberes: ofereça um saber seu e aprenda um novo.",
  );

  const activeMyOffers = useMemo(() => myOffers.filter((item) => item.active), [myOffers]);
  const selectedMyOffer = activeMyOffers.find((item) => item.id === offeredOfferId);
  const allowedFormats = useMemo<OfferFormat[]>(() => {
    if (!offer) return ALL_FORMATS;
    return offer.format === "Híbrido" ? ALL_FORMATS : [offer.format];
  }, [offer]);

  if (!offer || !person) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state empty-state--page">
            <span className="empty-state__icon">
              <AlertIcon size={26} />
            </span>
            <h1 className="display-3">Não encontrámos esta oferta.</h1>
            <p>Volte à descoberta para escolher outra troca activa.</p>
            <Link className="btn btn--primary" to="/descobrir">
              Descobrir saberes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="page">
        <div className="container">
          <div className="gate-card">
            <span className="gate-card__icon">
              <SwapIcon size={24} />
            </span>
            <p className="eyebrow">Propor uma troca</p>
            <h1 className="display-2">Entre para falar com {person.name.split(" ")[0]}.</h1>
            <p>
              Para enviar uma proposta precisa de um perfil. Nesta demonstração pode entrar com um
              dos perfis de exemplo, sem palavra-passe.
            </p>
            <div className="gate-card__actions">
              <button type="button" className="btn btn--primary" onClick={openSignIn}>
                Entrar na demonstração
                <ArrowRightIcon size={16} />
              </button>
              <Link to={`/oferta/${offer.id}`} className="btn btn--secondary">
                Voltar à oferta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (me.id === person.id) {
    return (
      <div className="page">
        <div className="container">
          <div className="gate-card">
            <span className="gate-card__icon">
              <InfoDot />
            </span>
            <p className="eyebrow">Propor uma troca</p>
            <h1 className="display-2">Esta oferta é sua.</h1>
            <p>Pode gerir a oferta, pausá-la ou ver os pedidos recebidos no seu painel.</p>
            <div className="gate-card__actions">
              <Link to="/painel?tab=ofertas" className="btn btn--primary">
                Gerir a minha oferta
              </Link>
              <Link to={`/oferta/${offer.id}`} className="btn btn--secondary">
                Voltar à oferta
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const success = successId ? state.exchanges.find((item) => item.id === successId) : undefined;

  const fillSuggestion = () => {
    const offering = selectedMyOffer
      ? `Posso ensinar ${selectedMyOffer.title.toLowerCase()} em troca.`
      : "Posso ensinar um saber meu em troca.";
    setMessage(
      `Olá ${person.name.split(" ")[0]}, gostaria de aprender ${offer.title.toLowerCase()}. ${offering} Que dia e formato lhe dão mais jeito?`,
    );
    setError("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (message.trim().length < 12) {
      setError("Escreva uma mensagem com pelo menos 12 caracteres para a outra pessoa.");
      return;
    }
    if (!offeredOfferId) {
      setError("Escolha um saber seu para oferecer em troca.");
      return;
    }

    const result = propose({
      offerId: offer.id,
      message,
      offeredOfferId,
      format,
      timing,
    });

    if (!result.ok) {
      setError(result.error ?? "Não foi possível enviar a proposta.");
      return;
    }
    if (result.id) setSuccessId(result.id);
    toast("Proposta enviada.");
  };

  if (success) {
    return (
      <div className="page">
        <div className="container">
          <div className="proposal-success">
            <span className="proposal-success__icon">
              <CheckCircleIcon size={30} />
            </span>
            <p className="eyebrow">Proposta enviada</p>
            <h1 className="display-2">Agora é só esperar por {person.name.split(" ")[0]}.</h1>
            <p className="proposal-success__lead">
              A sua proposta para <strong>{offer.title}</strong> foi registada. Pode acompanhar a
              resposta no painel.
            </p>
            <div className="proposal-success__card">
              <div>
                <span className="mono-label">Estado</span>
                <StatusBadge status={success.status} />
              </div>
              <div>
                <span className="mono-label">Com</span>
                <strong>{person.name}</strong>
              </div>
              <div>
                <span className="mono-label">Formato</span>
                <strong>{formatLabel(success.format)}</strong>
              </div>
              {success.offeredSkill && (
                <div>
                  <span className="mono-label">Ofereceu</span>
                  <strong>{success.offeredSkill}</strong>
                </div>
              )}
            </div>
            <p className="proposal-success__note">
              <ShieldCheckIcon size={15} />
              A troca é combinada directamente entre as duas pessoas. Não há pagamentos na
              plataforma.
            </p>
            <p className="proposal-success__note proposal-success__note--whatsapp">
              <WhatsAppIcon size={15} />
              Quando {person.name.split(" ")[0]} aceitar, pode abrir a conversa no WhatsApp a partir
              do painel. Recomendamos um nome de utilizador para não expor o número.
            </p>
            <div className="proposal-success__actions">
              <Link to="/painel" className="btn btn--primary">
                Ver no painel
                <ArrowRightIcon size={16} />
              </Link>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setSuccessId(null);
                  setMessage("");
                  navigate(`/oferta/${offer.id}`);
                }}
              >
                Voltar à oferta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Caminho">
          <Link to={`/oferta/${offer.id}`} className="breadcrumb__back">
            <ArrowLeftIcon size={14} />
            {offer.title}
          </Link>
        </nav>

        <div className="propose-head">
          <p className="eyebrow">Propor uma troca</p>
          <h1 className="display-1 display-1--page">Comece pela conversa.</h1>
          <p className="page-hero__lead">
            Diga o que quer aprender, o que pode oferecer e quando lhe dá jeito. {person.name.split(" ")[0]}{" "}
            recebe a proposta no painel.
          </p>
        </div>

        <div className="propose-layout">
          <form className="propose-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="form-section">
              <legend>
                <span>1</span> O que oferece em troca?
              </legend>
              {activeMyOffers.length > 0 ? (
                <div className="offer-choice-list">
                  {activeMyOffers.map((mine) => (
                    <label
                      key={mine.id}
                      className={`offer-choice${offeredOfferId === mine.id ? " is-active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="my-offer"
                        value={mine.id}
                        checked={offeredOfferId === mine.id}
                        onChange={() => setOfferedOfferId(mine.id)}
                      />
                      <span className="offer-choice__body">
                        <strong>{mine.title}</strong>
                        <span>
                          {formatLabel(mine.format)} · {mine.duration}
                        </span>
                      </span>
                      <span className="offer-choice__mark" aria-hidden="true" />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="inline-notice">
                  <AlertIcon size={18} />
                  <div>
                    <strong>Ainda não tem uma oferta activa.</strong>
                    <p>Publique um saber seu para poder propor uma troca direta.</p>
                    <Link to="/publicar" className="text-link">
                      Publicar oferta
                      <ArrowRightIcon size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="form-section">
              <legend>
                <span>2</span> A sua mensagem
              </legend>
              <label className="field">
                <span className="field__label">Para {person.name}</span>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setError("");
                  }}
                  placeholder={`Olá ${person.name.split(" ")[0]}, gostaria de aprender ${offer.title.toLowerCase()}...`}
                  maxLength={600}
                />
              </label>
              <div className="field-row-between">
                <button type="button" className="text-button" onClick={fillSuggestion}>
                  Usar uma mensagem sugerida
                </button>
                <span className="field-hint">{message.length}/600</span>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>
                <span>3</span> Detalhes da sessão
              </legend>
              <div className="field">
                <span className="field__label">Formato</span>
                <div className="segmented">
                  {ALL_FORMATS.map((option) => {
                    const available = allowedFormats.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`segmented__item${format === option ? " is-active" : ""}`}
                        disabled={!available}
                        onClick={() => setFormat(option)}
                        aria-pressed={format === option}
                      >
                        {formatLabel(option)}
                      </button>
                    );
                  })}
                </div>
                <span className="field-hint">
                  {allowedFormats.length === 1
                    ? `Esta oferta acontece em formato ${formatLabel(allowedFormats[0]).toLowerCase()}.`
                    : "Escolha o formato que prefere para esta sessão."}
                </span>
              </div>
              <label className="field">
                <span className="field__label">Quando lhe dá jeito? (opcional)</span>
                <input
                  type="text"
                  value={timing}
                  onChange={(event) => setTiming(event.target.value)}
                  placeholder="Ex: sábado de manhã, depois das 18h"
                />
              </label>
            </fieldset>

            {error && (
              <div className="form-error" role="alert">
                <AlertIcon size={17} />
                {error}
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--lg btn--block">
              Enviar proposta
              <ArrowRightIcon size={17} />
            </button>
            <p className="form-disclaimer">
              <ShieldCheckIcon size={14} />
              A Percebera não cobra dinheiro. Nunca envie códigos M-Pesa ou e-Mola a outra pessoa.
            </p>
          </form>

          <aside className="propose-summary">
            <div className="propose-summary__offer">
              <div className="propose-summary__band" aria-hidden="true" />
              <p className="mono-label">Vai aprender</p>
              <h2>{offer.title}</h2>
              <div className="propose-summary__person">
                <Avatar person={person} size="md" />
                <div>
                  <strong>{person.name}</strong>
                  <span>
                    <MapPinIcon size={12} />
                    {person.city}, {person.province}
                  </span>
                </div>
                <RatingBadge value={person.rating} />
              </div>
              <div className="propose-summary__meta">
                <span>
                  <ClockIcon size={14} />
                  {offer.duration}
                </span>
                <span>{formatLabel(offer.format)}</span>
                <span>{offer.availability}</span>
              </div>
              <VerificationBadge level={person.verification} />
              <span className="badge badge--outline">Troca direta</span>
              {offer.outcomes.length > 0 && (
                <ul className="check-list">
                  {offer.outcomes.map((outcome) => (
                    <li key={outcome}>
                      <CheckCircleIcon size={15} />
                      {outcome}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="propose-summary__steps">
              <h3>O que acontece depois</h3>
              <ol>
                <li>
                  <span>1</span>
                  <p>
                    <strong>{person.name.split(" ")[0]} recebe a proposta.</strong> Pode aceitar,
                    recusar ou pedir outro horário.
                  </p>
                </li>
                <li>
                  <span>2</span>
                  <p>
                    <strong>Combinam os detalhes.</strong> Local, link ou ponto de encontro ficam
                    na conversa.
                  </p>
                </li>
                <li>
                  <span>3</span>
                  <p>
                    <strong>Depois da sessão, avaliam.</strong> A avaliação fica ligada a esta
                    troca.
                  </p>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoDot() {
  return <span className="info-dot">i</span>;
}
