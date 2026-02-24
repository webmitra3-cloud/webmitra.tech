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

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new AppError("CSRF token mismatch", 403));
  }

  next();
}
