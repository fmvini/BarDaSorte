export function normalizeDrink(raw) {
  if (!raw) return null;
  const ingredients = [];
  for (let index = 1; index <= 15; index += 1) {
    const name = raw[`strIngredient${index}`]?.trim();
    if (name)
      ingredients.push({
        name,
        measure: raw[`strMeasure${index}`]?.trim() || "",
      });
  }
  return {
    id: raw.idDrink,
    name: raw.strDrink || "Drink sem nome",
    image: raw.strDrinkThumb || "",
    category: raw.strCategory || "Cocktail",
    glass: raw.strGlass || "",
    instructions: raw.strInstructions || "",
    isAlcoholic: raw.strAlcoholic
      ? raw.strAlcoholic.toLowerCase() !== "non alcoholic"
      : null,
    ingredients,
    hasDetails: Boolean(raw.strInstructions || ingredients.length),
  };
}

export function normalizeList(data) {
  return Array.isArray(data?.drinks)
    ? data.drinks.map(normalizeDrink).filter(Boolean)
    : [];
}
