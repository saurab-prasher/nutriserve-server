const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // Assuming rating is from 1 to 5
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
