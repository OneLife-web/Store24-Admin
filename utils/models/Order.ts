import mongoose, { Schema, Document } from "mongoose";

interface Order extends Document {
  items: { name: string; image: string; price: number; quantity: number }[];
  customerDetails: {
    firstName: string;
    lastName: string;
    street: string;
    apt?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    email: string;
  };
  userId: mongoose.Types.ObjectId; // Use ObjectId here
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  orderId: string;
  packageInfo: string;
  trackingId?: string;
}

const OrderSchema: Schema = new Schema({
  items: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  customerDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    apt: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "processing",
  },
  total: {
    type: Number,
    required: true,
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  packageInfo: String,
  trackingId: {
    type: String,
    required: false, // This will be added after the order is processed
  },
});

const OrderModel =
  mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);

export default OrderModel;
