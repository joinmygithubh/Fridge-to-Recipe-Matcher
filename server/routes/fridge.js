const express = require('express');
const { body, validationResult } = require('express-validator');
const Fridge = require('../models/Fridge');
const auth = require('../middleware/auth');

const router = express.Router();

// All fridge routes require authentication.
router.use(auth);

// Find or lazily create the fridge for the current user.
async function getOrCreateFridge(userId) {
  let fridge = await Fridge.findOne({ userId });
  if (!fridge) {
    fridge = await Fridge.create({ userId, ingredients: [] });
  }
  return fridge;
}

// GET /api/fridge -> current user's fridge
router.get('/', async (req, res, next) => {
  try {
    const fridge = await getOrCreateFridge(req.user._id);
    res.json({ fridge });
  } catch (err) {
    next(err);
  }
});

// POST /api/fridge/add -> add an ingredient (case-insensitive dedup, trimmed)
router.post(
  '/add',
  [body('name').trim().notEmpty().withMessage('Ingredient name is required')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((e) => e.msg),
      });
    }
    try {
      const name = req.body.name.trim();
      const fridge = await getOrCreateFridge(req.user._id);

      const exists = fridge.ingredients.some(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      );
      if (!exists) {
        fridge.ingredients.push({ name, addedAt: new Date() });
        await fridge.save();
      }

      res.status(201).json({ fridge });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/fridge/:ingredientName -> remove one ingredient
router.delete('/:ingredientName', async (req, res, next) => {
  try {
    const target = decodeURIComponent(req.params.ingredientName).toLowerCase();
    const fridge = await getOrCreateFridge(req.user._id);

    fridge.ingredients = fridge.ingredients.filter(
      (i) => i.name.toLowerCase() !== target
    );
    await fridge.save();

    res.json({ fridge });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/fridge -> clear the whole fridge
router.delete('/', async (req, res, next) => {
  try {
    const fridge = await getOrCreateFridge(req.user._id);
    fridge.ingredients = [];
    await fridge.save();
    res.json({ fridge });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
