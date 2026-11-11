import styles from "./Loader.module.css";

export default function Loader( { label = "Carregando..." } ) {
    return (
        <div className={styles.loader} role="status" aria-live="polite">
            <span className={styles.loader__spinner} aria-hidden="true"></span>
            <p className={styles.loader__text}>{label}</p>
        </div>
    )
}