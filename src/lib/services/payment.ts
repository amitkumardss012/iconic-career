import type { EnrollmentDraft, PaymentPreparationResult } from "@/lib/types"

export async function prepareEnrollmentPayment(
  draft: EnrollmentDraft
): Promise<PaymentPreparationResult> {
  void draft

  return {
    status: "unavailable",
    message:
      "Razorpay is not connected in this phase. Enrollment details can be reviewed, but no payment will be collected and no success state will be shown.",
  }
}

export type AuthAttemptResult = {
  status: "error"
  message: string
}

export async function requestLogin(): Promise<AuthAttemptResult> {
  return {
    status: "error",
    message:
      "Student login is not connected yet. Accounts will open after enrollment and server-side payment verification in a later phase.",
  }
}
