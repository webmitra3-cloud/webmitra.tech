import { Request, Response } from "express";
import { env } from "../config/env";
import { UserModel } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { getClearCookieOptions, getCsrfCookieOptions, getRefreshCookieOptions } from "../utils/cookies";
import { generateCsrfToken } from "../utils/csrf";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { compareHash, hashValue } from "../utils/password";
import { parseDurationToMs } from "../utils/time";
import { logFailedAttempt } from "../services/audit.service";
import { FAILED_ATTEMPT_TYPE } from "../constants";
import { logger } from "../utils/logger";

const refreshTokenMaxAge = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);

async function issueSession(res: Response, user: { userId: string; role: string }) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const csrfToken = generateCsrfToken();

  await UserModel.findByIdAndUpdate(user.userId, { refreshTokenHash: await hashValue(refreshToken) });

  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions(refreshTokenMaxAge));
  res.cookie(env.CSRF_COOKIE_NAME, csrfToken, getCsrfCookieOptions(refreshTokenMaxAge));

  return { accessToken, csrfToken };
}

export const getCsrf = asyncHandler(async (req: Request, res: Response) => {
  try {
    const csrfToken = generateCsrfToken();
    res.cookie(env.CSRF_COOKIE_NAME, csrfToken, getCsrfCookieOptions(refreshTokenMaxAge));
    res.json({ ok: true, csrfToken });
  } catch (error) {
    logger.error("Failed to initialize CSRF cookie", {
      route: "/api/auth/csrf",
      ip: req.ip,
      origin: req.headers.origin || "",
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError("Failed to initialize CSRF protection", 500);
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email: rawEmail, password } = req.body as { email: string; password: string };
  const email = rawEmail.trim().toLowerCase();
  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user || !(await compareHash(password, user.passwordHash))) {
    await logFailedAttempt({
      type: FAILED_ATTEMPT_TYPE.LOGIN,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      reason: "Invalid email or password",
    });
    throw new AppError("Invalid email or password", 401);
  }

  const session = await issueSession(res, { userId: user.id, role: user.role });
  res.json({
    user: {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: session.accessToken,
    csrfToken: session.csrfToken,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    logger.warn("Refresh failed: cookie missing", {
      route: "/api/auth/refresh",
      cookieName: env.REFRESH_COOKIE_NAME,
      hasRefreshCookie: false,
      ip: req.ip,
      origin: req.headers.origin || "",
    });
    throw new AppError("Missing refresh token", 401);
  }

  let payload: { userId: string; role: string };
  try {
    const decoded = verifyRefreshToken(refreshToken);
    payload = { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    logger.warn("Refresh failed: token verification failed", {
      route: "/api/auth/refresh",
      cookieName: env.REFRESH_COOKIE_NAME,
      hasRefreshCookie: true,
      ip: req.ip,
      origin: req.headers.origin || "",
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await UserModel.findById(payload.userId).select("+refreshTokenHash");
  if (!user || !user.refreshTokenHash || !(await compareHash(refreshToken, user.refreshTokenHash))) {
    logger.warn("Refresh failed: token rejected for user", {
      route: "/api/auth/refresh",
      cookieName: env.REFRESH_COOKIE_NAME,
      hasRefreshCookie: true,
      userId: payload.userId,
      ip: req.ip,
      origin: req.headers.origin || "",
    });
    throw new AppError("Refresh token rejected", 401);
  }

  const session = await issueSession(res, payload);
  res.json({
    accessToken: session.accessToken,
    csrfToken: session.csrfToken,
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new AppError("Unauthorized", 401);
  const user = await UserModel.findById(req.user.userId);
  if (!user) throw new AppError("User not found", 404);
  res.json({ user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      await UserModel.findByIdAndUpdate(decoded.userId, { refreshTokenHash: "" });
    } catch (error) {
      // Ignore invalid refresh token during logout and continue clearing cookies.
    }
  }

  res.clearCookie(env.REFRESH_COOKIE_NAME, getClearCookieOptions());
  res.clearCookie(env.CSRF_COOKIE_NAME, {
    ...getClearCookieOptions(),
    httpOnly: false,
  });
  res.json({ message: "Logged out successfully" });
});
