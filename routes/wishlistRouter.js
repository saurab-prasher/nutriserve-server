const router = require("express").Router();
const Wishlist = require("../models/Wishlist");

const authenticateUser = require("../middlewares/authMiddleware");

// Add meal to wishlist
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { userId, mealId } = req.body;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { mealId: mealId } },
      { upsert: true, new: true }
    );

    res.json(wishlist);
  } catch (error) {
    console.error("Error adding meal to wishlist:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  // try {
  //   const wishlist = await Wishlist.findById(req.params.id);
  //   res.json(wishlist);
  // } catch (error) {
  //   console.error("Error adding meal to wishlist:", error);
  //   res.status(500).json({ error: error.message });
  // }
});
router.post("/remove", async (req, res) => {
  // Simplified endpoint for consistency
  try {
    const { userId, mealId } = req.body;
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { mealId: mealId } }, // Assure this field name matches your schema
      { new: true }
    );
    res.json(wishlist);
  } catch (error) {
    console.error("Error removing meal from wishlist:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
