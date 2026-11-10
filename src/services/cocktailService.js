import { request } from './api'
import { normalizeDrink, normalizeList } from '../utils/normalizeDrink'

export async function searchByName(name, options) {
  const data = await request(`search.php?s=${encodeURIComponent(name.trim())}`, options)
  return normalizeList(data)
}

export async function getById(id, options) {
  const data = await request(`lookup.php?i=${encodeURIComponent(id)}`, options)
  return normalizeDrink(data?.drinks?.[0])
}

export async function getRandom() {
  const data = await request('random.php', { useCache: false })
  return normalizeDrink(data?.drinks?.[0])
}

export async function filterByIngredient(ingredient, options) {
  const key = ingredient.trim().split(' ').join('_')
  const data = await request(`filter.php?i=${encodeURIComponent(key)}`, options)
  return normalizeList(data)
}

export async function filterNonAlcoholic(options) {
  const data = await request('filter.php?a=Non_Alcoholic', options)
  return normalizeList(data)
}

export async function getRandomNonAlcoholic() {
  const list = await filterNonAlcoholic()
  if (list.length === 0) return null
  const pick = list[Math.floor(Math.random() * list.length)]
  return getById(pick.id)
}

export async function listIngredients(options) {
  const data = await request('list.php?i=list', options)
  return Array.isArray(data?.drinks) ? data.drinks.map((d) => d.strIngredient1) : []
}