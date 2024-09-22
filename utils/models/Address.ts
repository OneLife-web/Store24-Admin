// models/Address.ts
import mongoose, { Schema, Document } from "mongoose";

interface IAddress extends Document {
  userId: Schema.Types.ObjectId;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

const AddressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { timestamps: true }
);

export const Address = mongoose.model<IAddress>("Address", AddressSchema);
