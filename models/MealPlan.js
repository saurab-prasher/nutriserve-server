const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  week: Number,
  year: Number,
  meals: [
    {
      day: String,
      mealType: String, // e.g., "Lunch"
      mealId: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
    },
  ],
});
