const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema({
  numberOfPeople: Number,
  recipesPerWeek: Number,
  pricePerServing: Number,
  discount: Number, // You can decide how to structure discounts
  baseShipping: Number,
});

const Pricing = mongoose.model("Pricing", PricingSchema);

module.exports = Pricing;
