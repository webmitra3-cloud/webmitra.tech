import { InferSchemaType, Model, Schema, model } from "mongoose";

const collaborationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    note: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type CollaborationDocument = InferSchemaType<typeof collaborationSchema>;
export const CollaborationModel: Model<CollaborationDocument> = model<CollaborationDocument>(
  "Collaboration",
  collaborationSchema,
);
