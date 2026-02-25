import { Resend } from "resend";
import { env } from "./env";
import { logger } from "../utils/logger";
import { AppError } from "../utils/AppError";

const hasPlaceholderKey = env.RESEND_API_KEY === "re_xxxxxxxxx";

export const resend = new Resend(env.RESEND_API_KEY);

export async function verifyMailerConnection() {
  try {
    if (hasPlaceholderKey) {
      logger.warn("RESEND_API_KEY is using placeholder value. Replace 're_xxxxxxxxx' with your real API key.");
      return;
    }
    logger.info("Resend email provider configured");
  } catch (error) {
    logger.warn("Mail provider verification failed", error instanceof Error ? error.message : String(error));
  }
}

export function ensureResendConfigured() {
  if (hasPlaceholderKey) {
    throw new AppError("Email service is not configured. Set RESEND_API_KEY.", 503);
  }
}
