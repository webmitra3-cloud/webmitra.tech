import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Not logged in. Missing bearer token.", 401));
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId, role: payload.role as "ADMIN" | "EDITOR" };
    next();
  } catch (error) {
    return next(new AppError("Not logged in. Invalid or expired access token.", 401));
  }
}

export function requireRole(roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not logged in.", 401));
    }
    if (!roles.includes(req.user.role)) {
      const requiredRoles = roles.join(" or ");
      return next(new AppError(`Forbidden. Requires role: ${requiredRoles}.`, 403));
    }
    next();
  };
}
