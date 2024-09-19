import { Schema, model, models, Document } from "mongoose";

// Define the interface for banner and promotion
export interface IBanner extends Document {
  title: string;
  link: string;
}

export interface IPromotion extends Document {
  title: string;
  link: string;
  imageUrl: string;
  features: string[];
}

// Define the interface for the Settings document
export interface ISettings extends Document {
  banner: IBanner;
  promotion: IPromotion;
}

// Define the schemas for banner and promotion
const BannerSchema = new Schema<IBanner>({
  title: { type: String, required: true },
  link: { type: String, required: true },
});

const PromotionSchema = new Schema<IPromotion>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  imageUrl: { type: String, required: true },
  features: {
    type: [String], // Array of strings
    required: true,
  },
});

// Define the Settings schema that includes banner and promotion
const SettingsSchema = new Schema<ISettings>({
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
  models.Settings || model<ISettings>("Settings", SettingsSchema);
