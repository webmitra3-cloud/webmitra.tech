import { z } from "zod";
import { seoSchema } from "./common.validation";

export const serviceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  icon: z.string().min(1),
  featured: z.boolean().optional().default(false),
  order: z.coerce.number().optional().default(0),
  seo: seoSchema,
});
