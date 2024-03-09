const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register User

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    // const user = new User({ email, password, firstname, lastname });
    // console.log(user);

    // await user();

    const user = await User.create({
      email,
      password,
      firstname,
      lastname,
    });

    console.log("User saved", user);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("Token generated:", token);
    res.json({
      token,
      user: {
        email: user?.email,
        firstname: user?.firstname,
        lastname: user?.lastname,
      },
      msg: "SUCCESS",
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      msg: "SUCCESS",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/me", (req, res) => {
  console.log("Retrieve the current user's profile");
});

router.put("/me", (req, res) => {
  console.log("Update the current user's profile");
});

module.exports = router;
