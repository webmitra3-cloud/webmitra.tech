import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import { uploadsDir } from "./config/uploads";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { sanitizeInput } from "./middlewares/sanitize.middleware";
import apiRoutes from "./routes";

const app = express();
const clientOriginEnv = process.env.CLIENT_ORIGIN || env.CLIENT_ORIGIN;
const allowedOrigins = clientOriginEnv
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => origin.replace(/\/+$/, ""));

// Render runs behind a reverse proxy, and secure cookies / real client IPs rely on trusting it.
app.set("trust proxy", 1);

const corsOptions: CorsOptions = {
  // Vercel frontend origin(s) configured via CLIENT_ORIGIN.
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, "");
    if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  optionsSuccessStatus: 204,
};

// CORS must be applied before routes so every API response includes the correct headers.
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(morgan("dev"));

// Admin uploads send base64 payloads that are much larger than normal API JSON bodies.
// Keep the global body limit strict, but allow a larger limit only for this route.
app.use("/api/admin/upload", express.json({ limit: "15mb" }));
app.use("/api/admin/upload", express.urlencoded({ extended: true, limit: "15mb" }));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(sanitizeInput);

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.use("/uploads", express.static(path.resolve(uploadsDir)));
app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
