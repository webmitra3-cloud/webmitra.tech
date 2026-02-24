import { Request, Response } from "express";
import { CollaborationModel } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildListQuery } from "./helpers";

export const getPublicCollaborations = asyncHandler(async (_req: Request, res: Response) => {
  const items = await CollaborationModel.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
});

export const listCollaborations = asyncHandler(async (req: Request, res: Response) => {
  const { filter, sort, limit, skip, page } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["name", "note"],
    defaultSort: { order: 1, createdAt: -1 },
  });
  const [items, total] = await Promise.all([
    CollaborationModel.find(filter).sort(sort).skip(skip).limit(limit),
    CollaborationModel.countDocuments(filter),
  ]);
  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const createCollaboration = asyncHandler(async (req: Request, res: Response) => {
  const created = await CollaborationModel.create(req.body);
  res.status(201).json(created);
});

export const updateCollaboration = asyncHandler(async (req: Request, res: Response) => {
  const updated = await CollaborationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) throw new AppError("Collaboration not found", 404);
  res.json(updated);
});

export const deleteCollaboration = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await CollaborationModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Collaboration not found", 404);
  res.json({ message: "Collaboration deleted" });
});
