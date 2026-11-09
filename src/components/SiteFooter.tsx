import { Link } from "react-router-dom";
import { useApp } from "../store/AppStore";
import { useUi } from "../store/UiStore";
import { Logo } from "./Logo";
import { ArrowRightIcon, GlobeIcon } from "./Icons";

export function SiteFooter() {
  const { me } = useApp();
  const { openSignIn } = useUi();

  return (
    <footer className="site-footer">
      <div className="site-footer__band" aria-hidden="true" />
      <div className="container site-footer__top">
        <div className="site-footer__brand">
          <Logo inverse />
          <p className="site-footer__motto">Ku twisisa: compreender primeiro, trocar depois.</p>
          <p className="site-footer__mission">
            Uma plataforma comunitária para partilhar o que já sabemos e aprender o que
            precisamos, sem dinheiro pelo meio.
          </p>
          <Link className="btn btn--accent btn--sm" to="/lista-de-espera">
            Entrar na lista de lançamento
            <ArrowRightIcon size={15} />
          </Link>
        </div>

        <div className="site-footer__columns">
          <div>
            <h3>Explorar</h3>
            <Link to="/descobrir">Descobrir saberes</Link>
            <Link to="/como-funciona">Como funciona</Link>
            <Link to="/como-funciona#perguntas">Perguntas frequentes</Link>
            <Link to="/confianca">Confiança e segurança</Link>
          </div>
          <div>
            <h3>Comunidade</h3>
            <Link to="/comunidade">Histórias e impacto</Link>
            <Link to="/comunidade#organizacoes">Para organizações</Link>
            <Link to="/lista-de-espera">Lista de espera</Link>
            <Link to="/confianca#acessibilidade">Acessibilidade</Link>
          </div>
          <div>
            <h3>Conta</h3>
            <Link to="/painel">Painel pessoal</Link>
            <Link to="/publicar">Publicar oferta</Link>
            {me ? (
              <Link to="/painel">As minhas trocas</Link>
            ) : (
              <button type="button" className="footer-link-button" onClick={openSignIn}>
                Entrar na demonstração
              </button>
            )}
            <Link to="/lista-de-espera">Falar com a equipa</Link>
          </div>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© 2026 Percebera. Maputo, Moçambique.</p>
        <p className="site-footer__locale">
          <GlobeIcon size={14} />
          Português (Moçambique)
        </p>
        <p className="site-footer__demo">
          Demonstração de produto: perfis, histórias e números são ilustrativos. Ofertas e
          propostas ficam guardadas no seu navegador. As inscrições na lista de espera são
          enviadas para a equipa.
        </p>
      </div>
    </footer>
  );
}
