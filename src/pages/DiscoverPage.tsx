import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES, PROVINCES, type CategoryId, type Offer, type Person } from "../data/types";
import { usePageMeta } from "../lib/usePageMeta";
import { useApp } from "../store/AppStore";
import { SkillCard } from "../components/SkillCard";
import { EmptyState } from "../components/Primitives";
import { ArrowRightIcon, CloseIcon, FilterIcon, PlusIcon, SearchIcon } from "../components/Icons";

type SortOption = "relevancia" | "avaliacao" | "recente";

const SORT_LABELS: Record<SortOption, string> = {
  relevancia: "Mais procuradas",
  avaliacao: "Melhor avaliadas",
  recente: "Mais recentes",
};

export function DiscoverPage() {
  usePageMeta(
    "Descobrir saberes",
    "Encontre quem ensina costura, Excel, inglês, carpintaria, agricultura e muito mais em Moçambique. Troque pelo que sabe.",
  );
  const { state, personById } = useApp();
  const [params, setParams] = useSearchParams();

  const queryParam = params.get("q") ?? "";
  const categoryParam = params.get("categoria") ?? "";
  const provinceParam = params.get("provincia") ?? "";
  const rawSort = params.get("ordem");
  const sortParam: SortOption =
    rawSort === "avaliacao" || rawSort === "recente" ? rawSort : "relevancia";

  const [search, setSearch] = useState(queryParam);

  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "todos") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearch("");
    setParams({}, { replace: true });
  };

  const results = useMemo(() => {
    const term = queryParam.trim().toLowerCase();
    let list: { offer: Offer; person: Person }[] = state.offers
      .filter((offer) => offer.active)
      .map((offer) => ({ offer, person: personById(offer.personId) }))
      .filter((item): item is { offer: Offer; person: Person } => Boolean(item.person));

    if (categoryParam) {
      list = list.filter((item) => item.offer.category === (categoryParam as CategoryId));
    }
    if (provinceParam) {
      list = list.filter((item) => item.person.province === provinceParam);
    }
    if (term) {
      list = list.filter((item) => {
        const category = CATEGORIES.find((cat) => cat.id === item.offer.category)?.label ?? "";
        const haystack = [
          item.offer.title,
          item.offer.description,
          item.offer.wants.join(" "),
          item.offer.availability,
          item.offer.languages.join(" "),
          item.person.name,
          item.person.city,
          item.person.province,
          category,
        ]
          .join(" ")
          .toLowerCase();
        return term.split(/\s+/).every((word) => haystack.includes(word));
      });
    }

    if (sortParam === "avaliacao") {
      list = [...list].sort((a, b) => b.person.rating - a.person.rating);
    } else if (sortParam === "recente") {
      list = [...list].sort((a, b) => b.offer.createdAt.localeCompare(a.offer.createdAt));
    } else {
      list = [...list].sort((a, b) => b.offer.popularity - a.offer.popularity);
    }
    return list;
  }, [state.offers, personById, queryParam, categoryParam, provinceParam, sortParam]);

  const activeFilters =
    Boolean(queryParam) || Boolean(categoryParam) || Boolean(provinceParam);

  return (
    <div className="page">
      <section className="page-hero page-hero--discover">
        <div className="container page-hero__grid">
          <div>
            <p className="eyebrow">Descobrir</p>
            <h1 className="display-1 display-1--page">Saberes que procuram pessoas.</h1>
            <p className="page-hero__lead">
              Pesquise por ofício, língua ou província. Cada oferta indica o que a pessoa procura
              em troca e quem está do outro lado.
            </p>
          </div>
          <div className="page-hero__aside">
            <p className="mono-label">Tem algo para ensinar?</p>
            <p>Publique o seu saber e deixe a comunidade encontrar você.</p>
            <Link to="/publicar" className="btn btn--accent">
              <PlusIcon size={16} />
              Publicar oferta
            </Link>
          </div>
        </div>
      </section>

      <section className="discover-section">
        <div className="container">
          <div className="filter-panel">
            <div className="filter-panel__row">
              <div className="search-field">
                <SearchIcon size={18} />
                <label htmlFor="discover-search" className="sr-only">
                  Pesquisar saberes
                </label>
                <input
                  id="discover-search"
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    updateParam("q", event.target.value);
                  }}
                  placeholder="Costura, Excel, inglês, Makhuwa..."
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Limpar pesquisa"
                    onClick={() => {
                      setSearch("");
                      updateParam("q", "");
                    }}
                  >
                    <CloseIcon size={16} />
                  </button>
                )}
              </div>
              <div className="filter-panel__selects">
                <label className="select-field">
                  <span className="sr-only">Província</span>
                  <select
                    value={provinceParam}
                    onChange={(event) => updateParam("provincia", event.target.value)}
                  >
                    <option value="">Todas as províncias</option>
                    {PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="select-field">
                  <span className="sr-only">Ordenar</span>
                  <select
                    value={sortParam}
                    onChange={(event) => updateParam("ordem", event.target.value)}
                  >
                    {Object.entries(SORT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="category-chips" role="group" aria-label="Filtrar por categoria">
              <button
                type="button"
                className={`chip${!categoryParam ? " is-active" : ""}`}
                onClick={() => updateParam("categoria", "")}
              >
                Todas
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`chip${categoryParam === category.id ? " is-active" : ""}`}
                  onClick={() =>
                    updateParam("categoria", categoryParam === category.id ? "" : category.id)
                  }
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="results-bar">
            <p>
              <strong>{results.length}</strong>{" "}
              {results.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
              {provinceParam ? ` em ${provinceParam}` : ""}
            </p>
            <div className="results-bar__right">
              {activeFilters && (
                <button type="button" className="text-button" onClick={clearFilters}>
                  Limpar filtros
                </button>
              )}
              <span className="results-bar__sort">
                <FilterIcon size={14} />
                {SORT_LABELS[sortParam]}
              </span>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="offers-grid offers-grid--discover">
              {results.map(({ offer, person }) => (
                <SkillCard key={offer.id} offer={offer} person={person} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Ainda não há ofertas com estes filtros."
              description="Tente outra província, retire a categoria ou pesquise por uma palavra mais simples."
              icon={<SearchIcon size={26} />}
              action={{ label: "Ver todas as ofertas", to: "/descobrir" }}
            />
          )}

          <div className="discover-cta">
            <div>
              <p className="mono-label">Não encontrou o que procura?</p>
              <h2 className="display-3">Publique o que sabe e atraia a troca certa.</h2>
              <p>
                Uma oferta clara, com o que procura em troca, é a melhor forma de começar. Leva
                menos de dois minutos.
              </p>
            </div>
            <Link to="/publicar" className="btn btn--primary">
              Publicar oferta
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
