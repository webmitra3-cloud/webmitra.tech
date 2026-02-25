import { Router } from "express";
import { getCsrf, login, logout, me, refresh } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireCsrf } from "../middlewares/csrf.middleware";
import { loginRateLimiter } from "../middlewares/rateLimit.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { loginSchema } from "../validations/auth.validation";

const router = Router();

router.get("/csrf", getCsrf);
router.post("/login", loginRateLimiter, validateBody(loginSchema), login);
// Refresh token endpoint uses httpOnly cookie auth and should not depend on CSRF token.
router.post("/refresh", refresh);
router.post("/logout", requireCsrf, logout);
router.get("/me", requireAuth, me);

export default router;
