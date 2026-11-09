import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, CloseIcon } from "./Icons";

const DISMISS_KEY = "percebera.announcement.dismissed";

export function AnnouncementBar() {
  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (hidden) return null;

  return (
    <div className="announcement">
      <div className="container announcement__inner">
        <p>
          <span className="announcement__dot" aria-hidden="true" />
          Lançamento oficial em preparação
          <span className="announcement__sep" aria-hidden="true">
            /
          </span>
          <Link to="/lista-de-espera">
            Entre na lista de espera
            <ArrowRightIcon size={13} />
          </Link>
        </p>
        <button
          type="button"
          aria-label="Fechar aviso de lançamento"
          onClick={() => {
            setHidden(true);
            try {
              localStorage.setItem(DISMISS_KEY, "1");
            } catch {
              // Ignore storage failures.
            }
          }}
        >
          <CloseIcon size={14} />
        </button>
      </div>
    </div>
  );
}
