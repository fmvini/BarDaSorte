import { useMemo } from "react";
import { FavoritesContext } from "./FavoritesContext.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useLocalStorage("bar-da-sorte:favorites", []);
    const value = useMemo(() => ({
        favorites, isFavorite: (id) => favorites.some((drink) => drink.id === id),
        toggleFavorite: (drink) => setFavorites((current) => current.some((item) => item.id === drink.id)
        ? current.filter((item) => item.id !== drink.id)
        : [...current, drink]),
    }), [favorites, setFavorites]);
    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}