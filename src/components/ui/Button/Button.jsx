export default function Button( variant = "primary", ...rest ) {
    return (
        <button className="button" children={variant} {...rest}>
            {variant === "primary" && "Clique aqui"}
        </button>
    )
}