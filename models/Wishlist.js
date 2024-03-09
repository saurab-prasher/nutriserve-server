const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mealId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
