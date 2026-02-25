import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export function requireCsrf(req: Request, _res: Response, next: NextFunction) {
  const csrfCookieName = env.CSRF_COOKIE_NAME || "wm_csrf";
  const cookieToken = req.cookies?.[csrfCookieName];
  const headerToken = req.headers["x-csrf-token"];
  const isWriteMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  const hasCookie = Boolean(cookieToken);
  const hasHeader = Boolean(headerToken && (!Array.isArray(headerToken) || headerToken.length > 0));

  if (!isWriteMethod) {
    return next();
  }

  if (!cookieToken) {
    logger.warn("CSRF validation failed: cookie missing", {
      route: req.originalUrl,
      method: req.method,
      ip: req.ip,
      origin: req.headers.origin || "",
      cookieName: csrfCookieName,
      hasCookie,
      hasHeader,
    });
    return next(new AppError("CSRF cookie missing. Please refresh and try again.", 403));
  }

  if (!headerToken || (Array.isArray(headerToken) && headerToken.length === 0)) {
    logger.warn("CSRF validation failed: header missing", {
      route: req.originalUrl,
      method: req.method,
      ip: req.ip,
      origin: req.headers.origin || "",
      headerName: "X-CSRF-Token",
      hasCookie,
      hasHeader,
    });
    return next(new AppError("CSRF token missing. Please refresh and try again.", 403));
  }

  const headerValue = Array.isArray(headerToken) ? headerToken[0] : headerToken;
  if (!headerValue || cookieToken !== headerValue) {
    logger.warn("CSRF validation failed: token invalid", {
      route: req.originalUrl,
      method: req.method,
      ip: req.ip,
      origin: req.headers.origin || "",
      hasCookie,
      hasHeader,
    });
    return next(new AppError("CSRF token invalid. Please refresh and try again.", 403));
  }

  next();
}
