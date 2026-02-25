import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export function requireCsrf(req: Request, _res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[env.CSRF_COOKIE_NAME];
  const headerToken = req.headers["x-csrf-token"];
  const isWriteMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (!isWriteMethod) {
    return next();
  }

  if (!cookieToken) {
    return next(new AppError("CSRF cookie missing. Please refresh and try again.", 403));
  }

  if (!headerToken || (Array.isArray(headerToken) && headerToken.length === 0)) {
    return next(new AppError("CSRF token missing in X-CSRF-Token header.", 403));
  }

  const headerValue = Array.isArray(headerToken) ? headerToken[0] : headerToken;
  if (!headerValue || cookieToken !== headerValue) {
    return next(new AppError("CSRF token mismatch. Please refresh and try again.", 403));
  }

  next();
}
