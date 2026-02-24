import { z } from "zod";
import { optionalUrlSchema } from "./common.validation";

export const siteSettingsSchema = z.object({
  companyName: z.string().min(2),
  tagline: z.string().optional().default(""),
  shortIntro: z.string().optional().default(""),
  longDescription: z.string().optional().default(""),
  mission: z.string().optional().default(""),
  vision: z.string().optional().default(""),
  values: z.array(z.string()).default([]),
  stats: z
    .object({
      projectsDelivered: z.coerce.number().min(0).default(0),
      clients: z.coerce.number().min(0).default(0),
      years: z.coerce.number().min(0).default(0),
    })
    .default({ projectsDelivered: 0, clients: 0, years: 0 }),
  contact: z
    .object({
      phone: z.string().optional().default(""),
      email: z.string().email(),
      address: z.string().optional().default(""),
      officeHours: z.string().optional().default(""),
    })
    .default({ phone: "", email: "webmitra3@gmail.com", address: "", officeHours: "" }),
  socials: z
    .object({
      facebook: optionalUrlSchema,
      instagram: optionalUrlSchema,
      tiktok: optionalUrlSchema,
      whatsapp: z.string().optional().default(""),
      email: z.string().email().optional().default("webmitra3@gmail.com"),
      linkedin: optionalUrlSchema,
    })
    .default({ facebook: "", instagram: "", tiktok: "", whatsapp: "", email: "webmitra3@gmail.com", linkedin: "" }),
  header: z
    .object({
      topNotice: z.string().optional().default(""),
      badges: z.array(z.string()).default([]),
      logoSubtext: z.string().optional().default(""),
      primaryCtaLabel: z.string().optional().default("Get a Quote"),
      secondaryCtaLabel: z.string().optional().default("Case Studies"),
    })
    .default({
      topNotice: "",
      badges: [],
      logoSubtext: "",
      primaryCtaLabel: "Get a Quote",
      secondaryCtaLabel: "Case Studies",
    }),
  footer: z
    .object({
      locationLabel: z.string().optional().default("Butwal, Nepal"),
      tagline: z.string().optional().default(""),
      projectCtaLabel: z.string().optional().default("Start a Project"),
      projectCtaSubtext: z.string().optional().default(""),
      quoteButtonLabel: z.string().optional().default("Get a Quote"),
      emailButtonLabel: z.string().optional().default("Email"),
      callButtonLabel: z.string().optional().default("Call"),
      officeTitle: z.string().optional().default("Office"),
      capabilitiesTitle: z.string().optional().default("Capabilities"),
      capabilities: z.array(z.string()).default([]),
      directContactTitle: z.string().optional().default("Direct Contact"),
      connectTitle: z.string().optional().default("Connect"),
      connectText: z.string().optional().default(""),
      discussLabel: z.string().optional().default("Discuss your project"),
      bottomNote: z.string().optional().default("Built for speed, accessibility, and long-term growth"),
    })
    .default({
      locationLabel: "Butwal, Nepal",
      tagline: "",
      projectCtaLabel: "Start a Project",
      projectCtaSubtext: "",
      quoteButtonLabel: "Get a Quote",
      emailButtonLabel: "Email",
      callButtonLabel: "Call",
      officeTitle: "Office",
      capabilitiesTitle: "Capabilities",
      capabilities: [],
      directContactTitle: "Direct Contact",
      connectTitle: "Connect",
      connectText: "",
      discussLabel: "Discuss your project",
      bottomNote: "Built for speed, accessibility, and long-term growth",
    }),
  logoUrl: optionalUrlSchema,
  homepageBannerUrl: optionalUrlSchema,
});
