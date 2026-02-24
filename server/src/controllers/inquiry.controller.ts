import { Request, Response } from "express";
import { InquiryModel } from "../models";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { buildListQuery } from "./helpers";

export const listInquiries = asyncHandler(async (req: Request, res: Response) => {
  const status = typeof req.query.status === "string" ? req.query.status : "";
  const { filter, sort, limit, skip, page } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["name", "email", "subject", "message"],
    defaultSort: { createdAt: -1 },
  });
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    InquiryModel.find(filter).sort(sort).skip(skip).limit(limit),
    InquiryModel.countDocuments(filter),
  ]);

  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await InquiryModel.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status as string },
    { new: true },
  );
  if (!updated) throw new AppError("Inquiry not found", 404);
  res.json(updated);
});

export const deleteInquiry = asyncHandler(async (req: Request, res: Response) => {
  const deleted = await InquiryModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Inquiry not found", 404);
  res.json({ message: "Inquiry deleted" });
});
