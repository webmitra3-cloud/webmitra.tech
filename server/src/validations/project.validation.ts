import { z } from "zod";
import { optionalUrlSchema, seoSchema } from "./common.validation";

export const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  summary: z.string().min(10),
  content: z.string().min(20),
  thumbnailUrl: optionalUrlSchema,
  gallery: z.array(z.string().url()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  techStack: z.array(z.string()).optional().default([]),
  viewLiveUrl: optionalUrlSchema,
  demoUrl: optionalUrlSchema,
  featured: z.boolean().optional().default(false),
  order: z.coerce.number().optional().default(0),
  seo: seoSchema,
});
