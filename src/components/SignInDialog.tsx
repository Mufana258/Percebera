import { useEffect, useRef } from "react";
import { useApp } from "../store/AppStore";
import { Avatar, VerificationBadge } from "./Primitives";
import { ArrowRightIcon, CloseIcon } from "./Icons";

const DEMO_ACCOUNTS = ["p-amina", "p-tomas"];

export function SignInDialog({
  open,
  onClose,
  onSignedIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignedIn: (name: string) => void;
}) {
  const { state, signIn } = useApp();
  const { people } = state;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const accounts = DEMO_ACCOUNTS.map((id) => people.find((person) => person.id === id)).filter(
    (person) => Boolean(person),
  );

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="signin-title">
        <button
          ref={closeRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <CloseIcon size={18} />
        </button>
        <p className="eyebrow">Demonstração interactiva</p>
        <h2 id="signin-title" className="display-3">
          Entrar na Percebera
        </h2>
        <p className="modal__intro">
          Escolha um perfil para testar a plataforma. Não há palavras-passe nesta demonstração e
          nada é enviado para um servidor.
        </p>
        <div className="persona-list">
          {accounts.map((person) =>
            person ? (
              <button
                key={person.id}
                type="button"
                className="persona"
                onClick={() => {
                  signIn(person.id);
                  onSignedIn(person.name);
                }}
              >
                <Avatar person={person} size="md" />
                <span className="persona__body">
                  <span className="persona__name">{person.name}</span>
                  <span className="persona__meta">
                    {person.city} · {person.headline}
                  </span>
                  <span className="persona__bottom">
                    <VerificationBadge level={person.verification} />
                    <span className="persona__exchanges">{person.exchanges} trocas</span>
                  </span>
                </span>
                <ArrowRightIcon size={18} className="persona__arrow" />
              </button>
            ) : null,
          )}
        </div>
        <div className="modal__footer">
          <button type="button" className="text-button" onClick={onClose}>
            Continuar a explorar sem sessão
          </button>
        </div>
      </div>
    </div>
  );
}
