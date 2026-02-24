import { z } from "zod";
import { TEAM_TYPES } from "../constants";
import { optionalUrlSchema } from "./common.validation";

export const teamMemberSchema = z.object({
  name: z.string().min(2),
  roleTitle: z.string().min(2),
  type: z.enum([TEAM_TYPES.TEAM, TEAM_TYPES.BOARD]),
  bio: z.string().optional().default(""),
  photoUrl: optionalUrlSchema,
  portfolioUrl: optionalUrlSchema,
  socials: z
    .object({
      facebook: optionalUrlSchema,
      instagram: optionalUrlSchema,
      linkedin: optionalUrlSchema,
    })
    .default({ facebook: "", instagram: "", linkedin: "" }),
  order: z.coerce.number().optional().default(0),
});
