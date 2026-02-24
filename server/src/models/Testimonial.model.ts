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

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    roleCompany: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema>;
export const TestimonialModel: Model<TestimonialDocument> = model<TestimonialDocument>("Testimonial", testimonialSchema);
