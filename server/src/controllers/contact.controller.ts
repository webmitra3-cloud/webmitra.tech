import { Request, Response } from "express";
import { INQUIRY_STATUS } from "../constants";
import { FailedAttemptModel, InquiryModel } from "../models";
import { sendInquiryNotification } from "../services/email.service";
import { asyncHandler } from "../utils/asyncHandler";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  company?: string;
};

function sanitizeText(value?: string) {
  return (value || "").trim();
}

function sanitizePhone(value?: string) {
  return sanitizeText(value).replace(/[^\d+\-()\s]/g, "");
}

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as ContactPayload;
  const company = sanitizeText(body.company);

  if (company) {
    await FailedAttemptModel.create({
      type: "CONTACT",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      reason: "Honeypot triggered",
    }).catch(() => undefined);

    return res.status(200).json({
      ok: true,
      message: "Inquiry submitted successfully.",
    });
  }

  const normalizedPayload = {
    name: sanitizeText(body.name),
    email: sanitizeText(body.email).toLowerCase(),
    phone: sanitizePhone(body.phone),
    subject: sanitizeText(body.subject),
    message: sanitizeText(body.message),
  };

  const inquiry = await InquiryModel.create({
    ...normalizedPayload,
    status: INQUIRY_STATUS.NEW,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || "",
  });

  await sendInquiryNotification(normalizedPayload);

  return res.status(201).json({
    ok: true,
    message: "Inquiry submitted successfully.",
    data: {
      inquiryId: inquiry.id,
    },
  });
});
