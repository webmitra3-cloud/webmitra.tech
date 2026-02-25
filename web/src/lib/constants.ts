import { SiteSettings } from "@/types";

const DEFAULT_DEV_API_ORIGIN = "http://localhost:5000";
const DEFAULT_PROD_API_ORIGIN = "https://webmitratech.onrender.com";

export function normalizeApiOrigin(url?: string): string {
  const value = (url || "").trim();
  return value.replace(/\/+$/, "").replace(/\/api$/i, "");
}

const configuredOrigin =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? DEFAULT_PROD_API_ORIGIN : DEFAULT_DEV_API_ORIGIN);

const normalizedOrigin = normalizeApiOrigin(configuredOrigin);

export const API_BASE_URL = `${normalizedOrigin}/api`;

export const defaultSettings: SiteSettings = {
  companyName: "WebMitra.Tech",
  tagline: "Modern digital services",
  shortIntro: "We design and build practical digital products.",
  longDescription: "WebMitra.Tech is a full-service digital agency in Butwal, Nepal.",
  mission: "Deliver measurable digital value to businesses.",
  vision: "Be the most trusted local digital partner.",
  values: ["Clarity", "Quality", "Partnership"],
  stats: {
    projectsDelivered: 0,
    clients: 0,
    years: 0,
  },
  contact: {
    phone: "+977 9869672736",
    email: "webmitra3@gmail.com",
    address: "Butwal, Nepal",
    officeHours: "",
  },
  socials: {
    facebook: "",
    instagram: "",
    tiktok: "",
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "9779869672736",
    email: "webmitra3@gmail.com",
    linkedin: "",
  },
  header: {
    topNotice: "WebMitra.Tech | Butwal, Nepal",
    badges: ["Web Development", "Social Growth", "SEO Support"],
    logoSubtext: "Build | Market | Scale",
    primaryCtaLabel: "Get a Quote",
    secondaryCtaLabel: "Case Studies",
  },
  footer: {
    locationLabel: "Butwal, Nepal",
    tagline: "Digital growth partner for modern businesses",
    projectCtaLabel: "Start a Project",
    projectCtaSubtext: "Share your scope and get a clear execution plan.",
    quoteButtonLabel: "Get a Quote",
    emailButtonLabel: "Email",
    callButtonLabel: "Call",
    officeTitle: "Office",
    capabilitiesTitle: "Capabilities",
    capabilities: [
      "Website Design and Development",
      "Web App and CMS Solutions",
      "SEO and Content Strategy",
      "Social Media Growth",
    ],
    directContactTitle: "Direct Contact",
    connectTitle: "Connect",
    connectText: "Follow us for updates, collaborations, and insights.",
    discussLabel: "Discuss your project",
    bottomNote: "Built for speed, accessibility, and long-term growth",
  },
  logoUrl: "",
  homepageBannerUrl: "",
};

export const publicNavItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export const adminNavItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/settings", label: "Settings" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/board", label: "Board" },
  { to: "/admin/collaborations", label: "Collaborations" },
  { to: "/admin/pricing", label: "Pricing" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/inquiries", label: "Inquiries" },
];
