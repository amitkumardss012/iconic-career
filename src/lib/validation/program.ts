import { z } from "zod"

/**
 * ImageType validation schema supporting structured JSON objects or string URLs
 */
export const imageTypeSchema = z.union([
  z.object({
    id: z.string(),
    url: z.string(),
    bytes: z.number().optional().default(0),
    format: z.string().optional().default("webp"),
    provider: z.string().optional().default("CLOUDINARY"),
  }),
  z.string(),
  z.null(),
])

/**
 * Category Schemas
 */
export const createProgramCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().trim().optional().nullable(),
  icon: z.string().trim().optional().nullable(),
  thumbnail: imageTypeSchema.optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
})

export const updateProgramCategorySchema = createProgramCategorySchema.partial().extend({
  id: z.coerce.number().int().positive(),
})

export const getCategoriesQuerySchema = z.object({
  search: z.string().trim().optional(),
  isActive: z.enum(["ALL", "ACTIVE", "INACTIVE"]).default("ALL"),
  sortBy: z.enum(["sortOrder", "name", "createdAt"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

export const getCategoryByIdSchema = z.object({
  id: z.coerce.number().int().positive(),
})

/**
 * Program Schemas
 */
export const ProgramTypeEnum = z.enum(["COURSE", "INTERNSHIP"])
export const ProgramStatusEnum = z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"])
export const ProgramLevelEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"])
export const DeliveryModeEnum = z.enum(["ONLINE", "OFFLINE", "HYBRID"])

export const createProgramSchema = z.object({
  title: z.string().trim().min(3, "Program title must be at least 3 characters").max(150),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase alphanumeric characters and hyphens"),
  type: ProgramTypeEnum.default("COURSE"),
  categoryId: z.coerce.number().int().positive("Please select a valid category"),
  status: ProgramStatusEnum.default("DRAFT"),
  level: ProgramLevelEnum.default("ALL_LEVELS"),
  deliveryMode: DeliveryModeEnum.default("HYBRID"),

  // Content
  shortDescription: z.string().trim().max(300).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  highlights: z.array(z.string()).default([]),
  learningOutcomes: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  // Media (Structured JSON ImageType)
  thumbnail: imageTypeSchema.optional().nullable(),
  banner: imageTypeSchema.optional().nullable(),
  syllabusUrl: z.string().trim().optional().nullable(),

  // Scheduling & Duration
  duration: z.string().trim().optional().nullable(),
  durationHours: z.coerce.number().int().nonnegative().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),

  // Pricing & Capacity
  price: z.coerce.number().min(0, "Price cannot be negative").default(0),
  discountPrice: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().trim().default("INR"),
  maxCapacity: z.coerce.number().int().positive().optional().nullable(),

  // Social Proof & Badges
  rating: z.coerce.number().min(0).max(5).default(0),
  ratingCount: z.coerce.number().int().min(0).default(0),
  isBestseller: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  certificateOffered: z.boolean().default(true),
})

export const updateProgramSchema = createProgramSchema.partial().extend({
  id: z.coerce.number().int().positive(),
})

export const getProgramsListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  type: z.enum(["ALL", "COURSE", "INTERNSHIP"]).default("ALL"),
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(["ALL", "DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]).default("ALL"),
  level: z.enum(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]).default("ALL"),
  isBestseller: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(["createdAt", "title", "price", "rating", "enrolledCount", "sortOrder"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const toggleProgramStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: ProgramStatusEnum.optional(),
  isActive: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export const getProgramByIdSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const getProgramBySlugSchema = z.object({
  slug: z.string().trim().min(1),
})

export type CreateProgramCategoryInput = z.infer<typeof createProgramCategorySchema>
export type UpdateProgramCategoryInput = z.infer<typeof updateProgramCategorySchema>
export type GetCategoriesQueryInput = z.infer<typeof getCategoriesQuerySchema>

export type CreateProgramInput = z.infer<typeof createProgramSchema>
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>
export type GetProgramsListQueryInput = z.infer<typeof getProgramsListQuerySchema>
export type ToggleProgramStatusInput = z.infer<typeof toggleProgramStatusSchema>
