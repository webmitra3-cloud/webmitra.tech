import { Request, Response } from "express";
import { FAILED_ATTEMPT_TYPE } from "../constants";
import { FailedAttemptModel, TestimonialModel } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildListQuery } from "./helpers";

export const getPublicTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const items = await TestimonialModel.find({ visible: true }).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

export const submitPublicTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as {
    name: string;
    roleCompany?: string;
    message: string;
    rating?: number;
    honeypot?: string;
  };

  if (payload.honeypot) {
    await FailedAttemptModel.create({
      type: FAILED_ATTEMPT_TYPE.TESTIMONIAL,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      reason: "Honeypot triggered",
    });
    throw new AppError("Submission blocked", 400);
  }

  const testimonial = await TestimonialModel.create({
    name: payload.name,
    roleCompany: payload.roleCompany || "",
    message: payload.message,
    rating: payload.rating,
    visible: true,
    order: 0,
    seo: {},
  });

  res.status(201).json({
    message: "Thanks for your feedback.",
    testimonialId: testimonial.id,
  });
});

export const listTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const { filter, sort, limit, skip, page } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["name", "roleCompany", "message"],
    defaultSort: { order: 1, createdAt: -1 },
  });
  const [items, total] = await Promise.all([
    TestimonialModel.find(filter).sort(sort).skip(skip).limit(limit),
    TestimonialModel.countDocuments(filter),
  ]);
  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const createTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const created = await TestimonialModel.create(req.body);
  res.status(201).json(created);
});

export const updateTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const updated = await TestimonialModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) throw new AppError("Testimonial not found", 404);
  res.json(updated);
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await TestimonialModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Testimonial not found", 404);
  res.json({ message: "Testimonial deleted" });
});
