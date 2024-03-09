const router = require("express").Router();
const Wishlist = require("../models/Wishlist");
const User = require("../models/User");

// Add meal to wishlist
router.post("/", async (req, res) => {
  try {
    const { user, meal, email } = req.body;
    console.log(user, meal, email);

    // // Find the user by email
    const newUser = await User.findOne({ email: email });
    if (!newUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(newUser, "user found");

    // // Create a new wishlist entry
    const wishlist = new Wishlist({ user: user._id, likedMeals: [meal] });
    console.log(wishlist, "wish list");
    await wishlist.save();

    res.json({ success: true, message: "Meal added to wishlist" });
  } catch (error) {
    console.error("Error adding meal to wishlist:", error);
  }
});

// Get user's wishlist
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // Find the user by id
    const user = await User.findOne({ _id: id });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find wishlist items for the user
    const wishlist = await Wishlist.find({ user: user._id });

    res.json({ success: true, likedMeals: wishlist[0].likedMeals });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove meal from wishlist
router.delete("/:wishlistItemId", async (req, res) => {
  try {
    const { wishlistItemId } = req.params;

    // Delete the wishlist item
    await Wishlist.findByIdAndDelete(wishlistItemId);

    res.json({ success: true, message: "Meal removed from wishlist" });
  } catch (error) {
    console.error("Error removing meal from wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
