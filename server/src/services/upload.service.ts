import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary";
import { env } from "../config/env";
import { uploadsDir } from "../config/uploads";
import { AppError } from "../utils/AppError";

type UploadImageOptions = {
  removeBackground?: boolean;
};

function parseDataUri(dataUri: string) {
  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new AppError("Invalid image format. Please upload a valid image file.", 400);
  }
  const [, mimeType, base64Data] = match;
  const extension = mimeType.split("/")[1] || "png";
  return { base64Data, extension };
}

function toCloudinaryBgRemovedUrl(secureUrl: string) {
  if (!secureUrl.includes("/image/upload/")) return secureUrl;
  const [prefix, suffix] = secureUrl.split("/image/upload/");
  if (!prefix || !suffix) return secureUrl;
  if (suffix.startsWith("e_background_removal/")) return secureUrl;
  return `${prefix}/image/upload/e_background_removal/f_png/${suffix}`;
}

function sanitizeFolder(folder: string) {
  const trimmed = folder.trim().toLowerCase();
  if (!trimmed) return "webmitra";
  // Keep local filenames safe and prevent path traversal.
  return trimmed.replace(/[^a-z0-9_-]/g, "-").slice(0, 64) || "webmitra";
}

export async function uploadImage(dataUri: string, folder = "webmitra", options?: UploadImageOptions): Promise<string> {
  if (!dataUri) return "";
  const safeFolder = sanitizeFolder(folder);

  if (isCloudinaryConfigured) {
    const shouldRemoveBackground = options?.removeBackground === true;

    try {
      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: safeFolder,
        resource_type: "image",
        ...(shouldRemoveBackground ? { background_removal: "cloudinary_ai" } : {}),
      });

      return shouldRemoveBackground ? toCloudinaryBgRemovedUrl(uploaded.secure_url) : uploaded.secure_url;
    } catch (error) {
      // Fallback to regular upload if background removal is unavailable on the account.
      if (!shouldRemoveBackground) throw error;

      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: safeFolder,
        resource_type: "image",
      });
      return toCloudinaryBgRemovedUrl(uploaded.secure_url);
    }
  }

  const { base64Data, extension } = parseDataUri(dataUri);
  await fs.mkdir(uploadsDir, { recursive: true });
  const safeExtension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "png";
  const fileName = `${safeFolder}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${safeExtension}`;
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, base64Data, "base64");
  return `${env.LOCAL_UPLOAD_BASE_URL}/${fileName}`;
}
