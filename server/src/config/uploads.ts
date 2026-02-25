import os from "os";
import path from "path";
import { env } from "./env";

// In production (Render), /tmp is reliably writable even on ephemeral filesystems.
const defaultProdUploadsDir = path.join(os.tmpdir(), "webmitra", "uploads");
const defaultDevUploadsDir = path.resolve(process.cwd(), "uploads");

export const uploadsDir = env.NODE_ENV === "production" ? defaultProdUploadsDir : defaultDevUploadsDir;
