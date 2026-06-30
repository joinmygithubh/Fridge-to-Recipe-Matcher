const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String, trim: true, default: '' },
    unit: { type: String, trim: true, default: '' },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const shoppingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
  },
  items: {
    type: [shoppingItemSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
