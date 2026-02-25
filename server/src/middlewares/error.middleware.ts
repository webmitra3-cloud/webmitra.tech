import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const errorRecord = (error || {}) as {
    message?: string;
    status?: number;
    statusCode?: number;
    type?: string;
  };

  if (error instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      ok: false,
      message: error.message,
    });
  }

  if (errorRecord.type === "entity.too.large" || errorRecord.status === 413 || errorRecord.statusCode === 413) {
    return res.status(413).json({
      ok: false,
      message: "Request body too large",
    });
  }

  if (typeof errorRecord.statusCode === "number" && errorRecord.statusCode >= 400 && errorRecord.statusCode < 500) {
    return res.status(errorRecord.statusCode).json({
      ok: false,
      message: errorRecord.message || "Request failed",
    });
  }

  logger.error("Unhandled server error", error instanceof Error ? error.message : String(error));
  return res.status(500).json({
    ok: false,
    message: "Internal server error",
  });
}
