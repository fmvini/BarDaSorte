import {useMemo} from 'react'
import {PantryContext} from './PantryContext.jsx'
import {useLocalStorage} from '../hooks/useLocalStorage.js'

export function PantryProvider({children}) {
    const [ingredients, setIngredients] = useLocalStorage("bar-da-sorte:pantry", []);
    const value = useMemo(() => ({
        ingredients,
        addIngredient: (name) => setIngredients((current) => current.some((item) => item.toLowerCase() === name.toLowerCase()) ? current : [...current, name]),
        removeIngredient: (name) => setIngredients((current) => current.filter((item) => item !== name)),
        clearPantry: () => setIngredients([]),
    }), [ingredients, setIngredients]);
    return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>
}