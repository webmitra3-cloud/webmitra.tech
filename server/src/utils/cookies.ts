import { CookieOptions } from "express";
import { env, isProduction } from "../config/env";

const cookieDomain = process.env.COOKIE_DOMAIN || env.COOKIE_DOMAIN;
const nodeEnv = process.env.NODE_ENV || env.NODE_ENV;
const isCrossSiteDeployment = nodeEnv === "production";

// Render API + Vercel frontend are cross-site.
// Browsers require SameSite=None + Secure=true for cross-site cookies.
const commonCookieOptions: CookieOptions = {
  sameSite: isCrossSiteDeployment ? "none" : "lax",
  secure: isCrossSiteDeployment ? true : isProduction,
  domain: cookieDomain || undefined,
  path: "/",
};

export function getRefreshCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    ...commonCookieOptions,
    httpOnly: true,
    maxAge: maxAgeMs,
  };
}

export function getCsrfCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    ...commonCookieOptions,
    httpOnly: false,
    maxAge: maxAgeMs,
  };
}

export function getClearCookieOptions(): CookieOptions {
  return {
    ...commonCookieOptions,
    httpOnly: true,
    expires: new Date(0),
  };
}
