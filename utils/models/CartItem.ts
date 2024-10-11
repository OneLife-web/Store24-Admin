// models/CartItem.ts
import mongoose, { Schema, Document } from "mongoose";

interface ICartItem extends Document {
  userId: Schema.Types.ObjectId;
  productId: string;
  quantity: number;
}

const CartItemSchema: Schema = new Schema( 
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const CartItem = mongoose.model<ICartItem>("CartItem", CartItemSchema);
