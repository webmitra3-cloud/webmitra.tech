export type Role = "ADMIN" | "EDITOR";

export type SeoMeta = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl: string;
  ogImageUrl: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type SiteSettings = {
  _id?: string;
  companyName: string;
  tagline: string;
  shortIntro: string;
  longDescription: string;
  mission: string;
  vision: string;
  values: string[];
  stats: {
    projectsDelivered: number;
    clients: number;
    years: number;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    officeHours: string;
  };
  socials: {
    facebook: string;
    instagram: string;
    tiktok: string;
    whatsapp: string;
    email: string;
    linkedin: string;
  };
  header: {
    topNotice: string;
    badges: string[];
    logoSubtext: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  footer: {
    locationLabel: string;
    tagline: string;
    projectCtaLabel: string;
    projectCtaSubtext: string;
    quoteButtonLabel: string;
    emailButtonLabel: string;
    callButtonLabel: string;
    officeTitle: string;
    capabilitiesTitle: string;
    capabilities: string[];
    directContactTitle: string;
    connectTitle: string;
    connectText: string;
    discussLabel: string;
    bottomNote: string;
  };
  logoUrl: string;
  homepageBannerUrl: string;
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
  seo: SeoMeta;
  createdAt: string;
};

export type TeamType = "TEAM" | "BOARD";

export type TeamMember = {
  _id: string;
  name: string;
  roleTitle: string;
  type: TeamType;
  bio: string;
  photoUrl: string;
  portfolioUrl: string;
  socials: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  order: number;
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  gallery: string[];
  tags: string[];
  techStack: string[];
  viewLiveUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
  seo: SeoMeta;
  createdAt: string;
};

export type Collaboration = {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  note: string;
  order: number;
};

export type PricingPlanName = "SILVER" | "GOLD" | "DIAMOND";

export type PricingPlan = {
  _id: string;
  name: PricingPlanName;
  price: number;
  startingFrom: boolean;
  note: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
  ctaLink: string;
  order: number;
};

export type InquiryStatus = "NEW" | "READ" | "ARCHIVED";

export type Inquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  roleCompany: string;
  message: string;
  rating?: number;
  order: number;
  visible: boolean;
  seo: SeoMeta;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
};

export type DashboardStats = {
  totals: {
    services: number;
    projects: number;
    team: number;
    collaborations: number;
    inquiries: number;
    users: number;
    testimonials: number;
  };
  latestInquiries: Inquiry[];
};

export type HomepageData = {
  settings: SiteSettings | null;
  services: Service[];
  projects: Project[];
  collaborations: Collaboration[];
  pricing: PricingPlan[];
  team: TeamMember[];
  testimonials: Testimonial[];
};
