import { Request, Response } from "express";
import { UserModel } from "../models";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { hashValue } from "../utils/password";
import { buildListQuery } from "./helpers";

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const { filter, sort, limit, skip, page } = buildListQuery({
    query: req.query as Record<string, unknown>,
    searchFields: ["name", "email"],
  });

  const [items, total] = await Promise.all([
    UserModel.find(filter).sort(sort).skip(skip).limit(limit),
    UserModel.countDocuments(filter),
  ]);

  res.json({
    items,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "EDITOR";
  };

  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const user = await UserModel.create({
    name,
    email,
    role,
    passwordHash: await hashValue(password),
  });

  res.status(201).json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const update = req.body as {
    name?: string;
    email?: string;
    role?: "ADMIN" | "EDITOR";
    password?: string;
  };

  if (update.email) {
    const existing = await UserModel.findOne({ email: update.email, _id: { $ne: userId } });
    if (existing) throw new AppError("Email already in use", 409);
  }

  const payload: Record<string, unknown> = {};
  if (update.name !== undefined) payload.name = update.name;
  if (update.email !== undefined) payload.email = update.email;
  if (update.role !== undefined) payload.role = update.role;
  if (update.password) payload.passwordHash = await hashValue(update.password);

  const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
  if (!user) throw new AppError("User not found", 404);

  res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (req.user?.userId === userId) {
    throw new AppError("You cannot delete your own account", 400);
  }
  const user = await UserModel.findByIdAndDelete(userId);
  if (!user) throw new AppError("User not found", 404);
  res.json({ message: "User deleted" });
});
