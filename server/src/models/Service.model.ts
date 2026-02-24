import { InferSchemaType, Model, Schema, model } from "mongoose";

const seoSchema = new Schema(
  {
    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    metaKeywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, default: "", trim: true },
    ogImageUrl: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: "Wrench", trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type ServiceDocument = InferSchemaType<typeof serviceSchema>;
export const ServiceModel: Model<ServiceDocument> = model<ServiceDocument>("Service", serviceSchema);
