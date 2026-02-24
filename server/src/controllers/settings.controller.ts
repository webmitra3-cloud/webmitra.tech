import { Request, Response } from "express";
import { SiteSettingsModel } from "../models";
import { asyncHandler } from "../utils/asyncHandler";

export const getSiteSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await SiteSettingsModel.findOne().sort({ createdAt: 1 });
  res.json(settings);
});

export const upsertSiteSettings = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;
  const existing = await SiteSettingsModel.findOne();

  if (!existing) {
    const created = await SiteSettingsModel.create(payload);
    return res.status(201).json(created);
  }

  Object.assign(existing, payload);
  await existing.save();
  return res.json(existing);
});
