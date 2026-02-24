import { z } from "zod";
import { seoSchema } from "./common.validation";

export const testimonialSchema = z.object({
  name: z.string().min(2),
  roleCompany: z.string().optional().default(""),
  message: z.string().min(5),
  rating: z.coerce.number().min(1).max(5).optional(),
  order: z.coerce.number().optional().default(0),
  visible: z.boolean().optional().default(true),
  seo: seoSchema,
});

export const createPublicTestimonialSchema = z.object({
  name: z.string().min(2).max(80),
  roleCompany: z.string().max(120).optional().default(""),
  message: z.string().min(10).max(1200),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  honeypot: z.string().optional().default(""),
});
