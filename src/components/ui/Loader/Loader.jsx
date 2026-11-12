import styles from "./Loader.module.css";
import { Icon } from "../../Icons.jsx";

export default function Loader( { label = "Preparando seu bar..." } ) {
    return (
        <div className={styles.loader} role="status" aria-live="polite">
            <span className={styles.loader__spinner} aria-hidden="true"></span>
            <p className={styles.loader__text}>{label}</p>
            <span className="loader-glass"><Icon name="glass" size={28}/></span>
        </div>
    )
}