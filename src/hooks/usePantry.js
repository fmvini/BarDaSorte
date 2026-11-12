import { useContext } from "react";
import { PantryContext } from "../context/PantryContext.jsx";

export function usePantry() {
    const context = useContext(PantryContext)
    if (!context) throw new Error('usePantry precisa estar dentro de PantryProvider')
    return context
}