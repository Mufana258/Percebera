import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useApp } from "../store/AppStore";
import { useUi } from "../store/UiStore";
import { Logo } from "./Logo";
import { Avatar } from "./Primitives";
import {
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  PlusIcon,
} from "./Icons";

const NAV = [
  { to: "/descobrir", label: "Descobrir" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/confianca", label: "Confiança" },
  { to: "/comunidade", label: "Comunidade" },
];

export function SiteHeader() {
  const { me, signOut, resetDemo } = useApp();
  const { openSignIn, toast } = useUi();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleReset = () => {
    const confirmed = window.confirm(
      "Repor os dados da demonstração? As ofertas, propostas e avaliações criadas neste navegador serão apagadas.",
    );
    if (!confirmed) return;
    resetDemo();
    setAccountOpen(false);
    toast("Dados da demonstração repostos.", "info");
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />
        <nav className="primary-nav" aria-label="Navegação principal">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `primary-nav__link${isActive ? " is-active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link to="/lista-de-espera" className="btn btn--primary btn--sm header-waitlist">
            Lista de espera
          </Link>
          {me ? (
            <div className="account" ref={accountRef}>
              <button
                type="button"
                className="account__trigger"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((prev) => !prev)}
              >
                <Avatar person={me} size="sm" />
                <span className="account__name">{me.name.split(" ")[0]}</span>
                <ChevronDownIcon size={14} />
              </button>
              {accountOpen && (
                <div className="account__menu" role="menu">
                  <div className="account__head">
                    <Avatar person={me} size="md" />
                    <div>
                      <strong>{me.name}</strong>
                      <span>{me.headline}</span>
                    </div>
                  </div>
                  <Link to="/painel" role="menuitem">
                    Painel pessoal
                  </Link>
                  <Link to="/publicar" role="menuitem">
                    Publicar oferta
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setAccountOpen(false);
                      openSignIn();
                    }}
                  >
                    Mudar de conta
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      signOut();
                      setAccountOpen(false);
                      toast("Sessão terminada. Pode continuar a explorar.", "info");
                    }}
                  >
                    Terminar sessão
                  </button>
                  <button type="button" role="menuitem" className="account__reset" onClick={handleReset}>
                    Repor demonstração
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="btn btn--ghost btn--sm" onClick={openSignIn}>
              Entrar
            </button>
          )}
          <button
            type="button"
            className="menu-toggle"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="mobile-nav">
          <div className="container">
            <nav aria-label="Navegação móvel">
              {NAV.map((item) => (
                <NavLink key={item.to} to={item.to} className="mobile-nav__link">
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mobile-nav__actions">
              <Link to="/lista-de-espera" className="btn btn--primary btn--block">
                Entrar na lista de espera
              </Link>
              {me ? (
                <>
                  <Link to="/publicar" className="btn btn--secondary btn--block">
                    <PlusIcon size={16} />
                    Publicar oferta
                  </Link>
                  <Link to="/painel" className="btn btn--ghost btn--block">
                    Abrir painel
                  </Link>
                  <div className="mobile-nav__account">
                    <Avatar person={me} size="sm" />
                    <span>{me.name}</span>
                  </div>
                </>
              ) : (
                <button type="button" className="btn btn--secondary btn--block" onClick={openSignIn}>
                  Entrar na demonstração
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
