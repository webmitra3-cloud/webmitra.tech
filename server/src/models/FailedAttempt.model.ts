import { InferSchemaType, Model, Schema, model } from "mongoose";
import { FAILED_ATTEMPT_TYPE } from "../constants";

const failedAttemptSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(FAILED_ATTEMPT_TYPE),
      required: true,
      index: true,
    },
    ip: { type: String, default: "", index: true },
    userAgent: { type: String, default: "" },
    reason: { type: String, default: "" },
  },
  { timestamps: true },
);

export type FailedAttemptDocument = InferSchemaType<typeof failedAttemptSchema>;
export const FailedAttemptModel: Model<FailedAttemptDocument> = model<FailedAttemptDocument>(
  "FailedAttempt",
  failedAttemptSchema,
);
