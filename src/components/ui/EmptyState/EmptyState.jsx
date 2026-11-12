import { Icon } from "../../Icons.jsx";

function EmptyState({ title, children, action }) {
    return (
        <div className="state-panel empty-state">
            <span className="empty-glass">
                <Icon name="glass" size={27}/>
            </span>
            <h2>{title}</h2>
            <p>{children}</p>
            {action}
        </div>
    )
}

export { EmptyState };
export default EmptyState;