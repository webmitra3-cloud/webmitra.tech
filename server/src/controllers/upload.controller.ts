import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { uploadImage } from "../services/upload.service";

export const uploadImageController = asyncHandler(async (req: Request, res: Response) => {
  const { image, folder } = req.body as {
    image: string;
    folder?: string;
  };
  if (!image) throw new AppError("Image is required", 400);
  const url = await uploadImage(image, folder || "webmitra");
  res.status(201).json({ url });
});
