const express = require("express");
const router = express.Router();
const Testimonials = require("../models/Testimonials");

router.get("/", async function (req, res) {
  try {
    const testimonials = await Testimonials.find();
    res.json(testimonials);
    // res.send("Success!");
  } catch (error) {
    console.error("Error retrieving meals:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve meals", message: error.message });
  }
});

router.post("/", async function (req, res) {
  try {
    const { author, content, rating } = req.body;
    const testimonial = new Testimonials({ author, content, rating });
    await testimonial.save();
    res.send("Testimonial Sent" + testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
