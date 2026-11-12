export default function ErrorMessage({ message = "Não foi possível carregar os dados.", onRetry }) {
    return (
        <div className="errorMessage" role="alert">
            <h2 className="errorMessage__title">
                Ops! Algo deu errado.
            </h2>
            <p className="errorMessage__description">
              {message}
            </p>
            {onRetry && (
                <button className="errorMessage__button" onClick={onRetry}>
                    Tentar novamente
                </button>
            )}
        </div>
    )
}