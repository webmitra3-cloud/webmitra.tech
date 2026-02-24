import { z } from "zod";

export const optionalUrlSchema = z.union([z.string().url(), z.literal("")]).optional().default("");

export const seoSchema = z
  .object({
    metaTitle: z.string().max(120).optional().default(""),
    metaDescription: z.string().max(200).optional().default(""),
    metaKeywords: z.array(z.string().min(1)).optional().default([]),
    canonicalUrl: optionalUrlSchema,
    ogImageUrl: optionalUrlSchema,
  })
  .default({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
    canonicalUrl: "",
    ogImageUrl: "",
  });

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const objectIdParamSchema = z.object({
  id: z.string().min(1),
});
