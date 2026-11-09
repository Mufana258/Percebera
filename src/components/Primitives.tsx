import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { ExchangeStatus, OfferFormat, Person, Verification } from "../data/types";
import { VERIFICATION_DESCRIPTIONS, VERIFICATION_LABELS } from "../data/types";
import { formatLabel, ratingLabel } from "../lib/format";
import {
  ArrowRightIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
} from "./Icons";

export function Avatar({
  person,
  size = "md",
  className = "",
}: {
  person: Person;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <span className={`avatar avatar--${person.tone} avatar--${size} ${className}`} aria-hidden="true">
      {person.initials}
    </span>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${ratingLabel(value)} de 5`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <StarIcon
          key={index}
          size={size}
          fill={index <= Math.round(value) ? "currentColor" : "none"}
          strokeWidth={1.5}
          className={index <= Math.round(value) ? "is-filled" : ""}
        />
      ))}
    </span>
  );
}

export function RatingBadge({
  value,
  count,
  className = "",
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <span className={`rating ${className}`} title={`${ratingLabel(value)} de 5`}>
      <StarIcon size={13} fill="currentColor" stroke="none" />
      <strong>{ratingLabel(value)}</strong>
      {typeof count === "number" && <span className="rating__count">({count})</span>}
    </span>
  );
}

export function VerificationBadge({ level }: { level: Verification }) {
  return (
    <span className="verify" title={VERIFICATION_DESCRIPTIONS[level]}>
      <ShieldCheckIcon size={13} />
      {VERIFICATION_LABELS[level]}
    </span>
  );
}

export function FormatBadge({ format }: { format: OfferFormat }) {
  return (
    <span className="badge badge--muted">
      <ClockIcon size={12} />
      {formatLabel(format)}
    </span>
  );
}

export function StatusBadge({ status }: { status: ExchangeStatus }) {
  const labels: Record<ExchangeStatus, string> = {
    pendente: "Pendente",
    aceite: "Aceite",
    concluida: "Concluída",
    recusada: "Recusada",
    cancelada: "Cancelada",
  };
  return <span className={`status status--${status}`}>{labels[status]}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; to: string };
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="display-2">{title}</h2>
        {description && <p className="section-heading__description">{description}</p>}
      </div>
      {action && (
        <Link className="text-link" to={action.to}>
          {action.label}
          <ArrowRightIcon size={16} />
        </Link>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: { label: string; to: string };
  icon?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <Link className="btn btn--secondary btn--sm" to={action.to}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function DataNote({ children }: { children: ReactNode }) {
  return <p className="data-note">{children}</p>;
}
