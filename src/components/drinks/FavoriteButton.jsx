import { Icon } from "../Icons.jsx";
import { useFavorites } from "../../hooks/useFavorites.js";

export function FavoriteButton({ drink, large = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(drink.id);
  return (
    <button
      className={`favorite-button${active ? " favorited" : ""}${large ? " favorite-large" : ""}`}
      aria-label={
        active
          ? `Remover ${drink.name} dos favoritos`
          : `Adicionar ${drink.name} aos favoritos`
      }
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation;
        toggleFavorite(drink);
      }}
    >
      <Icon
        name="heart"
        size={large ? 22 : 18}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}
