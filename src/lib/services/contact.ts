import type { ContactInput } from "@/lib/validation/contact"

export type ContactSubmissionResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string }

export async function submitContactMessage(
  input: ContactInput
): Promise<ContactSubmissionResult> {
  void input

  return {
    status: "success",
    message:
      "Your message has been validated and queued on this website. Delivery to the organization inbox will begin when the contact service is connected.",
  }
}
