/**
 * Client-side mirror of the server matching logic.
 * Useful for computing per-ingredient availability on the recipe detail page
 * without an extra round trip, and for any optimistic UI.
 */

export function normalize(value) {
  if (!value) return '';
  let s = String(value).toLowerCase().trim().replace(/\s+/g, ' ');
  if (s.length > 3 && s.endsWith('s') && !s.endsWith('ss')) {
    s = s.slice(0, -1);
  }
  return s;
}

/**
 * Is a single recipe ingredient available given the fridge?
 */
export function isIngredientAvailable(recipeIngredientName, fridgeNames = []) {
  const target = normalize(recipeIngredientName);
  if (!target) return false;
  return fridgeNames
    .map(normalize)
    .filter(Boolean)
    .some(
      (item) =>
        item === target || target.includes(item) || item.includes(target)
    );
}

/**
 * Compute match info for a recipe given fridge ingredient names.
 * Mirrors the server's calculateMatch shape.
 */
export function calculateMatch(fridgeNames = [], recipe = {}) {
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const matchedIngredients = [];
  const missingIngredients = [];

  ingredients.forEach((ing) => {
    const name = typeof ing === 'string' ? ing : ing?.name;
    if (!name) return;
    if (isIngredientAvailable(name, fridgeNames)) {
      matchedIngredients.push(name);
    } else {
      missingIngredients.push(name);
    }
  });

  const totalCount = ingredients.length;
  const matchedCount = matchedIngredients.length;
  const matchPercentage =
    totalCount === 0 ? 0 : Math.round((matchedCount / totalCount) * 100);

  return {
    matchedCount,
    totalCount,
    matchPercentage,
    matchedIngredients,
    missingIngredients,
  };
}
