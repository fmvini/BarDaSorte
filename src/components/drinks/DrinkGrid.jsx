import { DrinkCard } from "./DrinkCard.jsx";

export function DrinkGrid({ drinks }) {
    return (
        <div className="drink-grid">
            {drinks.map((drink) => (
                <DrinkCard key={drink.id} drink={drink} />
            ))}
        </div>  
    )
}