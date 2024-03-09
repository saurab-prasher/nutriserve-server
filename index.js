require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const authRouter = require("./routes/authRouter");
const mealsRouter = require("./routes/mealsRouter");
const testimonialsRouter = require("./routes/testimonialRouter");
const pricingRoutes = require("./routes/pricingRouter");
const wishlistRouter = require("./routes/wishlistRouter");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/users", authRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/wishlist", wishlistRouter);

app.use("/api/pricing", pricingRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("home page");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
