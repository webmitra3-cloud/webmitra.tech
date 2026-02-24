import { z } from "zod";
import { INQUIRY_STATUS } from "../constants";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createInquirySchema = z.object({
  name: z.string({ required_error: "Name is required" }).trim().min(2).max(80),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .regex(emailRegex, "Invalid email format"),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(120).optional(),
  message: z.string({ required_error: "Message is required" }).trim().min(1).max(2000),
  company: z.string().trim().max(120).optional(),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum([INQUIRY_STATUS.NEW, INQUIRY_STATUS.READ, INQUIRY_STATUS.ARCHIVED]),
});
