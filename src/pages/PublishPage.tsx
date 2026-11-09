import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CATEGORIES,
  type CategoryId,
  type OfferFormat,
} from "../data/types";
import { formatLabel } from "../lib/format";
import { usePageMeta } from "../lib/usePageMeta";
import { useApp } from "../store/AppStore";
import { useUi } from "../store/UiStore";
import { Avatar, RatingBadge } from "../components/Primitives";
import {
  AlertIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "../components/Icons";

const DURATIONS = ["1h", "1h30", "2h", "3h", "4h"];
const FORMATS: OfferFormat[] = ["Presencial", "Online", "Híbrido"];

export function PublishPage() {
  usePageMeta(
    "Publicar oferta",
    "Publique um saber na Percebera e diga o que procura em troca.",
  );
  const { me, addOffer } = useApp();
  const { openSignIn, toast } = useUi();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryId>("oficios");
  const [description, setDescription] = useState("");
  const [wants, setWants] = useState("");
  const [format, setFormat] = useState<OfferFormat>("Presencial");
  const [duration, setDuration] = useState("1h30");
  const [availability, setAvailability] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!me) {
    return (
      <div className="page">
        <div className="container">
          <div className="gate-card">
            <span className="gate-card__icon">
              <PlusIcon size={24} />
            </span>
            <p className="eyebrow">Publicar oferta</p>
            <h1 className="display-2">Entre para publicar o que sabe.</h1>
            <p>
              Nesta demonstração pode entrar com um perfil de exemplo, publicar uma oferta e vê-la
              aparecer na descoberta.
            </p>
            <div className="gate-card__actions">
              <button type="button" className="btn btn--primary" onClick={openSignIn}>
                Entrar na demonstração
                <ArrowRightIcon size={16} />
              </button>
              <Link to="/descobrir" className="btn btn--secondary">
                Explorar ofertas
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const wantsList = wants
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const categoryLabel = CATEGORIES.find((item) => item.id === category)?.label ?? "Saber";
  const placeholderTitle = title.trim() || "O seu saber aparece aqui";
  const placeholderDescription =
    description.trim() ||
    "Descreva o que vai ensinar, como será a sessão e o que a pessoa leva para casa. Uma descrição concreta atrai a troca certa.";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (title.trim().length < 6) nextErrors.title = "Dê um título com pelo menos 6 caracteres.";
    if (description.trim().length < 40) {
      nextErrors.description = "Descreva a sessão com pelo menos 40 caracteres.";
    }
    if (!availability.trim()) nextErrors.availability = "Indique quando pode dar a sessão.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = addOffer({
      title: title.trim(),
      category,
      description: description.trim(),
      outcomes: [],
      wants: wantsList,
      format,
      duration,
      availability: availability.trim(),
      languages: me.languages,
    });

    if (!result.ok || !result.id) {
      toast(result.error ?? "Não foi possível publicar a oferta.", "error");
      return;
    }
    toast("Oferta publicada. Já está na descoberta.");
    navigate(`/oferta/${result.id}`);
  };

  return (
    <div className="page publish-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Caminho">
          <Link to="/painel?tab=ofertas" className="breadcrumb__back">
            <ArrowLeftIcon size={14} />
            Painel
          </Link>
        </nav>

        <div className="publish-head">
          <p className="eyebrow">Publicar oferta</p>
          <h1 className="display-1 display-1--page">O que sabe fazer bem?</h1>
          <p className="page-hero__lead">
            Escreva como se estivesse a explicar a um vizinho. O que ensina, quanto tempo leva e o
            que procura em troca.
          </p>
        </div>

        <div className="publish-layout">
          <form className="publish-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="form-section">
              <legend>
                <span>1</span> O saber
              </legend>
              <label className={`field${errors.title ? " has-error" : ""}`}>
                <span className="field__label">Título da oferta</span>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="Ex: Reparar bicicletas em casa"
                  maxLength={80}
                  aria-invalid={Boolean(errors.title)}
                />
                {errors.title ? (
                  <span className="field__error">{errors.title}</span>
                ) : (
                  <span className="field__hint">Seja concreto. Evite títulos vagos como “aulas”.</span>
                )}
              </label>
              <div className="field-grid">
                <label className="field">
                  <span className="field__label">Categoria</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value as CategoryId)}
                  >
                    {CATEGORIES.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span className="field__label">Duração da sessão</span>
                  <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                    {DURATIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className={`field${errors.description ? " has-error" : ""}`}>
                <span className="field__label">Descrição</span>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  placeholder="O que vai ensinar? Como será a sessão? O que deve a pessoa trazer?"
                  maxLength={700}
                  aria-invalid={Boolean(errors.description)}
                />
                <div className="field-row-between">
                  {errors.description ? (
                    <span className="field__error">{errors.description}</span>
                  ) : (
                    <span className="field__hint">Mínimo 40 caracteres.</span>
                  )}
                  <span className="field__hint">{description.length}/700</span>
                </div>
              </label>
            </fieldset>

            <fieldset className="form-section">
              <legend>
                <span>2</span> A troca
              </legend>
              <label className="field">
                <span className="field__label">O que procura em troca? (opcional)</span>
                <input
                  type="text"
                  value={wants}
                  onChange={(event) => setWants(event.target.value)}
                  placeholder="Ex: inglês, costura, fotografia"
                />
                <span className="field__hint">Separe por vírgulas. Estes saberes aparecem no perfil.</span>
              </label>
              <div className="inline-info">
                <CheckCircleIcon size={16} />
                <p>
                  Todas as ofertas são trocas diretas. A outra pessoa retribui com um saber próprio.
                </p>
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>
                <span>3</span> Formato e disponibilidade
              </legend>
              <div className="field">
                <span className="field__label">Formato</span>
                <div className="segmented">
                  {FORMATS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`segmented__item${format === option ? " is-active" : ""}`}
                      onClick={() => setFormat(option)}
                      aria-pressed={format === option}
                    >
                      {formatLabel(option)}
                    </button>
                  ))}
                </div>
              </div>
              <label className={`field${errors.availability ? " has-error" : ""}`}>
                <span className="field__label">Quando pode dar a sessão?</span>
                <input
                  type="text"
                  value={availability}
                  onChange={(event) => {
                    setAvailability(event.target.value);
                    setErrors((prev) => ({ ...prev, availability: "" }));
                  }}
                  placeholder="Ex: sábados de manhã, terças depois das 18h"
                  aria-invalid={Boolean(errors.availability)}
                />
                {errors.availability && <span className="field__error">{errors.availability}</span>}
              </label>
              <div className="inline-info">
                <CheckCircleIcon size={16} />
                <p>
                  As línguas do seu perfil serão mostradas: <strong>{me.languages.join(", ")}</strong>.
                </p>
              </div>
            </fieldset>

            <button type="submit" className="btn btn--primary btn--lg btn--block">
              Publicar oferta
              <ArrowRightIcon size={17} />
            </button>
            <p className="form-disclaimer">
              <ShieldCheckIcon size={14} />
              Não publique serviços ilegais ou que exijam uma licença que não tem. A equipa pode
              rever ofertas antes do lançamento.
            </p>
          </form>

          <aside className="publish-preview">
            <div className="stay-sticky">
              <div className="publish-preview__head">
                <p className="mono-label">Pré-visualização</p>
                <span className="badge badge--muted">Rascunho</span>
              </div>
              <article className="preview-card">
                <div className="preview-card__band" aria-hidden="true" />
                <span className="badge badge--muted">{categoryLabel}</span>
                <h3>{placeholderTitle}</h3>
                <p>{placeholderDescription}</p>
                {wantsList.length > 0 && (
                  <p className="preview-card__wants">
                    <span>Procura</span>
                    {wantsList.join(" · ")}
                  </p>
                )}
                <div className="preview-card__person">
                  <Avatar person={me} size="sm" />
                  <div>
                    <strong>{me.name}</strong>
                    <span>
                      <MapPinIcon size={12} />
                      {me.city}, {me.province}
                    </span>
                  </div>
                  <RatingBadge value={me.rating} />
                </div>
                <div className="preview-card__footer">
                  <span className="badge badge--outline">Troca direta</span>
                  <span>
                    <ClockIcon size={12} />
                    {formatLabel(format)} · {duration}
                  </span>
                </div>
              </article>
              <div className="publish-tips">
                <h3>Uma boa oferta</h3>
                <ul>
                  <li>Diz o que a pessoa sai a saber fazer.</li>
                  <li>Mostra que a sessão é possível para quem tem pouco tempo.</li>
                  <li>Indica o que precisa em troca, sem medo de ser específico.</li>
                  <li>Começa pequeno. A primeira sessão pode ser uma hora.</li>
                </ul>
              </div>
              <div className="publish-note">
                <AlertIcon size={17} />
                <p>
                  A oferta fica activa imediatamente nesta demonstração. Pode pausá-la no painel a
                  qualquer momento.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
