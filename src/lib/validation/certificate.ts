import { z } from "zod"

// ==========================================
// CERTIFICATE VALIDATION SCHEMAS
// ==========================================

export const certificateStatusEnum = z.enum(["ISSUED", "REVOKED", "SUSPENDED"])

/**
 * Snapshot Schema - Stores the frozen recipient & program details at the time of issuance.
 * Every single field is editable by the admin.
 */
export const certificateSnapshotSchema = z.object({
  recipientName: z.string().trim().min(2, "Recipient full name is required"),
  recipientEmail: z.string().email("Valid email address required").optional().or(z.literal("")),
  college: z.string().trim().min(2, "College or University name is required"),
  degree: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  programTitle: z.string().trim().min(2, "Program/Course title is required"),
  programType: z.enum(["COURSE", "INTERNSHIP"]).default("COURSE"),
  durationText: z.string().optional().or(z.literal("")),
  mentorName: z.string().optional().or(z.literal("")),
  mentorEmail: z.string().optional().or(z.literal("")),
})

export type CertificateSnapshotInput = z.infer<typeof certificateSnapshotSchema>

/**
 * Issue Certificate Schema (Creation)
 */
export const issueCertificateSchema = z.object({
  enrollmentId: z.number().int().positive("Please select a valid enrollment"),
  certificateNumber: z.string().trim().min(3, "Certificate number must be at least 3 characters").optional(),
  status: certificateStatusEnum.default("ISSUED"),
  isDownloadAllowed: z.boolean().default(true),
  issueDate: z.string().optional(),
  validUntil: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  percentage: z.number().min(0).max(100).optional().nullable(),
  durationText: z.string().optional().nullable(),
  snapshotData: certificateSnapshotSchema.optional(),
  fileUrl: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
  issuedById: z.number().int().positive().optional(),
})

export type IssueCertificateInput = z.infer<typeof issueCertificateSchema>

/**
 * Update Certificate Schema (ALL fields fully editable)
 */
export const updateCertificateSchema = z.object({
  certificateNumber: z.string().trim().min(3, "Certificate number must be at least 3 characters").optional(),
  status: certificateStatusEnum.optional(),
  isDownloadAllowed: z.boolean().optional(),
  issueDate: z.string().optional(),
  validUntil: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  percentage: z.number().min(0).max(100).optional().nullable(),
  durationText: z.string().optional().nullable(),
  snapshotData: certificateSnapshotSchema.optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
  revokedAt: z.string().optional().nullable(),
  revocationReason: z.string().optional().nullable(),
  revokedById: z.number().int().positive().optional().nullable(),
})

export type UpdateCertificateInput = z.infer<typeof updateCertificateSchema>

/**
 * Certificate Filter Schema
 */
export const certificateFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  isDownloadAllowed: z.enum(["ALL", "ALLOWED", "LOCKED"]).optional().default("ALL"),
  programId: z.number().int().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
})

export type CertificateFilterInput = z.infer<typeof certificateFilterSchema>

/**
 * Revoke Certificate Schema
 */
export const revokeCertificateSchema = z.object({
  certificateId: z.number().int().positive("Invalid certificate ID"),
  reason: z.string().trim().min(3, "Please provide a valid revocation reason"),
  adminId: z.number().int().positive().optional(),
})

export type RevokeCertificateInput = z.infer<typeof revokeCertificateSchema>

/**
 * Quick Toggle Download Permission Schema
 */
export const toggleDownloadSchema = z.object({
  certificateId: z.number().int().positive("Invalid certificate ID"),
  isDownloadAllowed: z.boolean(),
})

export type ToggleDownloadInput = z.infer<typeof toggleDownloadSchema>
