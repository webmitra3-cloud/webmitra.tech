import bcrypt from "bcryptjs";
import { env } from "../config/env";

export async function hashValue(value: string): Promise<string> {
  return bcrypt.hash(value, env.BCRYPT_ROUNDS);
}

export async function compareHash(value: string, hash: string): Promise<boolean> {
  return bcrypt.compare(value, hash);
}
