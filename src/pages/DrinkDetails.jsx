import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getById, getRandom } from "../services/cocktailService.js";
import { usePantry } from "../hooks/usePantry.js";
import { FavoriteButton } from "../components/drinks/FavoriteButton.jsx";
import { ErrorMessage } from "../components/ui/ErrorMessage/ErrorMessage.jsx";
import { Loader } from "../components/ui/Loader/Loader.jsx";
import { Icon } from "../components/Icons.jsx";

export default function DrinkDetails() {
  const { id } = useParams();
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [surpriseBusy, setSurpriseBusy] = useState(false);
  const { ingredients } = usePantry();
  const navigate = useNavigate();
  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");
      try {
        const result = await getById(id, { signal });
        if (!result)
          setError(
            "Não encontramos essa receita. O link pode estar desatualizado.",
          );
        setDrink(result);
      } catch (reason) {
        if (reason.name !== "AbortError") setError(reason.message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [id],
  );
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => load(controller.signal), 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [load]);
  const surprise = async () => {
    setSurpriseBusy(true);
    try {
      const next = await getRandom();
      if (next) navigate(`/drink/${next.id}`);
    } catch (reason) {
      setError(reason.message);
    } finally {
      setSurpriseBusy(false);
    }
  };
  if (loading) return <Loader label="Preparando a receita" />;
  if (error || !drink)
    return (
      <div className="inner-page">
        <Link className="back-link" to="/">
          <Icon name="arrow" size={16} /> Voltar ao início
        </Link>
        <ErrorMessage
          message={error || "Drink não encontrado."}
          onRetry={() => load()}
        />
      </div>
    );
  const pantry = new Set(ingredients.map((item) => item.toLowerCase()));
  return (
    <div className="inner-page detail-page">
      <Link className="back-link" to="/">
        <Icon name="arrow" size={16} /> De volta à seleção
      </Link>
      <article className="detail-layout">
        <div className="detail-image-frame">
          <span className="photo-fallback">
            <Icon name="glass" size={42} />
          </span>
          <img
            src={drink.image}
            alt={drink.name}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <span className="detail-image-label">UMA RECEITA DO SEU BAR</span>
        </div>
        <div className="detail-copy">
          <div className="detail-topline">
            <span>{drink.category}</span>
            <FavoriteButton drink={drink} large />
          </div>
          <h1>{drink.name}</h1>
          <div className="detail-tags">
            <span>
              {drink.isAlcoholic === false ? "Sem álcool" : "Com álcool"}
            </span>
            {drink.glass && (
              <span>
                <Icon name="glass" size={15} /> {drink.glass}
              </span>
            )}
          </div>
          <div className="detail-rule" />
          <section className="recipe-section">
            <div className="recipe-heading">
              <div>
                <span className="section-index">PARA PREPARAR</span>
                <h2>Ingredientes</h2>
              </div>
              <span>{drink.ingredients.length} itens</span>
            </div>
            <ul className="ingredient-list">
              {drink.ingredients.map((item) => (
                <li
                  key={item.name}
                  className={
                    pantry.has(item.name.toLowerCase()) ? "in-pantry" : ""
                  }
                >
                  <span className="ingredient-bullet">
                    {pantry.has(item.name.toLowerCase()) ? (
                      <Icon name="check" size={14} />
                    ) : (
                      ""
                    )}
                  </span>
                  <span>{item.name}</span>
                  <span className="ingredient-measure">{item.measure}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="recipe-section instructions">
            <span className="section-index">O TOQUE FINAL</span>
            <h2>Modo de preparo</h2>
            <p>
              {drink.instructions ||
                "As instruções não estão disponíveis para esta receita."}
            </p>
          </section>
          <button
            className="button button-outline surprise-again"
            onClick={surprise}
            disabled={surpriseBusy}
          >
            <Icon name="spark" size={17} />{" "}
            {surpriseBusy ? "Sorteando…" : "Me surpreenda com outra"}{" "}
          </button>
        </div>
      </article>
    </div>
  );
}
