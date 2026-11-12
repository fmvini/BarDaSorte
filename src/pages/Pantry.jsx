import { useEffect, useMemo, useState } from "react";
import {
  getPantrySuggestions,
  listIngredients,
} from "../services/cocktailService.js";
import { usePantry } from "../hooks/usePantry.js";
import { DrinkCard } from "../components/drinks/DrinkCard.jsx";
import { ErrorMessage } from "../components/ui/ErrorMessage/ErrorMessage.jsx";
import { Loader } from "../components/ui/Loader/Loader.jsx";
import { Icon } from "../components/Icons.jsx";
import {
  getIngredientLabel,
  getIngredientMatches,
  toApiIngredient,
} from "../utils/ingredientNames.js";

export default function Pantry() {
  const { ingredients, addIngredient, removeIngredient, clearPantry } =
    usePantry();
  const [catalog, setCatalog] = useState([]);
  const [term, setTerm] = useState("");
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestionError, setSuggestionError] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    listIngredients({ signal: controller.signal })
      .then(setCatalog)
      .catch((reason) => {
        if (reason.name !== "AbortError") setError(reason.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCatalog(false);
      });
    return () => controller.abort();
  }, []);
  const matches = useMemo(
    () => getIngredientMatches(catalog, term, ingredients),
    [catalog, term, ingredients],
  );
  const add = (name) => {
    addIngredient(toApiIngredient(name, catalog));
    setTerm("");
  };
  const suggest = async () => {
    if (!ingredients.length) return;
    setLoading(true);
    setError("");
    setHasSearched(true);
    try {
      const response = await getPantrySuggestions(ingredients);
      setResults(response.drinks);
      setSuggestionError(response.hadErrors);
    } catch (reason) {
      setError(reason.message);
    } finally {
      setLoading(false);
    }
  };
  const groups = [
    {
      title: "Pode fazer agora",
      sub: "Você tem todos os ingredientes",
      items: results.filter((drink) => drink.missing.length === 0),
    },
    {
      title: "Falta 1 ingrediente",
      sub: "Quase lá — só falta um detalhe",
      items: results.filter((drink) => drink.missing.length === 1),
    },
    {
      title: "Falta mais um pouco",
      sub: "Boas ideias para a próxima ida ao mercado",
      items: results.filter((drink) => drink.missing.length >= 2),
    },
  ];
  return (
    <div className="inner-page pantry-page">
      <div className="page-title-row">
        <div>
          <span className="section-index">DO SEU BAR PARA O SEU COPO</span>
          <h1>Minha despensa.</h1>
          <p>
            Conte o que tem por aí. A próxima receita pode estar mais perto do
            que você imagina.
          </p>
        </div>
        <span className="page-title-mark">
          <Icon name="pantry" size={26} />
        </span>
      </div>
      <section className="pantry-editor">
        <div className="pantry-editor-top">
          <div>
            <h2>O que você tem em casa?</h2>
            <p>Busque ingredientes e adicione à sua lista.</p>
          </div>
          <span className="ingredient-count">
            {ingredients.length}{" "}
            {ingredients.length === 1 ? "ingrediente" : "ingredientes"}
          </span>
        </div>
        <div className="ingredient-input-wrap">
          <Icon name="search" size={18} />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (matches[0]) add(matches[0].value);
                else if (term.trim())
                  add(toApiIngredient(term.trim(), catalog));
              }
            }}
            placeholder="Ex.: gin, limão, hortelã…"
            aria-label="Adicionar ingrediente à despensa"
            aria-autocomplete="list"
            aria-expanded={Boolean(term && matches.length)}
          />
          {term && (
            <button onClick={() => setTerm("")} aria-label="Limpar ingrediente">
              <Icon name="close" size={17} />
            </button>
          )}
          {term && matches.length > 0 && (
            <ul className="ingredient-suggestions" role="listbox">
              {matches.map((item) => (
                <li key={item.value}>
                  <button
                    role="option"
                    aria-selected="false"
                    onClick={() => add(item.value)}
                  >
                    <Icon name="plus" size={16} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {loadingCatalog && (
          <span className="catalog-note">Carregando ingredientes…</span>
        )}
        {error && !hasSearched && (
          <p className="inline-error">
            Não carregamos as sugestões agora. Você ainda pode digitar um
            ingrediente e pressionar Enter.
          </p>
        )}
        {ingredients.length ? (
          <div className="ingredient-chips">
            {ingredients.map((item) => (
              <span className="ingredient-chip" key={item}>
                {getIngredientLabel(item)}
                <button
                  onClick={() => removeIngredient(item)}
                  aria-label={`Remover ${getIngredientLabel(item)}`}
                >
                  <Icon name="close" size={14} />
                </button>
              </span>
            ))}
            <button className="clear-pantry" onClick={clearPantry}>
              Limpar lista
            </button>
          </div>
        ) : (
          <p className="pantry-empty-hint">
            Sua lista está vazia por enquanto.
          </p>
        )}
        <div className="pantry-controls">
          <button
            className="button button-wine"
            disabled={!ingredients.length || loading}
            onClick={suggest}
          >
            <Icon name="spark" size={17} />
            {loading ? "Procurando combinações…" : "Ver o que posso preparar"}
          </button>
        </div>
      </section>
      {error && hasSearched && (
        <ErrorMessage message={error} onRetry={suggest} />
      )}
      {suggestionError && !error && (
        <p className="partial-notice">
          Algumas consultas não responderam; mostramos as combinações que
          conseguimos encontrar.
        </p>
      )}
      {loading && <Loader label="Cruzando sua despensa com as receitas" />}
      {hasSearched &&
        !loading &&
        !error &&
        groups.map((group) => (
          <section className="suggestion-section" key={group.title}>
            <div className="section-heading">
              <div>
                <h2>{group.title}</h2>
                <p>{group.sub}</p>
              </div>
              <span className="group-count">
                {group.items.length.toString().padStart(2, "0")}
              </span>
            </div>
            {group.items.length ? (
              <div className="drink-grid">
                {group.items.map((drink) => (
                  <DrinkCard key={drink.id} drink={drink} />
                ))}
              </div>
            ) : (
              <p className="no-group-results">
                Nenhum drink nesta faixa desta vez.
              </p>
            )}
          </section>
        ))}
      {!hasSearched && (
        <div className="pantry-how">
          <span className="section-index">UM PLANO EM TRÊS PASSOS</span>
          <div>
            <span>01</span>
            <p>
              Adicione o que
              <br />
              tem em casa.
            </p>
          </div>
          <Icon name="arrow" size={18} />
          <div>
            <span>02</span>
            <p>
              Compare com
              <br />
              as receitas.
            </p>
          </div>
          <Icon name="arrow" size={18} />
          <div>
            <span>03</span>
            <p>
              Escolha seu
              <br />
              próximo drink.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
