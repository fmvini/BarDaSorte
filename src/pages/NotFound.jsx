import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="not-found">
      <span className="section-index">404 — ESSA MESA NÃO EXISTE</span>
      <h1>
        Perdemos o caminho
        <br />
        até esse drink.
      </h1>
      <p>A página que você procura não está por aqui.</p>
      <Link className="button button-wine" to="/">
        Voltar ao início
      </Link>
    </div>
  );
}
