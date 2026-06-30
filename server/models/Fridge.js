const mongoose = require('mongoose');

const fridgeIngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const fridgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one fridge per user
  },
  ingredients: {
    type: [fridgeIngredientSchema],
    default: [],
  },
});

module.exports = mongoose.model('Fridge', fridgeSchema);
