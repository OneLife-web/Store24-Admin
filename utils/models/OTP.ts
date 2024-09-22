// models/OTP.ts
import mongoose, { Schema, Document } from "mongoose";

interface IOTP extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
}

const OTPSchema: Schema = new Schema(
  {
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const OTP = mongoose.model<IOTP>("OTP", OTPSchema);
