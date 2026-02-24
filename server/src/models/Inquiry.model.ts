import { InferSchemaType, Model, Schema, model } from "mongoose";
import { INQUIRY_STATUS } from "../constants";

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: Object.values(INQUIRY_STATUS), default: INQUIRY_STATUS.NEW, index: true },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export type InquiryDocument = InferSchemaType<typeof inquirySchema>;
export const InquiryModel: Model<InquiryDocument> = model<InquiryDocument>("Inquiry", inquirySchema);
