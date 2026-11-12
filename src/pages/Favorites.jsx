import { DrinkGrid } from "../components/drinks/DrinkGrid.jsx";
import { EmptyState } from "../components/ui/EmptyState/EmptyState.jsx";
import { useFavorites } from "../hooks/useFavorites.js";
import { Icon } from "../components/Icons.jsx";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favorites } = useFavorites();
  return (
    <div className="inner-page">
      <div className="page-title-row">
        <div>
          <span className="section-index">GUARDADOS PARA OUTRA HORA</span>
          <h1>Seus favoritos.</h1>
          <p>Receitas que merecem voltar para o seu copo.</p>
        </div>
        <span className="page-title-mark">
          <Icon name="heart" size={25} />
        </span>
      </div>
      {favorites.length ? (
        <>
          <div className="results-toolbar">
            <span>
              {favorites.length}{" "}
              {favorites.length === 1 ? "receita salva" : "receitas salvas"}
            </span>
            <Link className="text-link" to="/buscar?q=margarita">
              Descobrir mais <Icon name="arrow" size={16} />
            </Link>
          </div>
          <DrinkGrid drinks={favorites} />
        </>
      ) : (
        <EmptyState title="Ainda não há favoritos.">
          Quando um drink chamar sua atenção, toque no coração para guardá-lo
          aqui.
          <br />
          <br />
          <Link className="button button-outline" to="/buscar?q=margarita">
            Explorar receitas
          </Link>
        </EmptyState>
      )}
    </div>
  );
}
