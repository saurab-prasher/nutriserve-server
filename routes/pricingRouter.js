const express = require("express");
const Pricing = require("../models/pricingPlan"); // Update the path to where your model is located
const router = express.Router();

router.get("/pricing", async (req, res) => {
  try {
    // For simplicity, sending all plans. In real app, you might want to filter or manage differently.
    const pricingPlans = await Pricing.find();
    res.json(pricingPlans);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;