const jwt = require("jsonwebtoken");
// This function verifies the JWT token
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = authenticateUser = (req, res, next) => {
  // Ensure req.cookies exists, which requires a middleware like cookie-parser

  if (!req.header("Authorization")) {
    return res.status(401).json({ error: "No authorization header found" });
  }

  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (ex) {
    res.json({ message: "Invalid token." });
  }
};
