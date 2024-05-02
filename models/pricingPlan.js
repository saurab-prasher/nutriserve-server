const mongoose = require("mongoose");

// Updated Pricing Schema to match the provided structure
const PricingSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
  },
  recipesPerWeek: {
    type: Number,
    required: true,
  },
  pricePerServing: {
    type: Number,
    required: true,
  },
  totalPricePerWeek: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
});

const Pricing = mongoose.model("Pricing", PricingSchema);
exports.PricingSchema = PricingSchema;
exports.Pricing = Pricing;
