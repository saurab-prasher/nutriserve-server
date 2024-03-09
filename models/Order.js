const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mealIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
  deliveryDate: Date,
  deliveryTime: String,
  status: {
    type: String,
    enum: ["Placed", "Delivered", "Cancelled"],
    default: "Placed",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
