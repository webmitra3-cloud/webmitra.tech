import { CookieOptions } from "express";
import { env } from "../config/env";
import { logger } from "./logger";

// Render env vars required for cross-site cookies:
// - NODE_ENV=production
// - CLIENT_ORIGIN=https://webmitra-tech-web.vercel.app
// - COOKIE_DOMAIN=<your backend cookie domain or leave empty for host-only cookies>
// - CSRF_COOKIE_NAME=wm_csrf
// - REFRESH_COOKIE_NAME=wm_refresh
type CookieOptionOverrides = {
  omitDomain?: boolean;
};

const nodeEnv = (process.env.NODE_ENV || env.NODE_ENV).toLowerCase();
const isRuntimeProduction = nodeEnv === "production";
let hasLoggedCookieDomainWarning = false;

function logCookieDomainWarning(message: string) {
  if (hasLoggedCookieDomainWarning) return;
  hasLoggedCookieDomainWarning = true;
  logger.warn(message);
}

function getConfiguredCookieDomain(): string | undefined {
  if (!isRuntimeProduction) return undefined;

  const rawDomain = (process.env.COOKIE_DOMAIN || env.COOKIE_DOMAIN || "").trim();
  if (!rawDomain) {
    logCookieDomainWarning(
      "COOKIE_DOMAIN is not set in production. Cookies will be set without domain (host-only).",
    );
    return undefined;
  }

  // Accept standard cookie domain format (optional leading dot, no protocol/path/port).
  const isValidDomain = /^\.?[a-zA-Z0-9.-]+$/.test(rawDomain) && !rawDomain.includes("..");
  if (!isValidDomain) {
    logCookieDomainWarning(
      `COOKIE_DOMAIN '${rawDomain}' is invalid. Cookies will be set without domain (host-only).`,
    );
    return undefined;
  }

  return rawDomain;
}

function getCommonCookieOptions(overrides?: CookieOptionOverrides): CookieOptions {
  const domain = overrides?.omitDomain ? undefined : getConfiguredCookieDomain();

  return {
    // Render API + Vercel frontend are cross-site in production.
    // Browsers require SameSite=None + Secure=true for cross-site cookies.
    sameSite: isRuntimeProduction ? "none" : "lax",
    secure: isRuntimeProduction ? true : false,
    domain,
    path: "/",
  };
}

export function getRefreshCookieOptions(maxAgeMs: number, overrides?: CookieOptionOverrides): CookieOptions {
  return {
    ...getCommonCookieOptions(overrides),
    httpOnly: true,
    maxAge: maxAgeMs,
  };
}

export function getCsrfCookieOptions(maxAgeMs: number, overrides?: CookieOptionOverrides): CookieOptions {
  return {
    ...getCommonCookieOptions(overrides),
    httpOnly: false,
    maxAge: maxAgeMs,
  };
}

export function getClearCookieOptions(overrides?: CookieOptionOverrides): CookieOptions {
  return {
    ...getCommonCookieOptions(overrides),
    httpOnly: true,
    expires: new Date(0),
  };
}
