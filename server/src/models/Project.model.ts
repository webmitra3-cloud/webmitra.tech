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

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, default: "" },
    gallery: [{ type: String }],
    tags: [{ type: String }],
    techStack: [{ type: String }],
    viewLiveUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export type ProjectDocument = InferSchemaType<typeof projectSchema>;
export const ProjectModel: Model<ProjectDocument> = model<ProjectDocument>("Project", projectSchema);
