import { z } from "zod"

export const studentStatusEnum = z.enum(["ACTIVE", "INACTIVE", "COMPLETED", "SUSPENDED"])
export type StudentStatusType = z.infer<typeof studentStatusEnum>

export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"])
export type GenderType = z.infer<typeof genderEnum>

export const degreeLevelEnum = z.enum(["UG", "PG", "DIPLOMA", "DOCTORATE", "OTHER"])
export type DegreeLevelType = z.infer<typeof degreeLevelEnum>

export const documentPayloadSchema = z.object({
  id: z.string(),
  url: z.string(),
  bytes: z.number().optional(),
  format: z.string().optional(),
  provider: z.string().optional(),
  fileName: z.string().optional(),
})

/**
 * Schema for creating a new student and associated profile
 */
export const createStudentRecordSchema = z.object({
  // Basic Account
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{7,15}$/, "Please enter a valid phone number."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .optional(),

  // Personal & Guardian
  gender: genderEnum.optional().nullable(),
  parentName: z.string().trim().optional().nullable(),
  parentPhone: z.string().trim().optional().nullable(),
  parentEmail: z.string().trim().email("Invalid parent email").optional().or(z.literal("")).nullable(),
  relationship: z.string().trim().optional().nullable(),

  // Academic Credentials
  university: z.string().trim().optional().nullable(),
  college: z.string().trim().min(2, "College/Institute name is required."),
  degreeLevel: degreeLevelEnum.optional().default("UG"),
  department: z.string().trim().optional().nullable(),
  course: z.string().trim().min(2, "Course/Degree program is required."),
  subject: z.string().trim().optional().nullable(),
  session: z.string().trim().optional().nullable(),
  registrationNumber: z.string().trim().optional().nullable(),

  // Compliance & Consent
  consentLetter: z.union([documentPayloadSchema, z.string(), z.null()]).optional().nullable(),

  // Status & Location
  status: studentStatusEnum.default("ACTIVE"),
  city: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  emergencyContact: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
})

export type CreateStudentRecordInput = z.infer<typeof createStudentRecordSchema>

/**
 * Schema for updating an existing student record and profile
 */
export const updateStudentRecordSchema = z.object({
  id: z.coerce.number().int().positive("Valid student profile ID required."),
  name: z.string().trim().min(2, "Name must be at least 2 characters.").optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{7,15}$/, "Please enter a valid phone number.")
    .optional(),
  password: z.string().min(8, "Password must be at least 8 characters.").optional(),

  // Personal & Guardian
  gender: genderEnum.optional().nullable(),
  parentName: z.string().trim().optional().nullable(),
  parentPhone: z.string().trim().optional().nullable(),
  parentEmail: z.string().trim().email("Invalid parent email").optional().or(z.literal("")).nullable(),
  relationship: z.string().trim().optional().nullable(),

  // Academic Credentials
  university: z.string().trim().optional().nullable(),
  college: z.string().trim().min(2, "College/Institute is required.").optional(),
  degreeLevel: degreeLevelEnum.optional(),
  department: z.string().trim().optional().nullable(),
  course: z.string().trim().min(2, "Course/Degree is required.").optional(),
  subject: z.string().trim().optional().nullable(),
  session: z.string().trim().optional().nullable(),
  registrationNumber: z.string().trim().optional().nullable(),

  // Compliance & Consent
  consentLetter: z.union([documentPayloadSchema, z.string(), z.null()]).optional().nullable(),

  // Status & Location
  status: studentStatusEnum.optional(),
  isActive: z.boolean().optional(),
  city: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  emergencyContact: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
})

export type UpdateStudentRecordInput = z.infer<typeof updateStudentRecordSchema>

/**
 * Query schema for listing students with search, filters, and pagination
 */
export const getStudentsListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED", "SUSPENDED", "ALL"]).default("ALL"),
  college: z.string().trim().optional(),
  department: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "college", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export type GetStudentsListQueryInput = z.infer<typeof getStudentsListQuerySchema>

/**
 * Schema for toggling active state or status
 */
export const toggleStudentStatusSchema = z.object({
  studentId: z.coerce.number().int().positive(),
  isActive: z.boolean(),
  status: studentStatusEnum.optional(),
})

export type ToggleStudentStatusInput = z.infer<typeof toggleStudentStatusSchema>

/**
 * Schema for fetching a student by ID
 */
export const getStudentByIdSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export type GetStudentByIdInput = z.infer<typeof getStudentByIdSchema>
