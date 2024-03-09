const router = require("express").Router();
const Wishlist = require("../models/Wishlist");

// Add meal to wishlist
router.post("/", async (req, res) => {
  try {
    const { userId, mealId } = req.body;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { mealId: mealId } },
      { upsert: true, new: true }
    );
    console.log(wishlist);
    res.json(wishlist);
  } catch (error) {
    console.error("Error adding meal to wishlist:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove meal from wishlist
// router.post("/wishlist/remove", async (req, res) => {
//   try {
//     const { userId, mealId } = req.body;
//     const wishlist = await Wishlist.findOneAndUpdate(
//       { userId },
//       { $pull: { meals: mealId } },
//       { new: true }
//     );
//     res.json(wishlist);
//   } catch (error) {
//     console.error("Error removing meal from wishlist:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
