import mongoose, { Schema } from "mongoose";

/* // Define the interface for banner
export interface IBanner extends Document {
  title: string;
  link: string;
}

// Define the interface for the Settings document
export interface ISettings extends Document {
  banner: IBanner;
  promotion: IPromotion;
}

// Define the interface for promotion
export interface IPromotion extends Document {
  productId: Schema.Types.ObjectId; // Reference to the Product
}
 */
const productSchema = new Schema(
  {
    images: [
      {
        url: { type: String, required: true }, // Ensure URL is required
        caption: { type: String, required: true }, // Ensure caption is required
      },
    ],
    videos: [
      {
        url: { type: String }, // Ensure URL is required
        caption: { type: String }, // Ensure caption is required
      },
    ], // Add this line
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

export const Product = mongoose.model("Product", productSchema);

// Define the schemas for banner and promotion
const BannerSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
});

const PromotionSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to the Product model
});

// Define the Settings schema that includes banner and promotion
const SettingsSchema = new Schema({
  banner: {
    type: BannerSchema,
    required: true,
  },
  promotion: {
    type: PromotionSchema,
    required: true,
  },
});

// Create the model
export const Settings =
  mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
