import {useCallback, useEffect, useMemo} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { ThemeContext } from "./ThemeContext.jsx";

export function ThemeProvider({children}) {
    const [theme, setTheme] = useLocalStorage('bar-da-sorte:theme', 'light');

    useEffect(() => {
        document.documentElement.dataset.theme = theme }, 
        [theme])

    const toggleTheme = useCallback(() => {
        setTheme((current) => current === 'dark' ? 'light' : 'dark')}, [setTheme]);

    const value = useMemo(() => ({theme, toggleTheme}), [theme, toggleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}