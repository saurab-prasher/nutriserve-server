const express = require("express");
const router = express.Router();
const Meal = require("../models/Meal");

// CREATE a new meal
router.post("/", async (req, res) => {
  try {
    const meal = new Meal(req.body);
    const savedMeal = await meal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(400).json({ error: "Failed to create meal", message: error.message });
  }
});

// READ all meals
router.get("/", async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (error) {
    console.error("Error retrieving meals:", error);
    res.status(500).json({ error: "Failed to retrieve meals", message: error.message });
  }
});

// READ a single meal by ID
router.get("/:id", async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json(meal);
  } catch (error) {
    console.error("Error retrieving meal by ID:", error);
    res.status(500).json({ error: "Failed to retrieve meal", message: error.message });
  }
});

// UPDATE a meal by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedMeal);
  } catch (error) {
    res.status(400).json({ error: "Failed to update meal", message: error.message });
  }
});

// DELETE a meal by ID
router.delete("/:id", async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete meal", message: error.message });
  }
});

module.exports = router;
