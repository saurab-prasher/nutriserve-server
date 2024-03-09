const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String },
    // Reference to the user who owns the wishlist
    likedMeals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }], // Array of references to the liked meals
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
