import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    images: [
      {
        url: { type: String, required: true }, // Ensure URL is required
        caption: { type: String, required: true }, // Ensure caption is required
      },
    ],
    descriptionImages: [String],
    title: { type: String, required: true },
    quantitySold: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    features: [String],
    colors: [String],
    whyNeedThis: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    characteristics: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
