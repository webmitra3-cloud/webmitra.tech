import xss from "xss";

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return xss(value.trim());
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, sanitizeValue(item)]));
  }
  return value;
}

export function sanitizeObject<T>(value: T): T {
  return sanitizeValue(value) as T;
}
