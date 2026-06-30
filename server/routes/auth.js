const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Fridge = require('../models/Fridge');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper to surface express-validator errors in a consistent shape.
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => e.msg),
    });
    return false;
  }
  return true;
}

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res, next) => {
    if (!handleValidation(req, res)) return;
    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ error: 'That email is already in use.' });
      }

      const user = await User.create({ name, email, password });

      // Every new user gets an empty fridge.
      await Fridge.create({ userId: user._id, ingredients: [] });

      const token = user.generateAuthToken();
      return res.status(201).json({ user, token });
    } catch (err) {
      return next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    if (!handleValidation(req, res)) return;
    try {
      const { email, password } = req.body;

      // password has select:false, so request it explicitly.
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        '+password'
      );
      if (!user) {
        return res.status(401).json({ error: 'Incorrect email or password.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect email or password.' });
      }

      const token = user.generateAuthToken();
      return res.json({ user, token });
    } catch (err) {
      return next(err);
    }
  }
);

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
