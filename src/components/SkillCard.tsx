import { Link } from "react-router-dom";
import { CATEGORIES, type Offer, type Person } from "../data/types";
import { formatLabel } from "../lib/format";
import { useApp } from "../store/AppStore";
import { useUi } from "../store/UiStore";
import { Avatar, RatingBadge } from "./Primitives";
import { ArrowUpRightIcon, BookmarkIcon, ClockIcon, MapPinIcon } from "./Icons";

function shorten(text: string, max = 148): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
}

export function SkillCard({
  offer,
  person,
  showInactive = false,
}: {
  offer: Offer;
  person: Person;
  showInactive?: boolean;
}) {
  const { me, isSaved, toggleSave } = useApp();
  const { openSignIn, toast } = useUi();
  const saved = isSaved(offer.id);
  const category = CATEGORIES.find((item) => item.id === offer.category);

  const handleSave = () => {
    if (!me) {
      toast("Inicie sessão para guardar ofertas.", "info");
      openSignIn();
      return;
    }
    toggleSave(offer.id);
    toast(saved ? "Oferta removida dos guardados." : "Oferta guardada no seu painel.", "info");
  };

  return (
    <article className={`skill-card${offer.active ? "" : " is-inactive"}`}>
      <div className="skill-card__band" aria-hidden="true" />
      <div className="skill-card__top">
        <div className="skill-card__labels">
          <span className="badge badge--muted">{category?.label ?? "Saber"}</span>
          {showInactive && !offer.active && <span className="badge badge--warn">Pausada</span>}
        </div>
        <button
          type="button"
          className={`save-button${saved ? " is-saved" : ""}`}
          onClick={handleSave}
          aria-label={saved ? `Remover ${offer.title} dos guardados` : `Guardar ${offer.title}`}
          aria-pressed={saved}
        >
          <BookmarkIcon size={17} filled={saved} />
        </button>
      </div>

      <Link to={`/oferta/${offer.id}`} className="skill-card__title-link">
        <h3>{offer.title}</h3>
      </Link>
      <p className="skill-card__description">{shorten(offer.description)}</p>

      {offer.wants.length > 0 && (
        <p className="skill-card__wants">
          <span>Procura</span>
          {offer.wants.slice(0, 2).join(" · ")}
        </p>
      )}

      <div className="skill-card__person">
        <Avatar person={person} size="sm" />
        <div className="skill-card__person-text">
          <strong>{person.name}</strong>
          <span>
            <MapPinIcon size={12} />
            {person.city}
          </span>
        </div>
        <RatingBadge value={person.rating} />
      </div>

      <div className="skill-card__footer">
        <span className="badge badge--outline">Troca direta</span>
        <span className="skill-card__format">
          <ClockIcon size={12} />
          {formatLabel(offer.format)} · {offer.duration}
        </span>
        <span className="skill-card__cue">
          Ver oferta
          <ArrowUpRightIcon size={14} />
        </span>
      </div>
    </article>
  );
}
