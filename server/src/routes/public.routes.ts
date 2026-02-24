import { Router } from "express";
import { getPublicCollaborations } from "../controllers/collaboration.controller";
import { submitContact } from "../controllers/contact.controller";
import { getPublicPricingPlans } from "../controllers/pricing.controller";
import { getHomepageData } from "../controllers/public.controller";
import { getPublicProjectBySlug, getPublicProjects } from "../controllers/project.controller";
import { getSiteSettings } from "../controllers/settings.controller";
import { getPublicServices } from "../controllers/service.controller";
import { getPublicTeamMembers } from "../controllers/team.controller";
import { getPublicTestimonials, submitPublicTestimonial } from "../controllers/testimonial.controller";
import { contactRateLimiter, testimonialRateLimiter } from "../middlewares/rateLimit.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createInquirySchema } from "../validations/inquiry.validation";
import { createPublicTestimonialSchema } from "../validations/testimonial.validation";

const router = Router();

router.get("/homepage", getHomepageData);
router.get("/settings", getSiteSettings);
router.get("/services", getPublicServices);
router.get("/projects", getPublicProjects);
router.get("/projects/:slug", getPublicProjectBySlug);
router.get("/team", getPublicTeamMembers);
router.get("/collaborations", getPublicCollaborations);
router.get("/pricing", getPublicPricingPlans);
router.get("/testimonials", getPublicTestimonials);
router.post("/testimonials", testimonialRateLimiter, validateBody(createPublicTestimonialSchema), submitPublicTestimonial);
router.post("/inquiries", contactRateLimiter, validateBody(createInquirySchema), submitContact);

export default router;
