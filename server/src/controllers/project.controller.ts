import { FilterQuery } from "mongoose";
import { Request, Response } from "express";
import { ProjectModel } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { slugify } from "../utils/slug";
import { buildListQuery } from "./helpers";

type ProjectFilter = {
  tags?: { $in: string[] };
  featured?: boolean;
  $or?: Array<Record<string, unknown>>;
};

export const getPublicProjects = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip, sort } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["title", "summary", "tags"],
    defaultSort: { featured: -1, createdAt: -1 },
  });

  const filter: FilterQuery<ProjectFilter> = {};
  if (typeof req.query.tag === "string" && req.query.tag.trim()) {
    filter.tags = { $in: [req.query.tag.trim()] };
  }
  if (req.query.featured === "true") {
    filter.featured = true;
  }

  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    ProjectModel.find(filter).sort(sort).skip(skip).limit(limit),
    ProjectModel.countDocuments(filter),
  ]);

  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const getPublicProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const project = await ProjectModel.findOne({ slug: req.params.slug });
  if (!project) throw new AppError("Project not found", 404);
  res.json(project);
});

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const { filter, sort, limit, skip, page } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["title", "summary", "tags"],
    defaultSort: { featured: -1, createdAt: -1 },
  });
  const [items, total] = await Promise.all([
    ProjectModel.find(filter).sort(sort).skip(skip).limit(limit),
    ProjectModel.countDocuments(filter),
  ]);
  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as { title: string; slug?: string };
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  const existing = await ProjectModel.findOne({ slug });
  if (existing) throw new AppError("Project slug already exists", 409);
  const created = await ProjectModel.create({ ...req.body, slug });
  res.status(201).json(created);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body as { title: string; slug?: string };
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
  const existingSlug = await ProjectModel.findOne({ slug, _id: { $ne: id } });
  if (existingSlug) throw new AppError("Project slug already exists", 409);
  const updated = await ProjectModel.findByIdAndUpdate(id, { ...req.body, slug }, { new: true });
  if (!updated) throw new AppError("Project not found", 404);
  res.json(updated);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await ProjectModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Project not found", 404);
  res.json({ message: "Project deleted" });
});
