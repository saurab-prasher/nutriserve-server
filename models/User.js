const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Address = require("./Address");
const { PricingSchema } = require("./pricingPlan");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarImg: { type: String },
  preferences: [String], // e.g., ["Gluten-free", "Vegan"]
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  address: Address,
  plan: PricingSchema,
});

// Pre-save hook to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

// Method to check password validity
UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
