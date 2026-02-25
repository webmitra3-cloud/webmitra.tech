import { connectDatabase, disconnectDatabase } from "../config/db";
import { env } from "../config/env";
import {
  CollaborationModel,
  FailedAttemptModel,
  InquiryModel,
  PricingPlanModel,
  ProjectModel,
  ServiceModel,
  SiteSettingsModel,
  TeamMemberModel,
  TestimonialModel,
  UserModel,
} from "../models";
import { FAILED_ATTEMPT_TYPE, INQUIRY_STATUS, ROLES, TEAM_TYPES } from "../constants";
import { hashValue } from "../utils/password";
import { logger } from "../utils/logger";

type AdminSeedInput = {
  email?: string;
  password?: string;
};

async function seedSiteSettings() {
  await SiteSettingsModel.findOneAndUpdate(
    {},
    {
      companyName: "WebMitra.Tech",
      tagline: "Digital growth partner for modern businesses",
      shortIntro: "WebMitra.Tech helps brands build, market, and scale digital products.",
      longDescription:
        "We are a full-service digital agency in Butwal, Nepal delivering websites, web applications, branding, and long-term growth support.",
      mission: "Empower businesses with practical, scalable digital solutions.",
      vision: "Become the most trusted technology and branding partner in Nepal.",
      values: ["Clarity", "Reliability", "Long-term partnerships"],
      stats: {
        projectsDelivered: 120,
        clients: 80,
        years: 6,
      },
      contact: {
        phone: "+977 9869672736",
        email: "webmitra3@gmail.com",
        address: "Traffic Chowk, Butwal, Nepal",
        officeHours: "Sun-Fri, 9:00 AM - 6:00 PM",
      },
      socials: {
        facebook: "https://facebook.com/webmitratech",
        instagram: "https://instagram.com/webmitratech",
        tiktok: "https://tiktok.com/@webmitratech",
        whatsapp: "9779869672736",
        email: "webmitra3@gmail.com",
        linkedin: "https://linkedin.com/company/webmitra-tech",
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
      logoUrl: "https://dummyimage.com/420x120/0f4fa8/ffffff.png&text=WebMitra.Tech",
      homepageBannerUrl:
        "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1400&q=80",
    },
    { upsert: true, new: true },
  );
}

async function dropLegacyIdIndexes() {
  const models = [
    ServiceModel,
    ProjectModel,
    TeamMemberModel,
    CollaborationModel,
    PricingPlanModel,
    TestimonialModel,
    InquiryModel,
    FailedAttemptModel,
    SiteSettingsModel,
    UserModel,
  ];

  for (const model of models) {
    try {
      await model.collection.dropIndex("id_1");
    } catch (error) {
      // Ignore when legacy index does not exist.
    }
  }
}

async function seedAdminUser() {
  const email = (env.ADMIN_SEED_EMAIL || "").trim().toLowerCase();
  const password = env.ADMIN_SEED_PASSWORD || "";

  if (!email || !password) {
    logger.warn("Admin seed skipped: ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD is missing.");
    return;
  }

  await UserModel.findOneAndUpdate(
    { email },
    {
      name: "WebMitra.Tech Admin",
      email,
      role: ROLES.ADMIN,
      passwordHash: await hashValue(password),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
}

export async function seedAdminIfNotExists(input: AdminSeedInput = {}): Promise<void> {
  const email = (input.email ?? process.env.ADMIN_SEED_EMAIL ?? env.ADMIN_SEED_EMAIL ?? "")
    .trim()
    .toLowerCase();
  const password = input.password ?? process.env.ADMIN_SEED_PASSWORD ?? env.ADMIN_SEED_PASSWORD ?? "";

  if (!email || !password) {
    logger.warn("Admin startup seed skipped: ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD is missing.");
    return;
  }

  const passwordHash = await hashValue(password);
  const existingAdmin = await UserModel.findOne({ email }).select("_id role");
  if (existingAdmin) {
    await UserModel.findByIdAndUpdate(existingAdmin._id, {
      name: "WebMitra.Tech Admin",
      role: ROLES.ADMIN,
      passwordHash,
    });
    logger.info("Admin already exists. Credentials synced from environment.");
    return;
  }

  await UserModel.create({
    name: "WebMitra.Tech Admin",
    email,
    role: ROLES.ADMIN,
    passwordHash,
  });

  logger.info("Admin created from startup seed");
}

export async function seedContentIfEmpty(): Promise<void> {
  const [
    settingsCount,
    servicesCount,
    projectsCount,
    teamCount,
    collaborationsCount,
    pricingCount,
    testimonialsCount,
  ] = await Promise.all([
    SiteSettingsModel.countDocuments(),
    ServiceModel.countDocuments(),
    ProjectModel.countDocuments(),
    TeamMemberModel.countDocuments(),
    CollaborationModel.countDocuments(),
    PricingPlanModel.countDocuments(),
    TestimonialModel.countDocuments(),
  ]);

  if (settingsCount === 0) {
    await seedSiteSettings();
    logger.info("Startup seed: Site settings inserted");
  }
  if (servicesCount === 0) {
    await seedServices();
    logger.info("Startup seed: Services inserted");
  }
  if (projectsCount === 0) {
    await seedProjects();
    logger.info("Startup seed: Projects inserted");
  }
  if (teamCount === 0) {
    await seedTeam();
    logger.info("Startup seed: Team and board members inserted");
  }
  if (collaborationsCount === 0) {
    await seedCollaborations();
    logger.info("Startup seed: Collaborations inserted");
  }
  if (pricingCount === 0) {
    await seedPricing();
    logger.info("Startup seed: Pricing plans inserted");
  }
  if (testimonialsCount === 0) {
    await seedTestimonials();
    logger.info("Startup seed: Testimonials inserted");
  }
}

async function seedEditorUsers() {
  const editorPasswordHash = await hashValue("Editor@12345");
  const editors = [
    {
      name: "WebMitra.Tech Editor",
      email: "editor@webmitra.tech",
      role: ROLES.EDITOR,
      passwordHash: editorPasswordHash,
    },
    {
      name: "Content Manager",
      email: "content@webmitra.tech",
      role: ROLES.EDITOR,
      passwordHash: editorPasswordHash,
    },
  ];

  for (const user of editors) {
    await UserModel.findOneAndUpdate(
      { email: user.email },
      user,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }
}

async function seedServices() {
  const services = [
    {
      title: "Social Media Management",
      slug: "social-media-management",
      description: "Planning, publishing, and performance optimization across social channels.",
      icon: "Megaphone",
      featured: true,
      order: 1,
      seo: {
        metaTitle: "Social Media Management Services | WebMitra.Tech",
        metaDescription: "Content strategy, posting, and performance-driven social media growth for businesses.",
        metaKeywords: ["social media management", "digital marketing Nepal", "content strategy"],
        canonicalUrl: "https://webmitra.tech/services",
        ogImageUrl: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1200&q=80",
      },
    },
    {
      title: "Branding",
      slug: "branding",
      description: "Identity systems, visual guidelines, and brand strategy for consistent growth.",
      icon: "Palette",
      featured: true,
      order: 2,
      seo: {
        metaTitle: "Branding Services for Businesses | WebMitra.Tech",
        metaDescription: "Professional branding, identity systems, and positioning to build trust and recognition.",
        metaKeywords: ["branding agency", "brand identity", "design agency Nepal"],
        canonicalUrl: "https://webmitra.tech/services",
        ogImageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
      },
    },
    {
      title: "Web App Development",
      slug: "web-app-development",
      description: "Custom MERN and modern web application engineering for business workflows.",
      icon: "Code2",
      featured: true,
      order: 3,
      seo: {
        metaTitle: "Web App Development | WebMitra.Tech",
        metaDescription: "Custom web applications built with modern stack, security, and scalable architecture.",
        metaKeywords: ["web app development", "MERN development", "custom software Nepal"],
        canonicalUrl: "https://webmitra.tech/services",
        ogImageUrl: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80",
      },
    },
    {
      title: "Website Design",
      slug: "website-design",
      description: "Conversion-focused responsive websites built for speed and accessibility.",
      icon: "LayoutPanelTop",
      featured: false,
      order: 4,
      seo: {
        metaTitle: "Website Design & Development | WebMitra.Tech",
        metaDescription: "Fast, responsive, and conversion-focused websites for growing brands.",
        metaKeywords: ["website design", "web development", "responsive website Nepal"],
        canonicalUrl: "https://webmitra.tech/services",
        ogImageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
      },
    },
    {
      title: "SEO & Content",
      slug: "seo-content",
      description: "Search optimization, technical audits, and content plans for sustained visibility.",
      icon: "Search",
      featured: false,
      order: 5,
      seo: {
        metaTitle: "SEO and Content Services | WebMitra.Tech",
        metaDescription: "Technical SEO, content strategy, and search visibility services for measurable growth.",
        metaKeywords: ["SEO services", "content marketing", "search optimization"],
        canonicalUrl: "https://webmitra.tech/services",
        ogImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      },
    },
  ];

  for (const service of services) {
    await ServiceModel.findOneAndUpdate({ slug: service.slug }, service, { upsert: true, new: true });
  }
}

async function seedProjects() {
  const projects = [
    {
      title: "Everest Fitness Club Platform",
      slug: "everest-fitness-club-platform",
      summary: "Marketing website + member dashboard with online class scheduling.",
      content:
        "A complete marketing and operations platform for a local fitness business with lead capture, trainer pages, and subscription plans.",
      thumbnailUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=1200&q=80",
      ],
      tags: ["Fitness", "Membership", "Automation"],
      techStack: ["React", "Node.js", "MongoDB"],
      viewLiveUrl: "https://example.com/live/fitness",
      demoUrl: "https://example.com/demo/fitness",
      featured: true,
      order: 1,
      seo: {
        metaTitle: "Everest Fitness Club Platform Case Study | WebMitra.Tech",
        metaDescription: "Marketing website and member dashboard implementation for a fitness business.",
        metaKeywords: ["fitness platform", "case study", "web app"],
        canonicalUrl: "https://webmitra.tech/projects/everest-fitness-club-platform",
        ogImageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
      },
    },
    {
      title: "Himal Agro Distribution CRM",
      slug: "himal-agro-distribution-crm",
      summary: "Sales CRM and reporting dashboard for a regional distribution team.",
      content:
        "Built a role-based CRM to manage leads, orders, and territory reporting with configurable workflows.",
      thumbnailUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      ],
      tags: ["CRM", "B2B", "Reporting"],
      techStack: ["TypeScript", "Express", "MongoDB"],
      viewLiveUrl: "https://example.com/live/agro",
      demoUrl: "https://example.com/demo/agro",
      featured: true,
      order: 2,
      seo: {
        metaTitle: "Himal Agro CRM Case Study | WebMitra.Tech",
        metaDescription: "Role-based CRM and analytics dashboard for sales operations.",
        metaKeywords: ["CRM system", "B2B dashboard", "case study"],
        canonicalUrl: "https://webmitra.tech/projects/himal-agro-distribution-crm",
        ogImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      },
    },
    {
      title: "Lumbini Travel Booking Site",
      slug: "lumbini-travel-booking-site",
      summary: "Tour package website with inquiry funnel and multilingual content support.",
      content:
        "Designed and developed a mobile-first booking and inquiry platform optimized for search rankings and lead conversion.",
      thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
      ],
      tags: ["Travel", "Booking", "SEO"],
      techStack: ["React", "Tailwind", "Node.js"],
      viewLiveUrl: "https://example.com/live/travel",
      demoUrl: "https://example.com/demo/travel",
      featured: false,
      order: 3,
      seo: {
        metaTitle: "Lumbini Travel Booking Site | WebMitra.Tech",
        metaDescription: "SEO-ready multilingual travel booking platform with inquiry funnel.",
        metaKeywords: ["travel booking website", "tour website", "SEO case study"],
        canonicalUrl: "https://webmitra.tech/projects/lumbini-travel-booking-site",
        ogImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
    },
  ];

  for (const project of projects) {
    await ProjectModel.findOneAndUpdate({ slug: project.slug }, project, { upsert: true, new: true });
  }
}

async function seedTeam() {
  const members = [
    {
      name: "Aarav Shrestha",
      roleTitle: "Lead Developer",
      type: TEAM_TYPES.TEAM,
      bio: "Builds scalable full-stack products and delivery systems.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      portfolioUrl: "https://portfolio.example.com/aarav",
      socials: {
        facebook: "https://facebook.com/aarav.shrestha.dev",
        instagram: "https://instagram.com/aarav.codes",
        linkedin: "https://linkedin.com/in/aarav-shrestha",
      },
      order: 1,
    },
    {
      name: "Sajina Karki",
      roleTitle: "Creative Strategist",
      type: TEAM_TYPES.TEAM,
      bio: "Leads branding direction and digital campaign messaging.",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      portfolioUrl: "https://portfolio.example.com/sajina",
      socials: {
        facebook: "https://facebook.com/sajina.karki.creative",
        instagram: "https://instagram.com/sajina.designs",
        linkedin: "https://linkedin.com/in/sajina-karki",
      },
      order: 2,
    },
    {
      name: "Rajan Ghimire",
      roleTitle: "Board Chair",
      type: TEAM_TYPES.BOARD,
      bio: "Advises growth strategy and partnerships.",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      portfolioUrl: "https://board.example.com/rajan-ghimire",
      socials: {
        facebook: "https://facebook.com/rajan.ghimire.board",
        instagram: "https://instagram.com/rajan.ghimire",
        linkedin: "https://linkedin.com/in/rajan-ghimire",
      },
      order: 1,
    },
    {
      name: "Pratima Poudel",
      roleTitle: "Board Advisor",
      type: TEAM_TYPES.BOARD,
      bio: "Guides governance and sustainable execution standards.",
      photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
      portfolioUrl: "https://board.example.com/pratima-poudel",
      socials: {
        facebook: "https://facebook.com/pratima.poudel.board",
        instagram: "https://instagram.com/pratima.poudel",
        linkedin: "https://linkedin.com/in/pratima-poudel",
      },
      order: 2,
    },
  ];

  for (const member of members) {
    await TeamMemberModel.findOneAndUpdate(
      { name: member.name, roleTitle: member.roleTitle, type: member.type },
      member,
      { upsert: true, new: true },
    );
  }
}

async function seedCollaborations() {
  const collaborations = [
    {
      name: "Alpha Edu",
      logoUrl: "https://dummyimage.com/300x120/1f4a8f/ffffff.png&text=Alpha+Edu",
      websiteUrl: "https://alphaedu.example.com",
      note: "Education platform partner for enrollment and digital branding.",
      order: 1,
    },
    {
      name: "Greenline Foods",
      logoUrl: "https://dummyimage.com/300x120/2f855a/ffffff.png&text=Greenline+Foods",
      websiteUrl: "https://greenlinefoods.example.com",
      note: "Digital growth collaboration for campaigns and e-commerce visibility.",
      order: 2,
    },
    {
      name: "Nexus Real Estate",
      logoUrl: "https://dummyimage.com/300x120/7b3f00/ffffff.png&text=Nexus+Real+Estate",
      websiteUrl: "https://nexusrealestate.example.com",
      note: "Website redesign, content optimization, and lead capture funnel.",
      order: 3,
    },
  ];

  for (const item of collaborations) {
    await CollaborationModel.findOneAndUpdate({ name: item.name }, item, { upsert: true, new: true });
  }
}

async function seedPricing() {
  const plans = [
    {
      name: "SILVER",
      price: 30000,
      startingFrom: true,
      note: "Best for startups",
      features: ["Basic website", "3 pages", "Basic SEO setup", "1 month support"],
      highlighted: false,
      ctaLabel: "Start with Silver",
      ctaLink: "/contact",
      order: 1,
    },
    {
      name: "GOLD",
      price: 65000,
      startingFrom: true,
      note: "Best for growing businesses",
      features: ["Advanced website", "CMS integration", "Performance optimization", "3 months support"],
      highlighted: true,
      ctaLabel: "Choose Gold",
      ctaLink: "/contact",
      order: 2,
    },
    {
      name: "DIAMOND",
      price: 120000,
      startingFrom: true,
      note: "Best for scale",
      features: ["Custom web app", "Automation", "Priority support", "6 months support"],
      highlighted: false,
      ctaLabel: "Talk to Sales",
      ctaLink: "/contact",
      order: 3,
    },
  ];

  for (const plan of plans) {
    await PricingPlanModel.findOneAndUpdate({ name: plan.name }, plan, { upsert: true, new: true });
  }
}

async function seedTestimonials() {
  const testimonials = [
    {
      name: "Bikash Adhikari",
      roleCompany: "Owner, Everest Fitness Club",
      message: "WebMitra.Tech delivered clean execution and measurable business impact.",
      rating: 5,
      visible: true,
      order: 1,
      seo: {
        metaTitle: "Client Testimonial: Everest Fitness Club",
        metaDescription: "Feedback highlighting delivery quality and business impact from WebMitra.Tech.",
        metaKeywords: ["client testimonial", "web agency review"],
        canonicalUrl: "https://webmitra.tech/",
        ogImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      },
    },
    {
      name: "Nisha Sharma",
      roleCompany: "Marketing Lead, Greenline Foods",
      message: "The team is responsive and technically strong. Great collaboration experience.",
      rating: 5,
      visible: true,
      order: 2,
      seo: {
        metaTitle: "Client Testimonial: Greenline Foods",
        metaDescription: "Collaboration experience and technical quality feedback for WebMitra.Tech.",
        metaKeywords: ["client review", "digital agency testimonial"],
        canonicalUrl: "https://webmitra.tech/",
        ogImageUrl: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80",
      },
    },
  ];

  for (const item of testimonials) {
    await TestimonialModel.findOneAndUpdate({ name: item.name, roleCompany: item.roleCompany }, item, {
      upsert: true,
      new: true,
    });
  }
}

async function seedInquiries() {
  const inquiries = [
    {
      name: "Prakash Gautam",
      email: "prakash.gautam@example.com",
      phone: "+977 9801112233",
      subject: "Need social media growth plan",
      message:
        "We run a local retail business in Butwal and want monthly social media management with campaign reporting.",
      status: INQUIRY_STATUS.NEW,
      ip: "103.12.45.21",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0",
    },
    {
      name: "Sita Adhikari",
      email: "sita.adhikari@example.com",
      phone: "+977 9814455667",
      subject: "Website redesign and SEO",
      message:
        "We need a complete redesign for our current website with technical SEO improvements and lead tracking integration.",
      status: INQUIRY_STATUS.READ,
      ip: "202.51.74.10",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
    },
    {
      name: "Ritesh Sharma",
      email: "ritesh.sharma@example.com",
      phone: "+977 9840011223",
      subject: "Custom web app with admin panel",
      message:
        "Looking for a custom business portal with role-based admin features, reports, and secure authentication.",
      status: INQUIRY_STATUS.ARCHIVED,
      ip: "110.44.116.90",
      userAgent: "Mozilla/5.0 (Linux; Android 13) Chrome/123.0 Mobile",
    },
  ];

  for (const item of inquiries) {
    await InquiryModel.findOneAndUpdate(
      { email: item.email, subject: item.subject },
      item,
      { upsert: true, new: true },
    );
  }
}

async function seedFailedAttempts() {
  const attempts = [
    {
      type: FAILED_ATTEMPT_TYPE.LOGIN,
      ip: "203.45.61.22",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/124.0",
      reason: "Invalid password for admin account",
    },
    {
      type: FAILED_ATTEMPT_TYPE.LOGIN,
      ip: "203.45.61.22",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/124.0",
      reason: "Too many login attempts",
    },
    {
      type: FAILED_ATTEMPT_TYPE.CONTACT,
      ip: "180.211.162.54",
      userAgent: "curl/8.6.0",
      reason: "Honeypot field detected in contact submission",
    },
  ];

  for (const item of attempts) {
    await FailedAttemptModel.findOneAndUpdate(
      { type: item.type, ip: item.ip, reason: item.reason },
      item,
      { upsert: true, new: true },
    );
  }
}

async function runSeed() {
  await connectDatabase();
  await dropLegacyIdIndexes();

  await seedSiteSettings();
  await seedAdminUser();
  await seedEditorUsers();
  await seedServices();
  await seedProjects();
  await seedTeam();
  await seedCollaborations();
  await seedPricing();
  await seedTestimonials();
  await seedInquiries();
  await seedFailedAttempts();

  logger.info("Seed completed successfully");
  await disconnectDatabase();
}

if (require.main === module) {
  runSeed().catch(async (error) => {
    logger.error("Seed failed", error instanceof Error ? error.message : error);
    await disconnectDatabase();
    process.exit(1);
  });
}
