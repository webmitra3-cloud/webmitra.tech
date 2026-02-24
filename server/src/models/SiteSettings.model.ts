import { InferSchemaType, Model, Schema, model } from "mongoose";

const socialSchema = new Schema(
  {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  { _id: false },
);

const statsSchema = new Schema(
  {
    projectsDelivered: { type: Number, default: 0 },
    clients: { type: Number, default: 0 },
    years: { type: Number, default: 0 },
  },
  { _id: false },
);

const contactSchema = new Schema(
  {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    officeHours: { type: String, default: "" },
  },
  { _id: false },
);

const headerSchema = new Schema(
  {
    topNotice: { type: String, default: "", trim: true },
    badges: [{ type: String, trim: true }],
    logoSubtext: { type: String, default: "", trim: true },
    primaryCtaLabel: { type: String, default: "Get a Quote", trim: true },
    secondaryCtaLabel: { type: String, default: "Case Studies", trim: true },
  },
  { _id: false },
);

const footerSchema = new Schema(
  {
    locationLabel: { type: String, default: "Butwal, Nepal", trim: true },
    tagline: { type: String, default: "", trim: true },
    projectCtaLabel: { type: String, default: "Start a Project", trim: true },
    projectCtaSubtext: { type: String, default: "", trim: true },
    quoteButtonLabel: { type: String, default: "Get a Quote", trim: true },
    emailButtonLabel: { type: String, default: "Email", trim: true },
    callButtonLabel: { type: String, default: "Call", trim: true },
    officeTitle: { type: String, default: "Office", trim: true },
    capabilitiesTitle: { type: String, default: "Capabilities", trim: true },
    capabilities: [{ type: String, trim: true }],
    directContactTitle: { type: String, default: "Direct Contact", trim: true },
    connectTitle: { type: String, default: "Connect", trim: true },
    connectText: { type: String, default: "", trim: true },
    discussLabel: { type: String, default: "Discuss your project", trim: true },
    bottomNote: { type: String, default: "Built for speed, accessibility, and long-term growth", trim: true },
  },
  { _id: false },
);

const siteSettingsSchema = new Schema(
  {
    companyName: { type: String, required: true, trim: true },
    tagline: { type: String, default: "", trim: true },
    shortIntro: { type: String, default: "", trim: true },
    longDescription: { type: String, default: "", trim: true },
    mission: { type: String, default: "", trim: true },
    vision: { type: String, default: "", trim: true },
    values: [{ type: String, trim: true }],
    stats: { type: statsSchema, default: () => ({}) },
    contact: { type: contactSchema, default: () => ({}) },
    socials: { type: socialSchema, default: () => ({}) },
    header: { type: headerSchema, default: () => ({}) },
    footer: { type: footerSchema, default: () => ({}) },
    logoUrl: { type: String, default: "" },
    homepageBannerUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema>;
export const SiteSettingsModel: Model<SiteSettingsDocument> = model<SiteSettingsDocument>(
  "SiteSettings",
  siteSettingsSchema,
);
