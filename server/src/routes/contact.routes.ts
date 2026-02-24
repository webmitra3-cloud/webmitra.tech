import { Router } from "express";
import { submitContact } from "../controllers/contact.controller";
import { contactRateLimiter } from "../middlewares/rateLimit.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { createInquirySchema } from "../validations/inquiry.validation";

const router = Router();

router.post("/", contactRateLimiter, validateBody(createInquirySchema), submitContact);

export default router;
