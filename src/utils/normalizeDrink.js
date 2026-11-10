export function normalizeDrink(raw) {
  if (!raw) return null

  const ingredients = []
  for (let i = 1; i <= 15; i++) {
    const name = raw[`strIngredient${i}`]
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: (raw[`strMeasure${i}`] || '').trim(),
      })
    }
  }

  return {
    id: raw.idDrink,
    name: raw.strDrink,
    image: raw.strDrinkThumb,
    category: raw.strCategory ?? null,
    glass: raw.strGlass ?? null,
    instructions: raw.strInstructions ?? null,
    isAlcoholic: raw.strAlcoholic
      ? raw.strAlcoholic.toLowerCase() !== 'non alcoholic'
      : null,
    ingredients,
    hasDetails: Boolean(raw.strInstructions || ingredients.length),
  }
}

export function normalizeList(data) {
  return Array.isArray(data?.drinks) ? data.drinks.map(normalizeDrink) : []
}