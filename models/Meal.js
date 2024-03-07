const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    ingredients: [{ type: String }],
    mealType: { type: String, enum: ["Breakfast", "Lunch", "Dinner", "Snack"] },
    nutritionalValues: {
      calories: Number,
      protein: String,
      carbs: String,
      fat: String,
    },
    imageUrl: { type: String }, // New field for image URL
  },
  { timestamps: true }
);

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
