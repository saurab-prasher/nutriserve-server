const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pricingPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PricingPlan",
    required: true,
  },
  startDate: { type: Date, required: true },
  deliveryTime: String,
  status: {
    type: String,
    enum: ["Active", "Paused", "Cancelled"],
    default: "Active",
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;

// SAMPLE
// {
//     "_id": "62bdf687c25e4a1f9f6e5cbd",
//     "userId": "62bdf3a8c25e4a1f9f6e5c7b",
//     "pricingPlanId": "630bdf3a8c25e4a1f9f6e5f1",
//     "startDate": "2024-02-03T00:00:00Z",
//     "deliveryTime": "18:00",
//     "status": "Active"
//   }
