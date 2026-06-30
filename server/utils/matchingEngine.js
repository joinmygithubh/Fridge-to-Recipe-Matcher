/**
 * Ingredient matching engine.
 *
 * The core value of the app: given the ingredients a user has in their fridge,
 * figure out how much of a recipe they can already make.
 */

/**
 * Normalize an ingredient name for comparison:
 *  - lowercase + trim
 *  - collapse internal whitespace
 *  - simple singular/plural handling (strip a trailing "s")
 */
function normalize(value) {
  if (!value) return '';
  let s = String(value).toLowerCase().trim().replace(/\s+/g, ' ');
  // Strip a single trailing "s" for naive singular/plural matching,
  // but leave very short words alone (e.g. "as").
  if (s.length > 3 && s.endsWith('s') && !s.endsWith('ss')) {
    s = s.slice(0, -1);
  }
  return s;
}

/**
 * Does any fridge ingredient match this recipe ingredient?
 * A match is an exact match OR a substring match in either direction, so that
 * fridge "tomato" matches recipe "cherry tomatoes", and fridge "cherry tomato"
 * matches recipe "tomato".
 */
function ingredientIsAvailable(recipeIngredientName, normalizedFridge) {
  const target = normalize(recipeIngredientName);
  if (!target) return false;

  return normalizedFridge.some((fridgeItem) => {
    if (!fridgeItem) return false;
    return (
      fridgeItem === target ||
      target.includes(fridgeItem) ||
      fridgeItem.includes(target)
    );
  });
}

/**
 * Compute the match between a fridge and a single recipe.
 * @param {Array<string>} fridgeIngredients - array of fridge ingredient names
 * @param {Object} recipe - a recipe document/object with an `ingredients` array
 * @returns {{
 *   matchedCount: number,
 *   totalCount: number,
 *   matchPercentage: number,
 *   matchedIngredients: string[],
 *   missingIngredients: string[]
 * }}
 */
function calculateMatch(fridgeIngredients = [], recipe = {}) {
  const recipeIngredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];

  const normalizedFridge = (fridgeIngredients || [])
    .map((item) => (typeof item === 'string' ? item : item && item.name))
    .map(normalize)
    .filter(Boolean);

  const matchedIngredients = [];
  const missingIngredients = [];

  recipeIngredients.forEach((ing) => {
    const name = typeof ing === 'string' ? ing : ing && ing.name;
    if (!name) return;
    if (ingredientIsAvailable(name, normalizedFridge)) {
      matchedIngredients.push(name);
    } else {
      missingIngredients.push(name);
    }
  });

  const totalCount = recipeIngredients.length;
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

/**
 * Rank a list of recipes by how well they match the fridge.
 * Sorted by matchPercentage descending, with matchedCount as a tiebreaker.
 * Returns plain objects with a `match` field attached to each recipe.
 */
function rankRecipesByMatch(fridgeIngredients = [], recipesArray = []) {
  return (recipesArray || [])
    .map((recipe) => {
      // Support both Mongoose documents and plain objects.
      const plain =
        typeof recipe.toObject === 'function' ? recipe.toObject() : recipe;
      const match = calculateMatch(fridgeIngredients, plain);
      return { ...plain, match };
    })
    .sort((a, b) => {
      if (b.match.matchPercentage !== a.match.matchPercentage) {
        return b.match.matchPercentage - a.match.matchPercentage;
      }
      return b.match.matchedCount - a.match.matchedCount;
    });
}

module.exports = {
  normalize,
  calculateMatch,
  rankRecipesByMatch,
};
