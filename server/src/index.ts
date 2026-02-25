import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { verifyMailerConnection } from "./config/mailer";
import { seedAdminIfNotExists } from "./scripts/seed";
import app from "./app";
import { logger } from "./utils/logger";

// Render settings:
// Build Command: npm run build -w server
// Start Command: npm run start -w server
// Health Check Path: /healthz
async function bootstrap() {
  const port = Number(process.env.PORT) || env.PORT || 5000;
  const host = "0.0.0.0";

  await connectDatabase();
  if (env.NODE_ENV === "production") {
    try {
      await seedAdminIfNotExists();
    } catch (error) {
      logger.warn("Admin startup seed failed. Continuing startup.", error instanceof Error ? error.message : String(error));
    }
  }
  try {
    await verifyMailerConnection();
  } catch (error) {
    logger.warn("Mail provider verification failed. Continuing startup.", error instanceof Error ? error.message : String(error));
  }

  app.listen(port, host, () => {
    logger.info(`API server is running on ${host}:${port}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start server", error instanceof Error ? error.message : error);
  process.exit(1);
});
