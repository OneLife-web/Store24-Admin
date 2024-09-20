import mongoose, { Schema, model, models } from "mongoose";

const productSchema = new Schema({
  images: [String],
  title: { type: String, required: true },
  price: { type: Number, required: true },
  features: [String],
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
      title: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);
