const BASE_URL = "https://www.thecocktaildb.com/api/json/v1";
const API_KEY = import.meta.env.VITE_COCKTAIL_API_KEY || "1";
const cache = new Map();

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request(path, { signal, useCache = true } = {}) {
  const url = `${BASE_URL}/${API_KEY}/${path}`;
  if (useCache && cache.has(url)) return cache.get(url);
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(
      "Não foi possível conectar à TheCocktailDB. Confira sua conexão e tente novamente.",
    );
  }
  if (!response.ok)
    throw new ApiError(
      `A consulta falhou (${response.status}). Tente novamente.`,
      response.status,
    );
  let data;
  try {
    const body = await response.text();
    data = body ? JSON.parse(body) : { drinks: null };
  } catch {
    throw new ApiError(
      "A API devolveu uma resposta inválida. Tente novamente.",
      response.status,
    );
  }
  if (useCache) cache.set(url, data);
  return data;
}
