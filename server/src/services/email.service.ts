import { ensureResendConfigured, resend } from "../config/mailer";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

type InquiryMailPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatNotificationText(payload: InquiryMailPayload, subject: string, submittedAt: string) {
  return [
    "New contact inquiry received.",
    "",
    `Submitted: ${submittedAt}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "-"}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

function formatNotificationHtml(payload: InquiryMailPayload, subject: string, submittedAt: string) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0f172a">
  <h2 style="margin:0 0 12px">New Contact Inquiry</h2>
  <p style="margin:0 0 16px;color:#475569">A new inquiry was submitted from the website contact form.</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
    <tbody>
      <tr><td style="padding:6px 0;font-weight:600">Submitted</td><td style="padding:6px 0">${escapeHtml(submittedAt)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">Name</td><td style="padding:6px 0">${escapeHtml(payload.name)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">Email</td><td style="padding:6px 0">${escapeHtml(payload.email)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">Phone</td><td style="padding:6px 0">${escapeHtml(payload.phone || "-")}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">Subject</td><td style="padding:6px 0">${escapeHtml(subject)}</td></tr>
    </tbody>
  </table>
  <div style="padding:14px;border:1px solid #cbd5e1;border-radius:8px;background:#f8fafc">
    <p style="margin:0 0 8px;font-weight:600">Message</p>
    <p style="margin:0;white-space:pre-wrap">${escapeHtml(payload.message)}</p>
  </div>
</div>
`.trim();
}

function formatAutoReplyText(payload: InquiryMailPayload) {
  return [
    `Hi ${payload.name},`,
    "",
    "Thanks for contacting WebMitra Tech. We received your message and our team will get back to you shortly.",
    "",
    "Regards,",
    "WebMitra Tech",
  ].join("\n");
}

function formatAutoReplyHtml(payload: InquiryMailPayload) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0f172a">
  <p style="margin:0 0 12px">Hi ${escapeHtml(payload.name)},</p>
  <p style="margin:0 0 12px">
    Thanks for contacting <strong>WebMitra Tech</strong>. We received your message and our team will get back to you shortly.
  </p>
  <p style="margin:0;color:#475569">Regards,<br/>WebMitra Tech</p>
</div>
`.trim();
}

async function sendMail(payload: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  ensureResendConfigured();

  try {
    await resend.emails.send({
      from: env.MAIL_FROM,
      to: [payload.to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      replyTo: payload.replyTo,
    });
  } catch (error) {
    logger.error("Email delivery failed", error instanceof Error ? error.message : "Unknown error");
    throw new AppError("Unable to deliver your message right now. Please try again later.", 502);
  }
}

export async function sendInquiryNotification(payload: InquiryMailPayload): Promise<void> {
  const subject = (payload.subject || "").trim() || "General Inquiry";
  const submittedAt = new Date().toISOString();
  const senderName = payload.name || "Unknown";

  await sendMail({
    to: env.MAIL_TO,
    subject: `New Contact Inquiry from ${senderName}`,
    text: formatNotificationText(payload, subject, submittedAt),
    html: formatNotificationHtml(payload, subject, submittedAt),
    replyTo: payload.email,
  });

  await sendMail({
    to: payload.email,
    subject: "We received your message - WebMitra Tech",
    text: formatAutoReplyText(payload),
    html: formatAutoReplyHtml(payload),
  });
}
