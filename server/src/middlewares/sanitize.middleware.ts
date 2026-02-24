import { NextFunction, Request, Response } from "express";
import { sanitizeObject } from "../utils/sanitize";

export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query) as Request["query"];
  }
  next();
}
