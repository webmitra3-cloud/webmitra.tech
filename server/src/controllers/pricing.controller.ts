import { Request, Response } from "express";
import { PricingPlanModel } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildListQuery } from "./helpers";

export const getPublicPricingPlans = asyncHandler(async (_req: Request, res: Response) => {
  const plans = await PricingPlanModel.find().sort({ order: 1, createdAt: -1 });
  res.json(plans);
});

export const listPricingPlans = asyncHandler(async (req: Request, res: Response) => {
  const { filter, sort, limit, skip, page } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["name", "note"],
    defaultSort: { order: 1, createdAt: -1 },
  });
  const [items, total] = await Promise.all([
    PricingPlanModel.find(filter).sort(sort).skip(skip).limit(limit),
    PricingPlanModel.countDocuments(filter),
  ]);
  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const createOrUpdatePricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as {
    name: "SILVER" | "GOLD" | "DIAMOND";
    price: number;
    startingFrom: boolean;
    note: string;
    features: string[];
    highlighted: boolean;
    ctaLabel: string;
    ctaLink: string;
    order: number;
  };
  const plan = await PricingPlanModel.findOneAndUpdate({ name: payload.name }, payload, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  res.json(plan);
});

export const updatePricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const updated = await PricingPlanModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) throw new AppError("Pricing plan not found", 404);
  res.json(updated);
});

export const deletePricingPlan = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await PricingPlanModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Pricing plan not found", 404);
  res.json({ message: "Pricing plan deleted" });
});
