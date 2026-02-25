import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary";
import { env } from "../config/env";
import { uploadsDir } from "../config/uploads";
import { AppError } from "../utils/AppError";

function parseDataUri(dataUri: string) {
  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new AppError("Invalid image format. Please upload a valid image file.", 400);
  }
  const [, mimeType, base64Data] = match;
  const extension = mimeType.split("/")[1] || "png";
  return { base64Data, extension };
}

function sanitizeFolder(folder: string) {
  const trimmed = folder.trim().toLowerCase();
  if (!trimmed) return "webmitra";
  // Keep local filenames safe and prevent path traversal.
  return trimmed.replace(/[^a-z0-9_-]/g, "-").slice(0, 64) || "webmitra";
}

export async function uploadImage(dataUri: string, folder = "webmitra"): Promise<string> {
  if (!dataUri) return "";
  const safeFolder = sanitizeFolder(folder);

  if (isCloudinaryConfigured) {
    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: safeFolder,
      resource_type: "image",
    });
    return uploaded.secure_url;
  }

  const { base64Data, extension } = parseDataUri(dataUri);
  await fs.mkdir(uploadsDir, { recursive: true });
  const safeExtension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "png";
  const fileName = `${safeFolder}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${safeExtension}`;
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, base64Data, "base64");
  return `${env.LOCAL_UPLOAD_BASE_URL}/${fileName}`;
}
