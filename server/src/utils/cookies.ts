import { CookieOptions } from "express";
import { env, isProduction } from "../config/env";

const commonCookieOptions: CookieOptions = {
  sameSite: "lax",
  secure: isProduction,
  domain: env.COOKIE_DOMAIN,
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
