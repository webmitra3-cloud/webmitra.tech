import { Request, Response } from "express";
import { TeamMemberModel } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildListQuery } from "./helpers";

export const getPublicTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const type = typeof req.query.type === "string" ? req.query.type : undefined;
  const query = type ? { type } : {};
  const items = await TeamMemberModel.find(query).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

export const listTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const type = typeof req.query.type === "string" ? req.query.type : undefined;
  const { filter, sort, limit, skip, page } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["name", "roleTitle", "bio", "portfolioUrl"],
    defaultSort: { type: 1, order: 1, createdAt: -1 },
  });

  if (type) filter.type = type;

  const [items, total] = await Promise.all([
    TeamMemberModel.find(filter).sort(sort).skip(skip).limit(limit),
    TeamMemberModel.countDocuments(filter),
  ]);

  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const createTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const created = await TeamMemberModel.create(req.body);
  res.status(201).json(created);
});

export const updateTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const updated = await TeamMemberModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) throw new AppError("Member not found", 404);
  res.json(updated);
});

export const deleteTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await TeamMemberModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Member not found", 404);
  res.json({ message: "Member deleted" });
});
