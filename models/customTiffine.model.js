const mongoose = require('mongoose');

// Schema for meal items
const MealItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Schema for a meal (breakfast, lunch, dinner)
const MealSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  items: {
    type: [MealItemSchema],
    default: [],
  },
});

// Schema for user preferences
const PreferencesSchema = new mongoose.Schema({
  isVeg: {
    type: Boolean,
    default: true,
  },
  spiceLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  includeWeekends: {
    type: Boolean,
    default: true,
  },
});

// Schema for the tiffin plan
const TiffinPlanSchema = new mongoose.Schema({
  duration: {
    type: Number,
    enum: [7, 15, 30],
    required: true,
  },
  meals: {
    breakfast: {
      type: MealSchema,
      required: true,
    },
    lunch: {
      type: MealSchema,
      required: true,
    },
    dinner: {
      type: MealSchema,
      required: true,
    },
  },
  preferences: {
    type: PreferencesSchema,
    required: true,
  },
});

// Create the model
const TiffinPlan = mongoose.model('TiffinPlan', TiffinPlanSchema);

module.exports = TiffinPlan;
