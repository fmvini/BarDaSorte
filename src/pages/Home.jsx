import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchByName, getRandom } from "../services/cocktailService.js";
import { DrinkGrid } from "../components/drinks/DrinkGrid.jsx";
import { DrinkCarousel } from "../components/drinks/DrinkCarousel.jsx";
import { Icon } from "../components/Icons.jsx";
import { EmptyState } from "../components/ui/EmptyState/EmptyState.jsx";
import { Loader } from "../components/ui/Loader/Loader.jsx";
import { ErrorMessage } from "../components/ui/ErrorMessage/ErrorMessage.jsx";
import { usePantry } from "../hooks/usePantry.js";

const categories = ["Margarita", "Mojito", "Negroni", "Sem álcool"];
export default function Home() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [randomBusy, setRandomBusy] = useState(false);
  const navigate = useNavigate();
  const { ingredients } = usePantry();
  const load = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const categories = ["margarita", "mojito", "negroni", "daiquiri", "martini"];
      const results = await Promise.all(
        categories.map((category) => searchByName(category, { signal })),
      );
      const uniqueDrinks = [
        ...new Map(
          results
            .flat()
            .map((drink) => [drink.id, drink]),
        ).values(),
      ];
      setDrinks(uniqueDrinks);
    } catch (reason) {
      if (reason.name !== "AbortError") setError(reason.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => load(controller.signal), 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [load]);
  const surprise = async () => {
    setRandomBusy(true);
    try {
      const drink = await getRandom();
      if (drink) navigate(`/drink/${drink.id}`);
    } catch (reason) {
      setError(reason.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setRandomBusy(false);
    }
  };
  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-overline">
            <span /> BOAS HISTÓRIAS PEDEM UM BOM DRINK
          </div>
          <h1>
            Descubra seu 
            <br /> próximo 
            <em> drink.</em>
          </h1>
          <p>
            Encontre o drink certo para a noite com o que você já tem à mão.
          </p>
          <div className="hero-actions">
            <Link className="button button-gold" to="/despensa">
              Abrir minha despensa <Icon name="arrow" size={17} />
            </Link>
            <button
              className="hero-surprise"
              onClick={surprise}
              disabled={randomBusy}
            >
              <Icon name="spark" size={17} />{" "}
              {randomBusy ? "Sorteando…" : "Me surpreenda"}
            </button>
          </div>
          <div className="hero-footnote">
            <span className="footnote-line" /> Ingredientes à mão,
            possibilidades sem fim.
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <DrinkCarousel drinks={drinks} />
          <span className="hero-stamp">
            FEITO
            <br />
            NO SEU
            <br />
            RITMO
          </span>
          <span className="hero-glint">✳</span>
        </div>
        <div className="hero-number">
          <Icon name="spark" size={17} />
        </div>
      </section>
      {error && <ErrorMessage message={error} onRetry={() => load()} />}
      <section className="home-intro-row">
        <div>
          <span className="section-index">01 — EXPLORE</span>
          <h2>
            Uma boa escolha
            <br />
            muda a noite.
          </h2>
        </div>
        <p>
          Descubra receitas clássicas, encontre combinações inesperadas e salve
          as que merecem voltar.
        </p>
      </section>
      <section className="category-row" aria-label="Explorar receitas">
        {categories.map((category, index) => (
          <Link
            key={category}
            className="category-link"
            to={
              category === "Sem álcool"
                ? "/buscar?semAlcool=1"
                : `/buscar?q=${encodeURIComponent(category)}`
            }
          >
            <span className={`category-dot dot-${index}`} />
            {category}
            <Icon name="arrow" size={15} />
          </Link>
        ))}
      </section>
      <section className="section-block feature-section">
        <div className="section-heading">
          <div>
            <span className="section-index">02 — UMA PRIMEIRA DOSE</span>
            <h2>Comece pelos clássicos.</h2>
          </div>
          <Link className="text-link" to="/buscar?q=margarita">
            Ver resultados <Icon name="arrow" size={16} />
          </Link>
        </div>
        {loading ? (
          <Loader label="Buscando receitas para você" />
        ) : drinks.length ? (
          <DrinkGrid drinks={drinks.slice(0, 4)} />
        ) : (
          !error && (
            <EmptyState
              title="Nenhum drink por aqui"
              action={
                <button
                  className="button button-outline"
                  onClick={() => load()}
                >
                  Tentar novamente
                </button>
              }
            >
              Faça uma nova busca e descubra outra combinação.
            </EmptyState>
          )
        )}
      </section>
      <section className="pantry-callout">
        <div className="callout-icon">
          <Icon name="pantry" size={27} />
        </div>
        <div>
          <span className="section-index">
            A MELHOR RECEITA É A QUE VOCÊ JÁ PODE FAZER
          </span>
          <h2>O que tem na sua prateleira?</h2>
          <p>
            {ingredients.length
              ? `${ingredients.length} ingrediente${ingredients.length > 1 ? "s" : ""} na sua despensa. Veja o que já dá para preparar.`
              : "Monte sua despensa e encontre drinks com o que já tem em casa."}
          </p>
        </div>
        <Link className="button button-wine" to="/despensa">
          {ingredients.length
            ? "Ver minhas sugestões"
            : "Montar minha despensa"}{" "}
          <Icon name="arrow" size={17} />
        </Link>
      </section>
    </div>
  );
}
