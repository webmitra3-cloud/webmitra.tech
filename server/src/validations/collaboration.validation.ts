import { z } from "zod";
import { optionalUrlSchema } from "./common.validation";

export const collaborationSchema = z.object({
  name: z.string().min(2),
  logoUrl: optionalUrlSchema,
  websiteUrl: optionalUrlSchema,
  note: z.string().optional().default(""),
  order: z.coerce.number().optional().default(0),
});
