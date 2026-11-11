import styles from "./ErrorMessage.module.css"

export default function ErrorMessage({ message = "Não foi possível carregar os dados.", onRetry }) {
    return (
        <>
            <div className={styles.errorMessage} role="alert">
                <h2 className={styles.errorMessage__title}>
                    Ops! Algo deu errado.
                </h2>
                <p className={styles.errorMessage__description}>
                    {message}
                </p>
            </div>
        </>
    )
    }