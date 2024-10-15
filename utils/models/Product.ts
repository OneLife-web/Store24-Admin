import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: String, required: true }, // You can use Date type if you prefer
    rating: { type: Number, required: true, min: 1, max: 5 }, // Enforce rating limits
    country: { type: String }, // Optional, if you want to allow empty countries
  },
  { timestamps: true } // Timestamps for each review
);

const productSchema = new Schema(
  {
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String }, // Ensure caption is required
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
    reviews: [reviewSchema], // Add the reviews field here
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
