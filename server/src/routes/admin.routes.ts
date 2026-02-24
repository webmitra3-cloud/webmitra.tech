import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import {
  createCollaboration,
  deleteCollaboration,
  listCollaborations,
  updateCollaboration,
} from "../controllers/collaboration.controller";
import { deleteInquiry, listInquiries, updateInquiryStatus } from "../controllers/inquiry.controller";
import {
  createOrUpdatePricingPlan,
  deletePricingPlan,
  listPricingPlans,
  updatePricingPlan,
} from "../controllers/pricing.controller";
import { createProject, deleteProject, listProjects, updateProject } from "../controllers/project.controller";
import { getSiteSettings, upsertSiteSettings } from "../controllers/settings.controller";
import { createService, deleteService, listServices, updateService } from "../controllers/service.controller";
import { createTeamMember, deleteTeamMember, listTeamMembers, updateTeamMember } from "../controllers/team.controller";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  updateTestimonial,
} from "../controllers/testimonial.controller";
import { uploadImageController } from "../controllers/upload.controller";
import { createUser, deleteUser, listUsers, updateUser } from "../controllers/user.controller";
import { ROLES } from "../constants";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { requireCsrf } from "../middlewares/csrf.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "../validations/auth.validation";
import { collaborationSchema } from "../validations/collaboration.validation";
import { updateInquiryStatusSchema } from "../validations/inquiry.validation";
import { pricingPlanSchema } from "../validations/pricing.validation";
import { projectSchema } from "../validations/project.validation";
import { siteSettingsSchema } from "../validations/settings.validation";
import { serviceSchema } from "../validations/service.validation";
import { teamMemberSchema } from "../validations/team.validation";
import { testimonialSchema } from "../validations/testimonial.validation";
import { z } from "zod";

const router = Router();

router.use(requireAuth);
router.use(requireCsrf);

router.get("/dashboard", getDashboardStats);

router.get("/settings", getSiteSettings);
router.put("/settings", validateBody(siteSettingsSchema), upsertSiteSettings);

router.get("/services", listServices);
router.post("/services", validateBody(serviceSchema), createService);
router.put("/services/:id", validateBody(serviceSchema), updateService);
router.delete("/services/:id", deleteService);

router.get("/projects", listProjects);
router.post("/projects", validateBody(projectSchema), createProject);
router.put("/projects/:id", validateBody(projectSchema), updateProject);
router.delete("/projects/:id", deleteProject);

router.get("/team", listTeamMembers);
router.post("/team", validateBody(teamMemberSchema), createTeamMember);
router.put("/team/:id", validateBody(teamMemberSchema), updateTeamMember);
router.delete("/team/:id", deleteTeamMember);

router.get("/board", (req, _res, next) => {
  req.query.type = "BOARD";
  next();
}, listTeamMembers);

router.get("/collaborations", listCollaborations);
router.post("/collaborations", validateBody(collaborationSchema), createCollaboration);
router.put("/collaborations/:id", validateBody(collaborationSchema), updateCollaboration);
router.delete("/collaborations/:id", deleteCollaboration);

router.get("/pricing", listPricingPlans);
router.post("/pricing", validateBody(pricingPlanSchema), createOrUpdatePricingPlan);
router.put("/pricing/:id", validateBody(pricingPlanSchema), updatePricingPlan);
router.delete("/pricing/:id", deletePricingPlan);

router.get("/inquiries", listInquiries);
router.put("/inquiries/:id/status", validateBody(updateInquiryStatusSchema), updateInquiryStatus);
router.delete("/inquiries/:id", deleteInquiry);

router.get("/testimonials", listTestimonials);
router.post("/testimonials", validateBody(testimonialSchema), createTestimonial);
router.put("/testimonials/:id", validateBody(testimonialSchema), updateTestimonial);
router.delete("/testimonials/:id", deleteTestimonial);

router.post(
  "/upload",
  validateBody(
    z.object({
      image: z.string().min(1),
      folder: z.string().optional(),
      removeBackground: z.boolean().optional(),
    }),
  ),
  uploadImageController,
);

router.get("/users", requireRole([ROLES.ADMIN]), listUsers);
router.post("/users", requireRole([ROLES.ADMIN]), validateBody(createUserSchema), createUser);
router.put("/users/:id", requireRole([ROLES.ADMIN]), validateBody(updateUserSchema), updateUser);
router.delete("/users/:id", requireRole([ROLES.ADMIN]), deleteUser);

export default router;
