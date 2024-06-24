const mongoose = require("mongoose");

const PricingSchema = new mongoose.Schema({
  planName: {
    type: String,
  },
  numberOfPeople: {
    type: Number,
  },
  recipesPerWeek: {
    type: Number,
  },
  pricePerServing: {
    type: Number,
  },
  totalPricePerWeek: {
    type: Number,
  },
  shipping: {
    type: Number,
  },
  description: {
    type: String,
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
