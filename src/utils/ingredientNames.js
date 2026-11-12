const ingredientNames = [
  {
    apiName: "Lime",
    label: "Limão-taiti",
    aliases: [
      "limão",
      "limão taiti",
      "limão tahiti",
      "limão verde",
      "lima",
      "suco de limão",
      "suco de limão taiti",
      "lime juice",
    ],
  },
  {
    apiName: "Lemon",
    label: "Limão-siciliano",
    aliases: [
      "limão siciliano",
      "suco de limão siciliano",
      "raspas de limão siciliano",
      "lemon juice",
      "lemon zest",
    ],
  },
  {
    apiName: "Mint",
    label: "Hortelã",
    aliases: ["folhas de hortelã", "menta", "mint leaves"],
  },
  {
    apiName: "Sugar",
    label: "Açúcar",
    aliases: ["açúcar refinado", "açúcar branco", "sugar cube", "sugar cubes"],
  },
  {
    apiName: "Brown sugar",
    label: "Açúcar mascavo",
    aliases: ["açúcar mascavo", "açúcar moreno"],
  },
  {
    apiName: "Sugar syrup",
    label: "Xarope de açúcar",
    aliases: ["xarope simples", "calda de açúcar", "simple syrup"],
  },
  { apiName: "Water", label: "Água", aliases: ["água mineral"] },
  {
    apiName: "Ice",
    label: "Gelo",
    aliases: ["gelo em cubos", "cubos de gelo"],
  },
  {
    apiName: "Soda water",
    label: "Água com gás",
    aliases: [
      "água com gás",
      "água gaseificada",
      "club soda",
      "sparkling water",
    ],
  },
  {
    apiName: "Tonic water",
    label: "Água tônica",
    aliases: ["água tônica", "tonic"],
  },
  {
    apiName: "Orange",
    label: "Laranja",
    aliases: ["laranja fresca", "orange peel", "orange zest"],
  },
  {
    apiName: "Orange juice",
    label: "Suco de laranja",
    aliases: ["suco de laranja"],
  },
  { apiName: "Pineapple", label: "Abacaxi", aliases: ["ananás"] },
  {
    apiName: "Pineapple juice",
    label: "Suco de abacaxi",
    aliases: ["suco de abacaxi", "suco de ananás"],
  },
  { apiName: "Strawberry", label: "Morango", aliases: ["morangos"] },
  { apiName: "Raspberry", label: "Framboesa", aliases: ["framboesas"] },
  {
    apiName: "Cranberry juice",
    label: "Suco de cranberry",
    aliases: ["suco de oxicoco", "suco de arando"],
  },
  {
    apiName: "Apple juice",
    label: "Suco de maçã",
    aliases: ["suco de maçã", "suco de maca"],
  },
  {
    apiName: "Coconut milk",
    label: "Leite de coco",
    aliases: ["leite de coco"],
  },
  {
    apiName: "Coconut cream",
    label: "Creme de coco",
    aliases: ["creme de coco"],
  },
  { apiName: "Honey", label: "Mel", aliases: ["mel puro"] },
  { apiName: "Ginger", label: "Gengibre", aliases: ["gengibre fresco"] },
  {
    apiName: "Cinnamon",
    label: "Canela",
    aliases: ["canela em pó", "pau de canela"],
  },
  { apiName: "Basil", label: "Manjericão", aliases: ["folhas de manjericão"] },
  { apiName: "Cucumber", label: "Pepino", aliases: ["pepino fresco"] },
  {
    apiName: "Egg white",
    label: "Clara de ovo",
    aliases: ["clara", "clara de ovo", "egg whites"],
  },
  { apiName: "Salt", label: "Sal", aliases: ["sal fino"] },
  { apiName: "Coffee", label: "Café", aliases: ["café expresso", "cafe"] },
  { apiName: "Milk", label: "Leite", aliases: ["leite integral"] },
  {
    apiName: "Cream",
    label: "Creme de leite",
    aliases: ["creme de leite fresco", "heavy cream", "whipping cream"],
  },
  {
    apiName: "Vanilla extract",
    label: "Extrato de baunilha",
    aliases: ["essência de baunilha", "essencia de baunilha"],
  },
  { apiName: "Chocolate", label: "Chocolate", aliases: ["chocolate amargo"] },
  {
    apiName: "Chocolate syrup",
    label: "Calda de chocolate",
    aliases: ["calda de chocolate"],
  },
  {
    apiName: "Grenadine",
    label: "Xarope de romã",
    aliases: ["xarope de romã", "xarope de groselha"],
  },
  { apiName: "Olive", label: "Azeitona", aliases: ["azeitonas"] },
  {
    apiName: "Cherry",
    label: "Cereja",
    aliases: ["cerejas", "maraschino cherry", "maraschino cherries"],
  },
  { apiName: "Cachaça", label: "Cachaça", aliases: ["cachaca"] },
  { apiName: "Brandy", label: "Conhaque", aliases: ["conhaque"] },
];

export function normalizeIngredientName(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ");
}

function dictionaryEntry(value) {
  const query = normalizeIngredientName(value);
  return ingredientNames.find((item) =>
    [item.apiName, item.label, ...item.aliases].some(
      (name) => normalizeIngredientName(name) === query,
    ),
  );
}

export function toApiIngredient(value, catalog = []) {
  const entry = dictionaryEntry(value);
  if (entry) {
    return (
      catalog.find(
        (name) =>
          normalizeIngredientName(name) ===
          normalizeIngredientName(entry.apiName),
      ) || entry.apiName
    );
  }
  return (
    catalog.find(
      (name) =>
        normalizeIngredientName(name) === normalizeIngredientName(value),
    ) || value.trim()
  );
}

export function getIngredientLabel(value) {
  return dictionaryEntry(value)?.label || value;
}

export function getIngredientMatches(catalog, term, selected = [], limit = 8) {
  const query = normalizeIngredientName(term);
  if (!query) return [];
  const selectedNames = new Set(
    selected.map((name) =>
      normalizeIngredientName(toApiIngredient(name, catalog)),
    ),
  );
  const matches = new Map();
  const add = (apiName, label) => {
    const catalogName =
      catalog.find(
        (name) =>
          normalizeIngredientName(name) === normalizeIngredientName(apiName),
      ) || apiName;
    const canonicalName = toApiIngredient(catalogName, catalog);
    const key = normalizeIngredientName(canonicalName);
    if (!selectedNames.has(key) && !matches.has(key))
      matches.set(key, { value: canonicalName, label });
  };

  ingredientNames.forEach((item) => {
    const searchable = [item.apiName, item.label, ...item.aliases].map(
      normalizeIngredientName,
    );
    if (searchable.some((name) => name.includes(query)))
      add(item.apiName, item.label);
  });
  catalog.forEach((name) => {
    if (normalizeIngredientName(name).includes(query))
      add(name, getIngredientLabel(name));
  });
  return [...matches.values()].slice(0, limit);
}

export function ingredientMatchKey(value) {
  const canonical = toApiIngredient(value);
  return normalizeIngredientName(canonical);
}
