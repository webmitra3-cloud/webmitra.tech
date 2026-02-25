import { Request, Response } from "express";
import { SiteSettingsModel } from "../models";
import { asyncHandler } from "../utils/asyncHandler";

function stripLegacyBgRemovalTransform(url: string) {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;

  return url
    .replace("/image/upload/e_background_removal/f_png/", "/image/upload/")
    .replace("/image/upload/f_png/e_background_removal/", "/image/upload/")
    .replace("/image/upload/e_background_removal/", "/image/upload/");
}

export const getSiteSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await SiteSettingsModel.findOne().sort({ createdAt: 1 });
  res.json(settings);
});

export const upsertSiteSettings = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as Record<string, unknown>;
  if (typeof payload.logoUrl === "string") {
    payload.logoUrl = stripLegacyBgRemovalTransform(payload.logoUrl);
  }
  const existing = await SiteSettingsModel.findOne();

  if (!existing) {
    const created = await SiteSettingsModel.create(payload);
    return res.status(201).json(created);
  }

  Object.assign(existing, payload);
  await existing.save();
  return res.json(existing);
});
