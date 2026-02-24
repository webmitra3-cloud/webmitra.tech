import { InferSchemaType, Model, Schema, model } from "mongoose";
import { PRICING_PLAN_NAMES } from "../constants";

const pricingPlanSchema = new Schema(
  {
    name: {
      type: String,
      enum: Object.values(PRICING_PLAN_NAMES),
      required: true,
      unique: true,
      index: true,
    },
    price: { type: Number, required: true },
    startingFrom: { type: Boolean, default: false },
    note: { type: String, default: "" },
    features: [{ type: String }],
    highlighted: { type: Boolean, default: false },
    ctaLabel: { type: String, default: "Get Started" },
    ctaLink: { type: String, default: "/contact" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type PricingPlanDocument = InferSchemaType<typeof pricingPlanSchema>;
export const PricingPlanModel: Model<PricingPlanDocument> = model<PricingPlanDocument>("PricingPlan", pricingPlanSchema);
