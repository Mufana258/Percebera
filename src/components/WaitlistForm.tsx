import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { INTERESTS, type WaitlistEntry } from "../data/types";
import { useApp } from "../store/AppStore";
import { useUi } from "../store/UiStore";
import { entryToPayload, sendWaitlistNotification, WAITLIST_EMAIL, waitlistMailto } from "../lib/waitlist";
import { ArrowRightIcon, CheckCircleIcon, AlertIcon, LinkedInIcon, MailIcon } from "./Icons";

type Status = "idle" | "sending" | "success" | "offline" | "duplicate";

interface FormState {
  name: string;
  email: string;
  linkedin: string;
  interest: string;
  consent: boolean;
  company: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  linkedin: "",
  interest: INTERESTS[0],
  consent: false,
  company: "",
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function normalizeLinkedIn(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase();
    if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function WaitlistForm({
  source,
  compact = false,
  initialInterest,
}: {
  source: string;
  compact?: boolean;
  initialInterest?: string;
}) {
  const { recordWaitlist, markWaitlistDelivered } = useApp();
  const { toast } = useUi();
  const interest =
    initialInterest && INTERESTS.includes(initialInterest) ? initialInterest : INTERESTS[0];
  const [form, setForm] = useState<FormState>(() => ({ ...EMPTY_FORM, interest }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitted, setSubmitted] = useState<WaitlistEntry | null>(null);
  const [activationPending, setActivationPending] = useState(false);

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const reset = () => {
    setForm({ ...EMPTY_FORM, interest });
    setErrors({});
    setStatus("idle");
    setSubmitted(null);
    setActivationPending(false);
  };

  const deliver = async (entry: WaitlistEntry) => {
    try {
      await sendWaitlistNotification(entryToPayload(entry));
      markWaitlistDelivered(entry.id);
      setActivationPending(false);
      setStatus("success");
      toast("Inscrição enviada. Bem-vindo à lista da Percebera.");
    } catch (error) {
      setActivationPending(
        error instanceof Error && /activation/i.test(error.message),
      );
      setStatus("offline");
      toast("Guardámos a inscrição, mas o envio automático falhou.", "error");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.company) {
      setStatus("success");
      return;
    }

    const nextErrors: Record<string, string> = {};
    const email = form.email.trim().toLowerCase();
    const linkedin = normalizeLinkedIn(form.linkedin);

    if (!email) nextErrors.email = "Indique o seu email.";
    else if (!isValidEmail(email)) nextErrors.email = "Escreva um email válido.";
    if (linkedin === null) nextErrors.linkedin = "Use um link linkedin.com/in/perfil.";
    if (!form.consent) nextErrors.consent = "Precisa de concordar para entrar na lista.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = recordWaitlist({
      name: form.name.trim(),
      email,
      linkedin: linkedin ?? "",
      interest: form.interest,
      source,
      consent: true,
    });

    setSubmitted(result.entry);

    if (result.duplicate) {
      if (result.entry.delivered) {
        setStatus("duplicate");
        return;
      }
      setStatus("sending");
      await deliver(result.entry);
      return;
    }

    setStatus("sending");
    await deliver(result.entry);
  };

  if (status === "success" && submitted) {
    return (
      <div className={`waitlist-result${compact ? " waitlist-result--compact" : ""}`}>
        <span className="waitlist-result__icon">
          <CheckCircleIcon size={24} />
        </span>
        <div>
          <h3>Está na lista.</h3>
          <p>
            Vamos escrever para <strong>{submitted.email}</strong> quando o convite de lançamento
            abrir. O piloto começa em Maputo e cresce província a província.
          </p>
          {!compact && (
            <p className="waitlist-result__small">
              Quer ajudar a moldar o piloto? Responda ao primeiro email com a sua história.
            </p>
          )}
          <div className="waitlist-result__actions">
            <Link to="/descobrir" className="btn btn--secondary btn--sm">
              Explorar a demonstração
            </Link>
            <button type="button" className="text-button" onClick={reset}>
              Inscrever outro email
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "duplicate" && submitted) {
    return (
      <div className={`waitlist-result${compact ? " waitlist-result--compact" : ""}`}>
        <span className="waitlist-result__icon waitlist-result__icon--info">
          <MailIcon size={24} />
        </span>
        <div>
          <h3>Este email já está na lista.</h3>
          <p>
            <strong>{submitted.email}</strong> já foi registado neste dispositivo. Não precisa de
            fazer mais nada. Se quiser usar outro email, pode recomeçar.
          </p>
          <div className="waitlist-result__actions">
            <button type="button" className="btn btn--secondary btn--sm" onClick={reset}>
              Usar outro email
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "offline" && submitted) {
    const mailto = waitlistMailto(entryToPayload(submitted));
    return (
      <div className={`waitlist-result waitlist-result--warn${compact ? " waitlist-result--compact" : ""}`}>
        <span className="waitlist-result__icon waitlist-result__icon--warn">
          <AlertIcon size={24} />
        </span>
        <div>
          <h3>Inscrição guardada neste dispositivo.</h3>
          <p>
            {activationPending
              ? "O serviço de email da lista ainda está a ser activado. Envie a inscrição já preenchida para garantir que chega à equipa, ou tente novamente mais tarde."
              : "O envio automático não foi confirmado. Para garantir que a equipa recebe os seus dados, envie o email já preenchido ou tente novamente."}
          </p>
          <div className="waitlist-result__actions">
            <a className="btn btn--primary btn--sm" href={mailto}>
              <MailIcon size={15} />
              Enviar por email
            </a>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                setStatus("sending");
                void deliver(submitted);
              }}
            >
              Tentar novamente
            </button>
          </div>
          <p className="waitlist-result__small">
            Pode escrever directamente para{" "}
            <a href={mailto}>{WAITLIST_EMAIL}</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className={`waitlist-form${compact ? " waitlist-form--compact" : ""}`} onSubmit={handleSubmit} noValidate>
      <div className={compact ? "waitlist-form__compact-grid" : "field-grid"}>
        {!compact && (
          <label className="field">
            <span className="field__label">Nome (opcional)</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Como devemos chamar-lhe?"
              autoComplete="name"
            />
          </label>
        )}
        <label className={`field${errors.email ? " has-error" : ""}`}>
          <span className="field__label">
            <MailIcon size={14} />
            Email
          </span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="nome@exemplo.com"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </label>
        <label className={`field${errors.linkedin ? " has-error" : ""}`}>
          <span className="field__label">
            <LinkedInIcon size={14} />
            LinkedIn (opcional)
          </span>
          <input
            type="text"
            name="linkedin"
            value={form.linkedin}
            onChange={(event) => update("linkedin", event.target.value)}
            placeholder="linkedin.com/in/o-seu-perfil"
            autoComplete="url"
            aria-invalid={Boolean(errors.linkedin)}
          />
          {errors.linkedin && <span className="field__error">{errors.linkedin}</span>}
        </label>
      </div>

      {!compact && (
        <label className="field">
          <span className="field__label">Como quer participar?</span>
          <select value={form.interest} onChange={(event) => update("interest", event.target.value)}>
            {INTERESTS.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="hp-field" aria-hidden="true">
        <label>
          Empresa
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(event) => update("company", event.target.value)}
          />
        </label>
      </div>

      <label className={`checkbox${errors.consent ? " has-error" : ""}`}>
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
        />
        <span>
          Concordo em receber novidades da Percebera sobre o lançamento e o piloto. Posso sair
          quando quiser.
        </span>
      </label>
      {errors.consent && <span className="field__error">{errors.consent}</span>}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
        {status === "sending" ? "A enviar..." : "Entrar na lista"}
        {status !== "sending" && <ArrowRightIcon size={16} />}
      </button>
    </form>
  );
}
