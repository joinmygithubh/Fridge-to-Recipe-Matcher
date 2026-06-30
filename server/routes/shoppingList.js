const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const ShoppingList = require('../models/ShoppingList');
const Recipe = require('../models/Recipe');
const Fridge = require('../models/Fridge');
const auth = require('../middleware/auth');
const { calculateMatch } = require('../utils/matchingEngine');

const router = express.Router();

router.use(auth);

// POST /api/shopping-list/generate -> build a list from a recipe's missing items
router.post(
  '/generate',
  [body('recipeId').notEmpty().withMessage('recipeId is required')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((e) => e.msg),
      });
    }
    try {
      const { recipeId } = req.body;
      if (!mongoose.isValidObjectId(recipeId)) {
        return res.status(400).json({ error: 'Invalid recipe id.' });
      }

      const recipe = await Recipe.findById(recipeId).lean();
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found.' });
      }

      const fridge = await Fridge.findOne({ userId: req.user._id });
      const fridgeNames = fridge ? fridge.ingredients.map((i) => i.name) : [];

      const { missingIngredients } = calculateMatch(fridgeNames, recipe);

      // Map missing ingredient names back to their full quantity/unit info.
      const items = recipe.ingredients
        .filter((ing) => missingIngredients.includes(ing.name))
        .map((ing) => ({
          name: ing.name,
          quantity: ing.quantity || '',
          unit: ing.unit || '',
          checked: false,
        }));

      const list = await ShoppingList.create({
        userId: req.user._id,
        recipeId: recipe._id,
        items,
      });

      const populated = await list.populate('recipeId', 'title imageUrl');
      res.status(201).json({ shoppingList: populated });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/shopping-list -> all of the user's lists, most recent first
router.get('/', async (req, res, next) => {
  try {
    const lists = await ShoppingList.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('recipeId', 'title imageUrl');
    res.json({ shoppingLists: lists });
  } catch (err) {
    next(err);
  }
});

// PUT /api/shopping-list/:id/item/:itemIndex -> toggle one item's checked state
router.put('/:id/item/:itemIndex', async (req, res, next) => {
  try {
    const { id, itemIndex } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid shopping list id.' });
    }

    const list = await ShoppingList.findOne({
      _id: id,
      userId: req.user._id,
    });
    if (!list) {
      return res.status(404).json({ error: 'Shopping list not found.' });
    }

    const idx = parseInt(itemIndex, 10);
    if (Number.isNaN(idx) || idx < 0 || idx >= list.items.length) {
      return res.status(400).json({ error: 'Invalid item index.' });
    }

    list.items[idx].checked = !list.items[idx].checked;
    await list.save();

    const populated = await list.populate('recipeId', 'title imageUrl');
    res.json({ shoppingList: populated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/shopping-list/:id -> delete a list
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid shopping list id.' });
    }
    const result = await ShoppingList.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!result) {
      return res.status(404).json({ error: 'Shopping list not found.' });
    }
    res.json({ success: true, id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
