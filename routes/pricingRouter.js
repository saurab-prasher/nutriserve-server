const express = require("express");
const Pricing = require("../models/pricingPlan"); // Update the path to where your model is located
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pricingPlans = await Pricing.find();
    console.log(pricingPlans);
    res.json(pricingPlans);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
