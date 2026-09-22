import { z } from "zod"

export const roleEnum = z.enum(["ADMIN", "STUDENT"])
export type RoleType = z.infer<typeof roleEnum>

/**
 * Schema for creating a new user
 */
export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{7,15}$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal(""))
    .nullable(),
  role: roleEnum.default("STUDENT"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

/**
 * Schema for updating an existing user
 */
export const updateUserSchema = z.object({
  id: z.coerce.number().int().positive("Valid user ID is required."),
  name: z.string().trim().min(2, "Name must be at least 2 characters.").optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address.")
    .optional(),
  password: z.string().min(8, "Password must be at least 8 characters.").optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{7,15}$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal(""))
    .nullable(),
  role: roleEnum.optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

/**
 * Schema for querying users with pagination, search, and role filtering
 */
export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  role: z.enum(["ADMIN", "STUDENT", "ALL"]).optional().default("ALL"),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "name", "email", "role", "id"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})

export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>

/**
 * Schema for querying a single user by ID
 */
export const getUserByIdSchema = z.object({
  id: z.coerce.number().int().positive("Valid user ID is required."),
})

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>

/**
 * Schema for updating/resetting a user's password directly (Admin or Authorized Reset)
 */
export const updateUserPasswordSchema = z.object({
  id: z.coerce.number().int().positive("Valid user ID is required."),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
})

export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>

