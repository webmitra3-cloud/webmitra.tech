import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/webmitra"),
  // Supports one or more origins separated by comma.
  // Example: https://webmitra-tech-web.vercel.app,https://webmitra-tech-web-git-main-*.vercel.app
  CLIENT_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  COOKIE_DOMAIN: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(16).default("dev-access-secret-change-this-12345"),
  JWT_REFRESH_SECRET: z.string().min(16).default("dev-refresh-secret-change-this-67890"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  REFRESH_COOKIE_NAME: z.string().default("wm_refresh"),
  CSRF_COOKIE_NAME: z.string().default("wm_csrf"),
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  ADMIN_SEED_EMAIL: z.string().email().default("admin@webmitra.tech"),
  ADMIN_SEED_PASSWORD: z.string().min(8).default("Admin@12345"),
  RESEND_API_KEY: z.string().min(1).default("re_xxxxxxxxx"),
  MAIL_FROM: z.string().default("WebMitra.Tech <no-reply@webmitra.tech>"),
  MAIL_TO: z.string().email().default("webmitra3@gmail.com"),
  AUTO_REPLY_ENABLED: z
    .string()
    .optional()
    .default("true")
    .transform((value) => value.toLowerCase() === "true"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  LOCAL_UPLOAD_BASE_URL: z.string().url().default("http://localhost:5000/uploads"),
  WHATSAPP_NUMBER: z.string().default("9779869672736"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${errors}`);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";
