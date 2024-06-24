const mongoose = require("mongoose");

const { MealSchema } = require("./Meal");
const MealPlanSchema = new mongoose.Schema({
  meals: [MealSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = MealPlanSchema;
