import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Icon } from "../Icons.jsx";
import { useFavorites } from "../../hooks/useFavorites.js";
import { usePantry } from "../../hooks/usePantry.js";
import { useTheme } from "../../hooks/useTheme.js";

function Brand() {
  return (
    <NavLink className="brand" to="/" aria-label="Bar da Sorte, início">
      <img className="brand-mark" src="/favicon.svg" alt="" />
      <span>
        Bar da <b>Sorte</b>
        <small>Qual seu proximo drink?</small>
      </span>
    </NavLink>
  );
}
const links = [
  { to: "/", label: "Início", icon: "home", end: true },
  { to: "/despensa", label: "Minha despensa", icon: "pantry" },
  { to: "/favoritos", label: "Favoritos", icon: "heart" },
];
function NavItems({ onNavigate }) {
  const { favorites } = useFavorites();
  const { ingredients } = usePantry();
  return links.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
      <span className="nav-count">
        {item.to === "/despensa"
          ? ingredients.length || ""
          : item.to === "/favoritos"
            ? favorites.length || ""
            : ""}
      </span>
    </NavLink>
  ));
}
export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const submitSearch = (event) => {
    event.preventDefault();
    if (query.trim()) navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar${menuOpen ? " sidebar-open" : ""}`}>
        <Brand />
        <div className="side-label">SEU ESPAÇO</div>
        <nav className="side-nav" aria-label="Navegação principal">
          <NavItems onNavigate={() => setMenuOpen(false)} />
        </nav>
        <div className="side-bottom">
          <div className="side-rule" />
          <p>
            Uma boa noite começa
            <br />
            com a escolha certa.
          </p>
          <span>EST. 2026 - Vinícius F. Marrocos</span>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="menu-scrim"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-button menu-toggle"
            aria-label="Abrir navegação"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
          <form className="top-search" role="search" onSubmit={submitSearch}>
            <Icon name="search" size={18} />
            <input
              aria-label="Buscar um drink"
              placeholder="Qual drink você procura?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd>↵</kbd>
          </form>
          <button
            className="theme-toggle"
            type="button"
            aria-label={
              theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
            }
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            <span>{theme === "dark" ? "Modo claro" : "Modo escuro"}</span>
          </button>
          <div className="topbar-note">
            <span className="live-dot" /> Seu próximo favorito está por aqui
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
        <footer className="footer">
          <span>BAR DA SORTE</span>
          <span>
            Receitas por{" "}
            <a
              href="https://www.thecocktaildb.com/"
              target="_blank"
              rel="noreferrer"
            >
              TheCocktailDB
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
