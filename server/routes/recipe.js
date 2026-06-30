const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const Fridge = require('../models/Fridge');
const auth = require('../middleware/auth');
const { rankRecipesByMatch } = require('../utils/matchingEngine');

const router = express.Router();

// Build a Mongo filter from optional query params shared by several routes.
function buildFilter(query) {
  const filter = {};
  if (query.cuisine) {
    filter.cuisine = query.cuisine;
  }
  if (query.dietaryTags) {
    const tags = Array.isArray(query.dietaryTags)
      ? query.dietaryTags
      : String(query.dietaryTags).split(',').map((t) => t.trim()).filter(Boolean);
    // Match recipes carrying ANY of the selected dietary tags ($in) rather than
    // requiring all of them ($all), so combining filters stays forgiving and
    // doesn't surprise users with empty results.
    if (tags.length) filter.dietaryTags = { $in: tags };
  }
  if (query.maxPrepTime) {
    const max = Number(query.maxPrepTime);
    if (!Number.isNaN(max)) filter.prepTime = { $lte: max };
  }
  return filter;
}

// GET /api/recipe/match -> rank recipes against the user's fridge
router.get('/match', auth, async (req, res, next) => {
  try {
    const fridge = await Fridge.findOne({ userId: req.user._id });
    const fridgeNames = fridge ? fridge.ingredients.map((i) => i.name) : [];

    const filter = buildFilter(req.query);
    const recipes = await Recipe.find(filter).lean();

    const ranked = rankRecipesByMatch(fridgeNames, recipes);
    res.json({
      count: ranked.length,
      fridgeIngredientCount: fridgeNames.length,
      recipes: ranked,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipe/saved -> the current user's saved recipes
router.get('/saved', auth, async (req, res, next) => {
  try {
    await req.user.populate('savedRecipes');
    res.json({ recipes: req.user.savedRecipes });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipe -> public, paginated, filterable browse list
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;

    const filter = buildFilter(req.query);
    const [recipes, total] = await Promise.all([
      Recipe.find(filter).skip(skip).limit(limit).lean(),
      Recipe.countDocuments(filter),
    ]);

    res.json({
      recipes,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/recipe/:id/save -> toggle a recipe in the user's saved list
router.post('/:id/save', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid recipe id.' });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    const user = req.user;
    const index = user.savedRecipes.findIndex((r) => r.toString() === id);
    let saved;
    if (index === -1) {
      user.savedRecipes.push(id);
      saved = true;
    } else {
      user.savedRecipes.splice(index, 1);
      saved = false;
    }
    await user.save();

    res.json({ saved, savedRecipes: user.savedRecipes });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipe/:id -> single recipe (no auth required to view)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid recipe id.' });
    }
    const recipe = await Recipe.findById(id).lean();
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    res.json({ recipe });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
