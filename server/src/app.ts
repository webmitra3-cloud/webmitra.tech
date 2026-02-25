import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { sanitizeInput } from "./middlewares/sanitize.middleware";
import apiRoutes from "./routes";

const app = express();
const clientOriginEnv = process.env.CLIENT_ORIGIN || env.CLIENT_ORIGIN;
const allowedOrigins = clientOriginEnv
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(sanitizeInput);

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
