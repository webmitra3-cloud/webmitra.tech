import { CookieOptions } from "express";
import { env } from "../config/env";

// Render env vars required for cross-site cookies:
// - NODE_ENV=production
// - CLIENT_ORIGIN=https://webmitra-tech-web.vercel.app
// - CSRF_COOKIE_NAME=wm_csrf
// - REFRESH_COOKIE_NAME=wm_refresh

const nodeEnv = (process.env.NODE_ENV || env.NODE_ENV).toLowerCase();
const isRuntimeProduction = nodeEnv === "production";
function getCommonCookieOptions(): CookieOptions {
  return {
    // Render API + Vercel frontend are cross-site in production.
    // Browsers require SameSite=None + Secure=true for cross-site cookies.
    sameSite: isRuntimeProduction ? "none" : "lax",
    secure: isRuntimeProduction ? true : false,
    // Do not set cookie domain for Render/Vercel cross-domain setup.
    // Host-only cookies are the safest default here.
    domain: undefined,
    path: "/",
  };
}

export function getRefreshCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    ...getCommonCookieOptions(),
    httpOnly: true,
    maxAge: maxAgeMs,
  };
}

export function getCsrfCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    ...getCommonCookieOptions(),
    httpOnly: false,
    maxAge: maxAgeMs,
  };
}

export function getClearCookieOptions(): CookieOptions {
  return {
    ...getCommonCookieOptions(),
    httpOnly: true,
    expires: new Date(0),
  };
}
