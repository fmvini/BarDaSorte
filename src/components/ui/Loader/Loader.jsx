import styles from "./Loader.module.css";

function Loader( { label = "Preparando seu bar..." } ) {
    return (
        <div className={styles.loader} role="status" aria-live="polite">
            <span className={styles.loader__spinner} aria-hidden="true"></span>
            <p className={styles.loader__text}>{label}</p>
        </div>
    )
}

export { Loader };
export default Loader;