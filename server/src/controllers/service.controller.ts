import { Request, Response } from "express";
import { ServiceModel } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { slugify } from "../utils/slug";
import { buildListQuery } from "./helpers";

export const getPublicServices = asyncHandler(async (_req: Request, res: Response) => {
  const items = await ServiceModel.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

export const listServices = asyncHandler(async (req: Request, res: Response) => {
  const { filter, sort, limit, skip, page } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["title", "description"],
    defaultSort: { order: 1, createdAt: -1 },
  });

  const [items, total] = await Promise.all([
    ServiceModel.find(filter).sort(sort).skip(skip).limit(limit),
    ServiceModel.countDocuments(filter),
  ]);

  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as {
    title: string;
    slug?: string;
    description: string;
    icon: string;
    featured: boolean;
    order: number;
  };
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);

  const existing = await ServiceModel.findOne({ slug });
  if (existing) throw new AppError("Service slug already exists", 409);

  const created = await ServiceModel.create({ ...payload, slug });
  res.status(201).json(created);
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as {
    title: string;
    slug?: string;
    description: string;
    icon: string;
    featured: boolean;
    order: number;
  };
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);

  const existingSlug = await ServiceModel.findOne({ slug, _id: { $ne: id } });
  if (existingSlug) throw new AppError("Service slug already exists", 409);

  const updated = await ServiceModel.findByIdAndUpdate(id, { ...payload, slug }, { new: true });
  if (!updated) throw new AppError("Service not found", 404);
  res.json(updated);
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await ServiceModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Service not found", 404);
  res.json({ message: "Service deleted" });
});
