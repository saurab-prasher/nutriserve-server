const jwt = require("jsonwebtoken");
// This function verifies the JWT token
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = authenticateUser = (req, res, next) => {
  const token = req.cookies["token"]; // The name 'token' should match the cookie's name set during login/registration

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Failed to authenticate token" });
    }

    req.userId = decoded.userId;
    next();
  });
};
