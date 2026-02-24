import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { uploadImage } from "../services/upload.service";

export const uploadImageController = asyncHandler(async (req: Request, res: Response) => {
  const { image, folder, removeBackground } = req.body as {
    image: string;
    folder?: string;
    removeBackground?: boolean;
  };
  if (!image) throw new AppError("Image is required", 400);
  const url = await uploadImage(image, folder || "webmitra", { removeBackground });
  res.status(201).json({ url });
});
