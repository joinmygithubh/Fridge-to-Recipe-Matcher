const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String, trim: true, default: '' },
    unit: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  ingredients: {
    type: [ingredientSchema],
    default: [],
  },
  instructions: {
    type: [String],
    default: [],
  },
  cuisine: {
    type: String,
    trim: true,
    default: 'Other',
    index: true,
  },
  dietaryTags: {
    type: [String],
    default: [],
    index: true,
  },
  prepTime: {
    type: Number,
    default: 0,
    min: 0,
  },
  cookTime: {
    type: Number,
    default: 0,
    min: 0,
  },
  servings: {
    type: Number,
    default: 2,
    min: 1,
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
