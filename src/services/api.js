const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1'
const API_KEY = import.meta.env.VITE_COCKTAIL_API_KEY || '1'

const cache = new Map()

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function request(path, { signal, useCache = true } = {}) {
  const url = `${BASE_URL}/${API_KEY}/${path}`

  if (useCache && cache.has(url)) return cache.get(url)

  let response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('Sem conexão com o servidor de drinks.', 0)
  }

  if (!response.ok) {
    throw new ApiError(`Erro ${response.status} ao consultar a API.`, response.status)
  }

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : { drinks: null }
  } catch {
    throw new ApiError('A API devolveu uma resposta inválida.', response.status)
  }

  if (useCache) cache.set(url, data)
  return data
}