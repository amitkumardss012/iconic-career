import { z } from "zod"
import {
  genderEnum,
  degreeLevelEnum,
  documentPayloadSchema,
} from "@/lib/validation/student"

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Enter your email or mobile number."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Schema for public student registration on the registration page
 */
export const studentRegistrationSchema = z
  .object({
    // 1. Personal & Guardian Details
    name: z.string().trim().min(2, "Full legal name must be at least 2 characters."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address."),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+ -]{7,15}$/, "Please enter a valid phone number."),
    gender: genderEnum.optional().nullable(),
    parentName: z.string().trim().optional().nullable(),
    parentPhone: z.string().trim().optional().nullable(),
    parentEmail: z.string().trim().email("Invalid parent email").optional().or(z.literal("")).nullable(),
    relationship: z.string().trim().optional().nullable(),
    emergencyContact: z.string().trim().optional().nullable(),
    city: z.string().trim().optional().nullable(),
    state: z.string().trim().optional().nullable(),

    // Account Password
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),

    // 2. Academic Credentials
    university: z.string().trim().optional().nullable(),
    college: z.string().trim().min(2, "College/Institute name is required."),
    degreeLevel: degreeLevelEnum.optional().default("UG"),
    department: z.string().trim().optional().nullable(),
    course: z.string().trim().min(2, "Course / Degree program is required."),
    subject: z.string().trim().optional().nullable(),
    session: z.string().trim().optional().nullable(),
    registrationNumber: z.string().trim().optional().nullable(),

    // 3. Parental Consent Letter (Optional)
    consentLetter: z.union([documentPayloadSchema, z.string(), z.null()]).optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>

/**
 * URL Search Params Schema for Registration Stepper Persistence
 */
export const registerSearchSchema = z.object({
  step: z.coerce.number().int().min(1).max(3).optional().catch(1),
  name: z.string().optional().catch(""),
  email: z.string().optional().catch(""),
  phone: z.string().optional().catch(""),
  gender: z.string().optional().catch(""),
  parentName: z.string().optional().catch(""),
  parentPhone: z.string().optional().catch(""),
  parentEmail: z.string().optional().catch(""),
  relationship: z.string().optional().catch(""),
  emergencyContact: z.string().optional().catch(""),
  city: z.string().optional().catch(""),
  state: z.string().optional().catch(""),
  university: z.string().optional().catch(""),
  college: z.string().optional().catch(""),
  degreeLevel: z.string().optional().catch(""),
  department: z.string().optional().catch(""),
  course: z.string().optional().catch(""),
  subject: z.string().optional().catch(""),
  session: z.string().optional().catch(""),
  registrationNumber: z.string().optional().catch(""),
})

export type RegisterSearchInput = z.infer<typeof registerSearchSchema>



