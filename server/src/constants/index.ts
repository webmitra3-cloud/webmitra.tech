export const ROLES = {
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
} as const;

export const TEAM_TYPES = {
  TEAM: "TEAM",
  BOARD: "BOARD",
} as const;

export const INQUIRY_STATUS = {
  NEW: "NEW",
  READ: "READ",
  ARCHIVED: "ARCHIVED",
} as const;

export const FAILED_ATTEMPT_TYPE = {
  LOGIN: "LOGIN",
  CONTACT: "CONTACT",
  TESTIMONIAL: "TESTIMONIAL",
} as const;

export const PRICING_PLAN_NAMES = {
  SILVER: "SILVER",
  GOLD: "GOLD",
  DIAMOND: "DIAMOND",
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
