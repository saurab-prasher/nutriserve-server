const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer"); // Multer is a middleware for handling multipart/form-data
const AWS = require("aws-sdk");

const {
  forgetPassword,
  resetPassword,
} = require("../controllers/forgetPassword.controller");
// const upload = multer({ dest: "uploads/" }); // Configure multer

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const storage = multer.memoryStorage();

// We can use Multer’s fileFilter function to restrict the file types that can be uploaded

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// Limiting file size to 5MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const authenticateUser = require("../middlewares/authMiddleware");
const cors = require("cors");

// Register User
// Your JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

const deleteImageFromS3 = (bucketName, key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    s3.deleteObject(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

const uploadImageToS3 = (bucketName, file) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: `${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

router.post(
  "/editavatar",
  authenticateUser,
  upload.single("img"),
  async (req, res) => {
    const file = req.file;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      //   // Fetch user from the database
      const user = await User.findById(req.user.userId);

      //   // If user already has an avatar, delete it from S3
      if (user.avatarImg) {
        const key = user.avatarImg.split("/").pop();
        await deleteImageFromS3(bucketName, key);
      }

      //   // Upload new image to S3
      const uploadResult = await uploadImageToS3(bucketName, file);

      //   // Update user's avatar URL in the database
      user.avatarImg = uploadResult.Location;
      await user.save();

      res.status(200).json({
        message: "File uploaded successfully!",
        imageUrl: uploadResult.Location,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("Error uploading file.");
    }
  }
);

router.post("/register", upload.single("avatarImg"), async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    const file = req.file; // this is the uploaded image file from multer

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${Date.now()}_${file.originalname}`, // Adding timestamp to make the file name unique
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data = await s3.upload(params).promise();
      const fileUrl = data.Location; // This is the URL of the uploaded file

      const user = await User.create({
        email,
        password,
        firstname,
        lastname,
        avatarImg: `${fileUrl}`,
      });

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // set to true if you're using https
        sameSite: "strict", // helps prevent CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.json({
        message: "Success",
        user: { email, firstname, lastname, avatarImg: user.avatarImg },
        token,
      });
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      res.status(500).send("Error uploading file to S3");
    }
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
      return res.json({ msg: "Invalid credentials" });
    }
    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.json({ msg: "Invalid credentials" });
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
    console.log(user);
    res.json({
      user: {
        userId: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        avatarImg: user.avatarImg,
        gender: user.gender,
        birthday: user.birthday,
        address: user.address,
        plan: user.plan,
      },
      msg: "Successfully signed",
      token,
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update User Information
router.post("/updateUserInfo", authenticateUser, async (req, res) => {
  const { firstname, lastname, email, gender, birthday } = req.body;

  try {
    // Assuming req.userId is set by the authenticateUser middleware
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          gender: gender,
          birthday: {
            month: birthday.month,
            day: birthday.day,
            year: birthday.year,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ error: "User not found" });
    }

    res.json({
      message: "User information updated successfully",
      user: {
        email: updatedUser.email,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        gender: updatedUser.gender,
        birthday: updatedUser.birthday,
      },
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update User Address
router.post("/updateAddress", authenticateUser, async (req, res) => {
  const { street, unit, city, state, postalCode, country } = req.body;
  try {
    // Assuming req.userId is set by the authenticateUser middleware
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
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
      return res.json({ error: "User not found" });
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

router.post(
  "/setuserplan",
  upload.none(),
  authenticateUser,
  async (req, res) => {
    const {
      planName,
      numOfPeople,
      recipesPerWeek,
      totalPrice,
      planDescription,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,

      {
        $set: {
          "plan.planName": planName,
          "plan.numberOfPeople": numOfPeople,
          "plan.recipesPerWeek": recipesPerWeek,
          "plan.totalPricePerWeek": totalPrice,
          "plan.description": planDescription,
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
  }
);

router.get("/getplan", authenticateUser, async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    plan: user.plan,
  });
});

// Verification route
router.get("/auth/verify", authenticateUser, (req, res) => {
  // If the middleware did not throw an error, user is considered authenticated
  res.status(200).json({ message: "Authenticated", user: req.user });
});

router.get("/auth/user", authenticateUser, (req, res) => {
  User.findById(req.user.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        user: {
          userId: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          avatarImg: user.avatarImg,

          address: user.address,
          plan: user.plan,
        },
        msg: "Success",
      });
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred fetching user data." });
    });
});

router.post("/forgetPassword", forgetPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
