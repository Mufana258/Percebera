import { useEffect, useRef, useState } from "react";
import type { Person } from "../data/types";
import { useUi } from "../store/UiStore";
import { whatsappHandle, whatsappInvite, whatsappMessage, whatsappShareLink } from "../lib/whatsapp";
import { Avatar } from "./Primitives";
import {
  CheckCircleIcon,
  CloseIcon,
  CopyIcon,
  ShieldCheckIcon,
  WhatsAppIcon,
} from "./Icons";

export function WhatsAppConnect({
  person,
  context,
  onClose,
}: {
  person: Person;
  context: string;
  onClose: () => void;
}) {
  const { toast } = useUi();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [message, setMessage] = useState(() => whatsappMessage(person, context));
  const [copied, setCopied] = useState(false);
  const handle = whatsappHandle(person);
  const shareLink = whatsappShareLink(message);

  useEffect(() => {
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
  }, [onClose]);

  const copyInvite = async () => {
    const text = whatsappInvite(handle, message);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    toast("Convite copiado com o nome de utilizador, sem número.");
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal modal--whatsapp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-title"
      >
        <button
          ref={closeRef}
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Fechar ligação WhatsApp"
        >
          <CloseIcon size={18} />
        </button>

        <div className="whatsapp-dialog__head">
          <span className="whatsapp-dialog__icon">
            <WhatsAppIcon size={27} />
          </span>
          <div>
            <p className="eyebrow">Conversa entre pessoas</p>
            <h2 id="whatsapp-title" className="display-3">
              Continuar no WhatsApp
            </h2>
          </div>
        </div>

        <p className="modal__intro">
          A combinação final acontece fora da plataforma. Abra a conversa com o contacto certo e
          leve o contexto da troca consigo.
        </p>

        <div className="whatsapp-recipient">
          <Avatar person={person} size="md" />
          <div>
            <span className="mono-label">Vai falar com</span>
            <strong>{person.name}</strong>
            <span className="whatsapp-handle">
              <WhatsAppIcon size={13} />@{handle}
            </span>
          </div>
          <span className="badge badge--muted">Demonstração</span>
        </div>

        <div className="privacy-callout">
          <span className="privacy-callout__icon">
            <ShieldCheckIcon size={19} />
          </span>
          <div>
            <strong>Proteja o seu número.</strong>
            <p>
              Recomendamos usar um nome de utilizador no WhatsApp em vez do número. A Percebera não
              publica números nas ofertas nem nos perfis, e a ligação só é partilhada entre as duas
              pessoas depois de uma proposta aceite.
            </p>
          </div>
        </div>

        <details className="whatsapp-steps" open>
          <summary>
            Como mudar o número para um nome de utilizador
            <span aria-hidden="true">+</span>
          </summary>
          <ol>
            <li>
              <span>1</span>
              <p>Abra o WhatsApp e vá a Definições, depois Privacidade.</p>
            </li>
            <li>
              <span>2</span>
              <p>
                Escolha Nome de utilizador e crie um identificador que não revele o seu número. Se a
                opção ainda não existir na sua versão, use um número dedicado ao trabalho.
              </p>
            </li>
            <li>
              <span>3</span>
              <p>
                Partilhe apenas o nome de utilizador. Pode alterá-lo ou removê-lo quando quiser.
              </p>
            </li>
          </ol>
          <p className="whatsapp-steps__note">
            Passos ilustrativos. A disponibilidade e os menus do WhatsApp podem mudar.
          </p>
        </details>

        <label className="field">
          <span className="field__label">Mensagem para enviar</span>
          <textarea
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={500}
          />
        </label>

        <div className="whatsapp-dialog__actions">
          <a
            className="btn btn--whatsapp btn--block"
            href={shareLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={18} />
            Abrir WhatsApp
          </a>
          <button type="button" className="btn btn--secondary btn--block" onClick={copyInvite}>
            {copied ? <CheckCircleIcon size={16} /> : <CopyIcon size={16} />}
            {copied ? "Convite copiado" : "Copiar convite"}
          </button>
        </div>

        <p className="whatsapp-demo-note">
          Nesta demonstração, o botão abre o WhatsApp com a mensagem preenchida e deixa-o escolher o
          contacto. Em produção, abriria a conversa com @{handle}. Nenhum número real é partilhado.
        </p>
      </div>
    </div>
  );
}
