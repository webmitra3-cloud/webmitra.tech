import { InferSchemaType, Model, Schema, model } from "mongoose";
import { ROLES } from "../constants";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.EDITOR,
      required: true,
    },
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    return ret;
  },
});

export type UserDocument = InferSchemaType<typeof userSchema>;
export const UserModel: Model<UserDocument> = model<UserDocument>("User", userSchema);
