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
import { logger } from "./utils/logger";

const app = express();
const clientOriginEnv = process.env.CLIENT_ORIGIN || env.CLIENT_ORIGIN;

type OriginRule =
  | { type: "exact"; value: string }
  | { type: "wildcard"; protocol: "http" | "https"; hostSuffix: string };

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, "").toLowerCase();
}

function parseOriginRule(origin: string): OriginRule | null {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return null;

  const wildcardMatch = normalized.match(/^(https?):\/\/\*\.(.+)$/);
  if (wildcardMatch) {
    const [, protocol, suffix] = wildcardMatch;
    return { type: "wildcard", protocol: protocol as "http" | "https", hostSuffix: `.${suffix}` };
  }

  return { type: "exact", value: normalized };
}

function isOriginAllowed(origin: string, rules: OriginRule[]) {
  const normalized = normalizeOrigin(origin);

  if (rules.some((rule) => rule.type === "exact" && rule.value === normalized)) {
    return true;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return false;
  }

  return rules.some((rule) => {
    if (rule.type !== "wildcard") return false;
    const protocolMatches = parsed.protocol === `${rule.protocol}:`;
    const hostMatches = parsed.hostname === rule.hostSuffix.slice(1) || parsed.hostname.endsWith(rule.hostSuffix);
    return protocolMatches && hostMatches;
  });
}

const allowedOriginRules = clientOriginEnv
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(parseOriginRule)
  .filter((rule): rule is OriginRule => Boolean(rule));

// Render runs behind a reverse proxy, and secure cookies / real client IPs rely on trusting it.
app.set("trust proxy", 1);

const corsOptions: CorsOptions = {
  // Vercel frontend origin(s) configured via CLIENT_ORIGIN.
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (isOriginAllowed(origin, allowedOriginRules)) return callback(null, true);

    logger.warn("CORS blocked origin", { origin, configuredOrigins: clientOriginEnv });
    // Do not throw an error here; just omit CORS headers so browser blocks it.
    return callback(null, false);
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
