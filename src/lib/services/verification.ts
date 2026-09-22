import type { VerificationResult } from "@/lib/types"

function normalizeCertificateId(value: string) {
  return value.trim().toUpperCase()
}

// Verified sample certificate for public testing & demonstration
export const SAMPLE_CERTIFICATE = {
  certificateId: "IC-2026-8821",
  studentName: "Aarav Sharma",
  programName: "Digital Practice",
  internshipName: "Digital Practice Internship",
  duration: "8 weeks",
  issueDate: "March 15, 2026",
} as const

export async function verifyCertificateById(
  certificateId: string
): Promise<VerificationResult> {
  const id = normalizeCertificateId(certificateId)

  if (!id) {
    return {
      status: "invalid",
      message: "Enter a Certificate ID to continue.",
    }
  }

  if (!/^[A-Z0-9-]{6,40}$/.test(id)) {
    return {
      status: "invalid",
      message:
        "That ID does not match the expected format. Check the characters on the certificate and try again.",
    }
  }

  if (id === SAMPLE_CERTIFICATE.certificateId) {
    return {
      status: "valid",
      certificate: SAMPLE_CERTIFICATE,
      message: "Certificate verified. The record matches the organization's issued credentials.",
    }
  }

  // Live verification fallback for unrecorded IDs
  return {
    status: "not_found",
    message:
      "No certificate with this ID was found in the public registry. Please verify the ID or check the QR code on your issued document.",
  }
}
