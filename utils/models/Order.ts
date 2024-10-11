// models/Order.ts
import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  total: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  stripeSessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  orderStatus: { type: String, default: "processing" }, // e.g., processing, shipped, delivered, canceled
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);