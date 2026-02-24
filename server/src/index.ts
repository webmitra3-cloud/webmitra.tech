import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { verifyMailerConnection } from "./config/mailer";
import app from "./app";
import { logger } from "./utils/logger";

async function bootstrap() {
  await connectDatabase();
  await verifyMailerConnection();
  app.listen(env.PORT, () => {
    logger.info(`Server listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start server", error instanceof Error ? error.message : error);
  process.exit(1);
});
