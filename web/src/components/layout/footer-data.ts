export type OfficeItemKey = "address" | "phone" | "email" | "hours";
export type SocialItemKey = "facebook" | "instagram" | "linkedin" | "whatsapp" | "tiktok";

export const footerOfficeItems: Array<{ key: OfficeItemKey; label: string }> = [
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "hours", label: "Hours" },
];

export const footerSocialItems: Array<{ key: SocialItemKey; label: string }> = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "tiktok", label: "TikTok" },
];
