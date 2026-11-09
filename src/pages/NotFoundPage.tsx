import { Link } from "react-router-dom";
import { usePageMeta } from "../lib/usePageMeta";
import { ArrowRightIcon, SearchIcon, SwapIcon } from "../components/Icons";

export function NotFoundPage() {
  usePageMeta(
    "Página não encontrada",
    "Esta página não existe na Percebera. Volte à descoberta de saberes ou à página inicial.",
  );

  return (
    <div className="page notfound-page">
      <div className="container">
        <div className="notfound">
          <span className="notfound__mark" aria-hidden="true">
            404
          </span>
          <span className="notfound__icon">
            <SwapIcon size={26} />
          </span>
          <p className="eyebrow">Caminho sem saída</p>
          <h1 className="display-1 display-1--page">
            Esta página não faz parte da troca.
          </h1>
          <p className="notfound__lead">
            O endereço pode estar incompleto ou a página pode ter sido movida. O saber continua do
            outro lado.
          </p>
          <div className="notfound__actions">
            <Link to="/descobrir" className="btn btn--primary btn--lg">
              <SearchIcon size={17} />
              Descobrir saberes
            </Link>
            <Link to="/" className="btn btn--secondary btn--lg">
              Voltar ao início
              <ArrowRightIcon size={16} />
            </Link>
          </div>
          <p className="notfound__hint">
            Procura a lista de espera?{" "}
            <Link to="/lista-de-espera" className="text-link">
              Entre na lista de lançamento
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
