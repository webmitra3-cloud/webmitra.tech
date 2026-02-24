import { z } from "zod";
import { PRICING_PLAN_NAMES } from "../constants";

export const pricingPlanSchema = z.object({
  name: z.enum([PRICING_PLAN_NAMES.SILVER, PRICING_PLAN_NAMES.GOLD, PRICING_PLAN_NAMES.DIAMOND]),
  price: z.coerce.number().min(0),
  startingFrom: z.boolean().optional().default(false),
  note: z.string().optional().default(""),
  features: z.array(z.string()).default([]),
  highlighted: z.boolean().optional().default(false),
  ctaLabel: z.string().min(2),
  ctaLink: z.string().min(1),
  order: z.coerce.number().optional().default(0),
});
