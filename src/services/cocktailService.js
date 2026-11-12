import { normalizeDrink, normalizeList } from "../utils/normalizeDrink.js";
import { request } from "./api.js";
import {
  ingredientMatchKey,
  toApiIngredient,
} from "../utils/ingredientNames.js";

export async function searchByName(name, { signal } = {}) {
  const data = await request(`search.php?s=${encodeURIComponent(name)}`, {
    signal,
  });
  return normalizeList(data);
}

export async function getById(id, { signal } = {}) {
  const data = await request(`lookup.php?i=${encodeURIComponent(id)}`, {
    signal,
  });
  return normalizeDrink(data?.drinks?.[0]);
}

export async function getRandom({ signal } = {}) {
  const data = await request("random.php", { signal, useCache: false });
  return normalizeDrink(data?.drinks?.[0]);
}

export async function listIngredients({ signal } = {}) {
  const data = await request("list.php?i=list", { signal });
  return Array.isArray(data?.drinks)
    ? data.drinks.map((item) => item.strIngredient1).filter(Boolean)
    : [];
}

export async function filterByIngredient(ingredient, { signal } = {}) {
  const query = toApiIngredient(ingredient).trim().replaceAll(" ", "_");
  const data = await request(`filter.php?i=${encodeURIComponent(query)}`, {
    signal,
  });
  return normalizeList(data);
}

export async function getNonAlcoholicDrinks({ signal } = {}) {
  const data = await request("filter.php?a=Non_Alcoholic", { signal });
  const ids = normalizeList(data).slice(0, 16);
  const details = await Promise.all(
    ids.map((drink) =>
      getById(drink.id, { signal }).catch((error) => {
        if (error.name === "AbortError") throw error;
        return null;
      }),
    ),
  );
  return details.filter(Boolean);
}

export async function getPantrySuggestions(
  ingredients,
  { nonAlcoholic = false } = {},
) {
  const settled = await Promise.allSettled(
    ingredients.map((name) => filterByIngredient(name)),
  );
  const failures = settled.filter((item) => item.status === "rejected").length;
  const matches = new Map();
  settled.forEach((result) => {
    if (result.status !== "fulfilled") return;
    result.value.forEach((drink) => {
      matches.set(drink.id, (matches.get(drink.id) || 0) + 1);
    });
  });
  const candidates = [...matches.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  const detailed = await Promise.all(
    candidates.map(([id]) => getById(id).catch(() => null)),
  );
  const pantry = new Set(ingredients.map(ingredientMatchKey));
  const basics = new Set(["ice", "water", "gelo", "água", "agua"]);
  const ranked = detailed
    .filter((drink) => drink?.ingredients?.length)
    .map((drink) => {
      const relevant = drink.ingredients.filter(
        (item) => !basics.has(item.name.toLocaleLowerCase()),
      );
      const have = relevant.filter((item) =>
        pantry.has(ingredientMatchKey(item.name)),
      );
      const missing = relevant.filter(
        (item) => !pantry.has(ingredientMatchKey(item.name)),
      );
      return {
        ...drink,
        coverage: relevant.length
          ? Math.round((have.length / relevant.length) * 100)
          : 100,
        missing,
      };
    })
    .filter((drink) => !nonAlcoholic || drink.isAlcoholic === false)
    .sort(
      (a, b) => a.missing.length - b.missing.length || b.coverage - a.coverage,
    );
  return { drinks: ranked, hadErrors: failures > 0 };
}
