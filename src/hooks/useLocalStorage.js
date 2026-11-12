import { useCallback, useState } from "react";

export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) : initialValue }
        catch { return initialValue }
    });
    const update = useCallback((next) => {
        setValue((current) => {
            const resolved = typeof next === "function" ? next(current) : next;
            try { localStorage.setItem(key, JSON.stringify(resolved)) } catch { /* Storage can be unavailable in private browsing. */ }
            return resolved;
        })
    }, [key]);
    return [value, update];
}