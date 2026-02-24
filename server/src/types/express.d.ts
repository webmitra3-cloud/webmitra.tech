import { ROLES } from "../constants";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: (typeof ROLES)[keyof typeof ROLES];
      };
    }
  }
}

export {};
