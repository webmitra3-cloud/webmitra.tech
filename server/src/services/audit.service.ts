import { FailedAttemptModel } from "../models";
import { FAILED_ATTEMPT_TYPE } from "../constants";

type FailedAttemptType = (typeof FAILED_ATTEMPT_TYPE)[keyof typeof FAILED_ATTEMPT_TYPE];

export async function logFailedAttempt(params: {
  type: FailedAttemptType;
  ip?: string;
  userAgent?: string;
  reason: string;
}) {
  await FailedAttemptModel.create({
    type: params.type,
    ip: params.ip || "",
    userAgent: params.userAgent || "",
    reason: params.reason,
  });
}
