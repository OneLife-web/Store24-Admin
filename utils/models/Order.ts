// models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  userId: Schema.Types.ObjectId;
  items: Schema.Types.ObjectId[];
  total: number;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "CartItem" }],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
