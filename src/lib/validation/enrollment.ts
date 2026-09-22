import { z } from "zod"

export const personalSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  mobile: z.string().trim().min(8, "Enter a mobile number."),
  email: z.email("Enter a valid email address."),
})

export const academicSchema = z.object({
  college: z.string().trim().min(2, "Enter your college or university."),
  academicProgram: z.string().trim().min(2, "Enter your course or program."),
  yearOfStudy: z.string().trim().min(1, "Select your year of study."),
})

export const selectionSchema = z.object({
  programSlug: z.string().min(1, "Select a program."),
  internshipSlug: z.string().min(1, "Select an internship."),
  duration: z.string().min(1, "Select a duration."),
})

export const enrollmentDraftSchema = personalSchema
  .extend(academicSchema.shape)
  .extend(selectionSchema.shape)

export type PersonalInput = z.infer<typeof personalSchema>
export type AcademicInput = z.infer<typeof academicSchema>
export type SelectionInput = z.infer<typeof selectionSchema>

// ==========================================
// DB MODEL PROGRAM ENROLLMENT SCHEMAS
// ==========================================

export const enrollmentStatusEnum = z.enum([
  "PENDING",
  "ACTIVE",
  "EXTENDED",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
])

export const enrollmentSourceEnum = z.enum([
  "STUDENT_SELF",
  "ADMIN_MANUAL",
  "SYSTEM_IMPORT",
])

export const enrollmentPaymentStatusEnum = z.enum([
  "FREE",
  "PAID",
  "PARTIALLY_PAID",
  "WAIVED",
  "PENDING",
])

export const createEnrollmentSchema = z.object({
  enrollmentNumber: z.string().trim().min(3, "Enrollment number must be at least 3 characters").optional(),
  userId: z.number().int().positive("Please select a valid student"),
  programId: z.number().int().positive("Please select a valid program"),
  status: enrollmentStatusEnum.default("ACTIVE"),
  source: enrollmentSourceEnum.default("ADMIN_MANUAL"),
  adminAssignedById: z.number().int().positive().optional(),
  durationWeeks: z.number().int().min(1).max(52).optional(),
  durationMonths: z.number().int().min(1).max(24).optional(),
  startDate: z.string().optional(),
  expectedEndDate: z.string().optional(),
  paymentStatus: enrollmentPaymentStatusEnum.default("FREE"),
  amountPaid: z.number().min(0).default(0),
  currency: z.string().default("INR"),
  paymentReference: z.string().optional(),
  mentorName: z.string().optional(),
  mentorEmail: z.string().email("Invalid mentor email").optional().or(z.literal("")),
  adminNotes: z.string().optional(),
})

export const extendInternshipSchema = z.object({
  enrollmentId: z.number().int().positive("Invalid enrollment ID"),
  addedWeeks: z.number().int().min(1, "Extension period must be at least 1 week").max(52, "Extension cannot exceed 52 weeks"),
  reason: z.string().trim().min(3, "Please provide a reason for the extension"),
  adminId: z.number().int().positive().optional(),
  adminName: z.string().optional(),
})

export const updateEnrollmentSchema = z.object({
  enrollmentNumber: z.string().trim().min(3, "Enrollment number must be at least 3 characters").optional(),
  programId: z.number().int().positive("Invalid program ID").optional(),
  status: enrollmentStatusEnum.optional(),
  durationWeeks: z.number().int().min(1).max(52).optional().nullable(),
  durationMonths: z.number().int().min(1).max(24).optional().nullable(),
  startDate: z.string().optional(),
  expectedEndDate: z.string().optional(),
  actualEndDate: z.string().optional().nullable(),
  progressPercent: z.number().min(0).max(100).optional(),
  grade: z.string().optional().nullable(),
  mentorName: z.string().optional().nullable(),
  mentorEmail: z.string().email("Invalid mentor email").optional().or(z.literal("")).nullable(),
  certificateIssued: z.boolean().optional(),
  certificateId: z.string().optional().nullable(),
  paymentStatus: enrollmentPaymentStatusEnum.optional(),
  amountPaid: z.number().min(0).optional(),
  paymentReference: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
})

export const enrollmentFilterSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  userId: z.number().int().positive().optional(),
  programId: z.number().int().positive().optional(),
  status: enrollmentStatusEnum.optional(),
  programType: z.enum(["COURSE", "INTERNSHIP"]).optional(),
  isExtended: z.boolean().optional(),
  search: z.string().optional(),
})

export type CreateEnrollmentInput = z.input<typeof createEnrollmentSchema>
export type ExtendInternshipInput = z.input<typeof extendInternshipSchema>
export type UpdateEnrollmentInput = z.input<typeof updateEnrollmentSchema>
export type EnrollmentFilterInput = z.input<typeof enrollmentFilterSchema>

