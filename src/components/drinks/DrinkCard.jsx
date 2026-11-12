import { Link } from "react-router-dom";
import { FavoriteButton } from "./FavoriteButton.jsx";
import { Icon } from '../Icons.jsx'

export function DrinkCard({ drink }){
    return (
        <article className="drink-card">
        <Link className="drink-image-wrap" 
        to={`/drinks/${drink.id}`}
        aria-label={`Ver receita de ${drink.name}`}>

        <span className="photo-fallback">
            <Icon name="glass" size={32}/>
        </span>
        <img className="drink-image" src={drink.image} alt={drink.name} loading="lazy" onError={(e) => {
            e.currentTarget.style.display = 'none';
        }} />
        <span className="drink-category">{drink.category || "Cocktail"}</span>
        </Link>
        <div className="drink-info">
            <div>
                <Link to={`/drinks/${drink.id}`} className="drink-name">{drink.name}</Link>
                <span className="drink.subtitle">{drink.isAlcoholic === false ? "Sem álcool" : "Uma receita para descobrir"}</span>
            </div>
            <FavoriteButton drink={drink} />
        </div>
        {drink.coverage != null && (
            <div className="match-line">
                <div className="match-track">
                    <span style={{ width: `${drink.coverage}%` }}></span>
                </div>
                <span>{drink.coverage}%</span>
            </div>
        )}
        {drink.missing?.length > 0 && (
            <p className="missing-note">
                Falta: {drink.missing.map((item) => item.name).join(", ")}
            </p>
        )}
        {drink.missing?.length === 0 && drink.coverage != null && (
            <p className="missing-note ready">
                <Icon name="check" size={14} /> Você tem todos os ingredientes!
            </p>
        )}
        </article>
    );
}