const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalize,
  calculateMatch,
  rankRecipesByMatch,
} = require('./matchingEngine');

// Small helper to build a recipe with a list of ingredient names.
const recipe = (...names) => ({
  ingredients: names.map((name) => ({ name })),
});

test('normalize: lowercases and trims', () => {
  assert.equal(normalize('  Tomato '), 'tomato');
  assert.equal(normalize('OLIVE OIL'), 'olive oil');
});

test('normalize: collapses internal whitespace', () => {
  assert.equal(normalize('cherry   tomatoes'), 'cherry tomatoe');
});

test('normalize: strips a single trailing "s" for plurals', () => {
  assert.equal(normalize('eggs'), 'egg');
  assert.equal(normalize('tomatoes'), 'tomatoe');
});

test('normalize: leaves short words and double-s endings alone', () => {
  assert.equal(normalize('as'), 'as');
  assert.equal(normalize('glass'), 'glass');
});

test('normalize: handles empty / nullish input', () => {
  assert.equal(normalize(''), '');
  assert.equal(normalize(null), '');
  assert.equal(normalize(undefined), '');
});

test('calculateMatch: exact match', () => {
  const r = calculateMatch(['garlic'], recipe('garlic'));
  assert.equal(r.matchedCount, 1);
  assert.equal(r.totalCount, 1);
  assert.equal(r.matchPercentage, 100);
  assert.deepEqual(r.matchedIngredients, ['garlic']);
  assert.deepEqual(r.missingIngredients, []);
});

test('calculateMatch: is case-insensitive', () => {
  const r = calculateMatch(['GARLIC'], recipe('garlic'));
  assert.equal(r.matchedCount, 1);
});

test('calculateMatch: singular fridge item matches plural recipe ingredient', () => {
  const r = calculateMatch(['tomato'], recipe('tomatoes'));
  assert.equal(r.matchedCount, 1);
  assert.equal(r.matchPercentage, 100);
});

test('calculateMatch: substring match in both directions', () => {
  // fridge "tomato" should match recipe "cherry tomatoes"
  const r1 = calculateMatch(['tomato'], recipe('cherry tomatoes'));
  assert.equal(r1.matchedCount, 1);

  // fridge "cherry tomato" should match recipe "tomato"
  const r2 = calculateMatch(['cherry tomato'], recipe('tomato'));
  assert.equal(r2.matchedCount, 1);
});

test('calculateMatch: partial match reports missing ingredients', () => {
  const r = calculateMatch(
    ['tomato', 'garlic'],
    recipe('tomatoes', 'garlic', 'basil', 'olive oil')
  );
  assert.equal(r.matchedCount, 2);
  assert.equal(r.totalCount, 4);
  assert.equal(r.matchPercentage, 50);
  assert.deepEqual(r.matchedIngredients, ['tomatoes', 'garlic']);
  assert.deepEqual(r.missingIngredients, ['basil', 'olive oil']);
});

test('calculateMatch: rounds the percentage', () => {
  // 2 of 3 -> 66.66 -> 67
  const r = calculateMatch(['a', 'b'], recipe('a', 'b', 'c'));
  assert.equal(r.matchPercentage, 67);
});

test('calculateMatch: empty fridge yields 0%', () => {
  const r = calculateMatch([], recipe('a', 'b'));
  assert.equal(r.matchedCount, 0);
  assert.equal(r.matchPercentage, 0);
  assert.deepEqual(r.missingIngredients, ['a', 'b']);
});

test('calculateMatch: recipe with no ingredients yields 0% (no divide-by-zero)', () => {
  const r = calculateMatch(['a'], recipe());
  assert.equal(r.totalCount, 0);
  assert.equal(r.matchPercentage, 0);
});

test('calculateMatch: accepts fridge items as objects with a name field', () => {
  const r = calculateMatch([{ name: 'garlic' }], recipe('garlic'));
  assert.equal(r.matchedCount, 1);
});

test('rankRecipesByMatch: sorts by match percentage descending', () => {
  const recipes = [
    { id: 'low', ingredients: [{ name: 'x' }, { name: 'y' }, { name: 'garlic' }] }, // 33%
    { id: 'high', ingredients: [{ name: 'garlic' }] }, // 100%
  ];
  const ranked = rankRecipesByMatch(['garlic'], recipes);
  assert.deepEqual(
    ranked.map((r) => r.id),
    ['high', 'low']
  );
  assert.equal(ranked[0].match.matchPercentage, 100);
});

test('rankRecipesByMatch: breaks ties by matched count', () => {
  // Both recipes are 100% matches, but "more" has more matched ingredients.
  const recipes = [
    { id: 'fewer', ingredients: [{ name: 'garlic' }] },
    { id: 'more', ingredients: [{ name: 'garlic' }, { name: 'onion' }] },
  ];
  const ranked = rankRecipesByMatch(['garlic', 'onion'], recipes);
  assert.deepEqual(
    ranked.map((r) => r.id),
    ['more', 'fewer']
  );
});

test('rankRecipesByMatch: attaches a match object to each recipe', () => {
  const ranked = rankRecipesByMatch(['garlic'], [recipe('garlic', 'onion')]);
  assert.ok(ranked[0].match);
  assert.equal(ranked[0].match.totalCount, 2);
  assert.equal(ranked[0].match.matchedCount, 1);
});

test('rankRecipesByMatch: handles an empty recipe array', () => {
  assert.deepEqual(rankRecipesByMatch(['garlic'], []), []);
});
