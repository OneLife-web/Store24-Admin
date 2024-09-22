// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  phone: string;
  name?: string;
  email?: string;
  address: Schema.Types.ObjectId[];
  orders: Schema.Types.ObjectId[];
  cart: Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    address: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    cart: [{ type: Schema.Types.ObjectId, ref: "CartItem" }],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
