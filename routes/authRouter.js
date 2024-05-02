const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer"); // Multer is a middleware for handling multipart/form-data

const upload = multer({ dest: "uploads/" }); // Configure multer

const authenticateUser = require("../middlewares/authMiddleware");
const cors = require("cors");
// Register User
// Your JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", upload.single("avatarImg"), async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    const avatarImg = req.file; // this is the uploaded image file from multer

    const user = await User.create({
      email,
      password,
      firstname,
      lastname,
      avatarImg: avatarImg.path,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set to true if you're using https
      sameSite: "strict", // helps prevent CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.json({
      message: "Success",
      user: { email, firstname, lastname },
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Login User
router.get("/login", (req, res) => {
  res.send("login form");
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set to true if you're using https
      sameSite: "strict", // helps prevent CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      user: {
        userId: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        avatarImg: user.avatarImg,
        address: user.address,
      },
      msg: "Successfully signed",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update User Address
router.post("/updateAddress", authenticateUser, async (req, res) => {
  const { street, unit, city, state, postalCode, country } = req.body;
  try {
    // Assuming req.userId is set by the authenticateUser middleware
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          "address.street": street,
          "address.unit": unit,
          "address.city": city,
          "address.state": state,
          "address.postalCode": postalCode,
          "address.country": country,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Address updated successfully",
      user: {
        email: updatedUser.email,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/setplan", upload.none(), authenticateUser, async (req, res) => {
  console.log(req.body);
  const { planName, numOfPeople, recipesPerWeek, totalPrice } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.userId,

    {
      $set: {
        "plan.planName": planName,
        "plan.numberOfPeople": numOfPeople,
        "plan.recipesPerWeek": recipesPerWeek,
        "plan.totalPricePerWeek": totalPrice,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    message: "plan added successfully",
    user: {
      email: updatedUser.email,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      address: updatedUser.address,
    },
  });
});

// Verification route
router.get("/auth/verify", authenticateUser, (req, res) => {
  // If the middleware did not throw an error, user is considered authenticated
  res.status(200).json({ message: "Authenticated" });
});

// This is an additional endpoint to existing '/auth/verify'
router.get("/auth/user", authenticateUser, (req, res) => {
  User.findById(req.userId)
    .then((user) => {
      res.json({
        user: {
          userId: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          avatarImg: user.avatarImg,
        },
        msg: "Success",
      });
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred fetching user data." });
    });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
