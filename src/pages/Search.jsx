import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getNonAlcoholicDrinks,
  searchByName,
} from "../services/cocktailService.js";
import { DrinkGrid } from "../components/drinks/DrinkGrid.jsx";
import { EmptyState } from "../components/ui/EmptyState/EmptyState.jsx";
import { Loader } from "../components/ui/Loader/Loader.jsx";
import { ErrorMessage } from "../components/ui/ErrorMessage/ErrorMessage.jsx";
import { Icon } from "../components/Icons.jsx";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const onlyNonAlcoholic = params.get("semAlcool") === "1";
  const [draft, setDraft] = useState(query);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const nonAlcoholic = onlyNonAlcoholic;
  useEffect(() => {
    const timer = setTimeout(() => setDraft(query), 0);
    return () => clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (draft.trim() !== query)
        setParams(draft.trim() ? { q: draft.trim() } : {}, { replace: true });
    }, 400);
    return () => clearTimeout(timer);
  }, [draft, query, setParams]);
  useEffect(() => {
    if (!query.trim() && !onlyNonAlcoholic) {
      const timer = setTimeout(() => {
        setDrinks([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      const load = query.trim()
        ? searchByName(query, { signal: controller.signal })
        : getNonAlcoholicDrinks({ signal: controller.signal });
      load
        .then(setDrinks)
        .catch((reason) => {
          if (reason.name !== "AbortError") setError(reason.message);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, onlyNonAlcoholic, retryKey]);
  const visible = drinks.filter(
    (drink) => !nonAlcoholic || drink.isAlcoholic === false,
  );
  const toggleAlcohol = () => {
    const next = !nonAlcoholic;
    const updated = {
      ...(query ? { q: query } : {}),
      ...(next ? { semAlcool: "1" } : {}),
    };
    setParams(updated, { replace: true });
  };
  return (
    <div className="inner-page">
      <div className="page-title-row">
        <div>
          <span className="section-index">SEU PRÓXIMO FAVORITO</span>
          <h1>Encontre seu drink.</h1>
          <p>
            Um clássico, uma nova descoberta ou exatamente o que você tinha em
            mente.
          </p>
        </div>
        <span className="page-title-mark">
          <Icon name="search" size={25} />
        </span>
      </div>
      <form
        className="search-large"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <Icon name="search" />
        <input
          aria-label="Buscar drinks por nome"
          placeholder="Tente Margarita, Mojito, Negroni…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => setDraft("")}
        >
          <Icon name="close" size={18} />
        </button>
      </form>
      <div className="results-toolbar">
        <div>
          {query ? (
            <>
              <span className="result-count">{visible.length}</span>{" "}
              {visible.length === 1
                ? "receita encontrada"
                : "receitas encontradas"}{" "}
              para <b>“{query}”</b>
            </>
          ) : (
            "Explore por nome para encontrar sua próxima receita."
          )}
        </div>
        <button
          className={`filter-chip${nonAlcoholic ? " selected" : ""}`}
          aria-pressed={nonAlcoholic}
          onClick={toggleAlcohol}
        >
          <Icon name="filter" size={16} /> Sem álcool
        </button>
      </div>
      {loading ? (
        <Loader label="Procurando receitas" />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={() => setRetryKey((value) => value + 1)}
        />
      ) : visible.length ? (
        <DrinkGrid drinks={visible} />
      ) : query ? (
        <EmptyState title="Essa receita ainda não apareceu.">
          Tente outro nome ou uma palavra mais curta. A gente continua
          procurando.
        </EmptyState>
      ) : (
        <EmptyState title="Que drink você tem em mente?">
          Busque por nome e deixe o próximo brinde encontrar você.
        </EmptyState>
      )}
    </div>
  );
}
