require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;
const authRouter = require("./routes/authRouter");
const mealsRouter = require("./routes/mealsRouter");
const testimonialsRouter = require("./routes/testimonialRouter");
const pricingRoutes = require("./routes/pricingRouter");
const wishlistRouter = require("./routes/wishlistRouter");
const blogPostsRouter = require("./routes/blogPostsRouter");
const contactRouter = require("./routes/contactRouter");

app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow only the frontend origin
  credentials: true, // Allow cookies and credentials
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions)); // Use CORS options

app.use(bodyParser.json());
app.use(express.json());

app.use("/users", authRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/wishlist", wishlistRouter);

app.use("/api/blogPosts", blogPostsRouter);

app.use("/api/pricing", pricingRoutes);
app.use("/contact", contactRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello from Express on Netlify!");
});

// for development
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
// module.exports.handler = serverless(app);
