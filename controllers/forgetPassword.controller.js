const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    console.log(user);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    console.log(token);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    console.log(user);

    await user.save();
    // Send the token to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
    });
    const resetUrl = `${process.env.BASE_URL}/reset-password/${user._id}/${token}`;
    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.send({ message: err.message });
      }
      res.json({ message: "Email sent" });
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

resetPassword = async (req, res) => {
  console.log("route working");
  try {
    // Verify the token sent by the user
    const decodedToken = jwt.verify(req.params.token, process.env.JWT_SECRET);
    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }
    // find the user with the id from the token
    const user = await User.findOne({ _id: decodedToken.userId });

    if (!user) {
      return res.status(401).send({ message: "no user found" });
    }

    // Update user's password, clear reset token and expiration time
    user.password = req.body.password;
    await user.save();
    // Send success response
    res.send({ message: "Password updated" });
  } catch (err) {
    // Send error response if any error occurs
    res.send({ message: err.message });
  }
};

module.exports = {
  forgetPassword,
  resetPassword,
};
