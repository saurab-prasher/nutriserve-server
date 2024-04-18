const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateUser = require("../middlewares/authMiddleware");
const cors = require("cors");
// Register User
// Your JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    const user = await User.create({
      email,
      password,
      firstname,
      lastname,
    });

    console.log("User saved", user);

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
    console.log(req.body);
    const user = await User.findOne({ email });
    console.log(user); // Check if user is found
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await user.isValidPassword(password);
    console.log(isMatch); // Check if password is correct
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
      },
      msg: "Successfully signed",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
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

router.put("/me", (req, res) => {
  console.log("Update the current user's profile");
});

module.exports = router;
