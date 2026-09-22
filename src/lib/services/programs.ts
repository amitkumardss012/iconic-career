import { prisma } from "@/lib/prisma"
import { Prisma } from "../../../generated/prisma/client"
import type { Program, ProgramCategory } from "../../../generated/prisma/client"
import { serverCache } from "@/lib/server/cache"
import {
  createProgramCategorySchema,
  updateProgramCategorySchema,
  getCategoriesQuerySchema,
  createProgramSchema,
  updateProgramSchema,
  getProgramsListQuerySchema,
  toggleProgramStatusSchema,
  type CreateProgramCategoryInput,
  type UpdateProgramCategoryInput,
  type GetCategoriesQueryInput,
  type CreateProgramInput,
  type UpdateProgramInput,
  type GetProgramsListQueryInput,
  type ToggleProgramStatusInput,
} from "@/lib/validation/program"

import {
  type ProgramCategoryItem,
  type ProgramRecordItem,
  type ProgramStatsSummary,
  type PaginatedProgramsResult,
  generateSlug,
} from "@/lib/types/programs"

export type {
  ProgramCategoryItem,
  ProgramRecordItem,
  ProgramStatsSummary,
  PaginatedProgramsResult,
}
export { generateSlug }

/* =========================================================================
   CATEGORY SERVICE METHODS
   ========================================================================= */

/**
 * Create a new program category
 */
export async function createProgramCategory(rawInput: CreateProgramCategoryInput): Promise<{ success: boolean; data: ProgramCategory }> {
  const input = createProgramCategorySchema.parse(rawInput)

  const existingSlug = await prisma.programCategory.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  })
  if (existingSlug) {
    throw new Error(`Category slug "${input.slug}" already exists. Please choose a different slug.`)
  }

  const existingName = await prisma.programCategory.findUnique({
    where: { name: input.name },
    select: { id: true },
  })
  if (existingName) {
    throw new Error(`Category name "${input.name}" already exists.`)
  }

  const category = await prisma.programCategory.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      icon: input.icon || null,
      thumbnail: input.thumbnail ? (input.thumbnail as Prisma.InputJsonValue) : Prisma.DbNull,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
    },
  })

  serverCache.invalidateTags(["program_categories", "programs"])

  return { success: true, data: category }
}

/**
 * Update an existing program category
 */
export async function updateProgramCategory(rawInput: UpdateProgramCategoryInput): Promise<{ success: boolean; data: ProgramCategory }> {
  const input = updateProgramCategorySchema.parse(rawInput)

  const existing = await prisma.programCategory.findUnique({
    where: { id: input.id },
  })
  if (!existing) {
    throw new Error(`Category with ID ${input.id} was not found.`)
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugConflict = await prisma.programCategory.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    })
    if (slugConflict && slugConflict.id !== input.id) {
      throw new Error(`Category slug "${input.slug}" is already in use.`)
    }
  }

  if (input.name && input.name !== existing.name) {
    const nameConflict = await prisma.programCategory.findUnique({
      where: { name: input.name },
      select: { id: true },
    })
    if (nameConflict && nameConflict.id !== input.id) {
      throw new Error(`Category name "${input.name}" is already in use.`)
    }
  }

  const dataToUpdate: Prisma.ProgramCategoryUpdateInput = {}
  if (input.name !== undefined) dataToUpdate.name = input.name
  if (input.slug !== undefined) dataToUpdate.slug = input.slug
  if (input.description !== undefined) dataToUpdate.description = input.description || null
  if (input.icon !== undefined) dataToUpdate.icon = input.icon || null
  if (input.thumbnail !== undefined) {
    dataToUpdate.thumbnail = input.thumbnail ? (input.thumbnail as Prisma.InputJsonValue) : Prisma.DbNull
  }
  if (input.isActive !== undefined) dataToUpdate.isActive = input.isActive
  if (input.sortOrder !== undefined) dataToUpdate.sortOrder = input.sortOrder

  const updated = await prisma.programCategory.update({
    where: { id: input.id },
    data: dataToUpdate,
  })

  serverCache.invalidateTags(["program_categories", `category:${input.id}`, "programs"])

  return { success: true, data: updated }
}

/**
 * Fetch all categories with optional search and caching
 */
export async function getProgramCategories(rawQuery?: Partial<GetCategoriesQueryInput>): Promise<ProgramCategoryItem[]> {
  const query = getCategoriesQuerySchema.parse(rawQuery || {})
  const { search, isActive, sortBy, sortOrder } = query

  const cacheKey = `program_categories:s=${search || ""}:act=${isActive}:sb=${sortBy}:so=${sortOrder}`

  return await serverCache.getOrSet(
    cacheKey,
    async () => {
      const where: Prisma.ProgramCategoryWhereInput = {}

      if (isActive === "ACTIVE") where.isActive = true
      if (isActive === "INACTIVE") where.isActive = false

      if (search && search.trim() !== "") {
        const term = search.trim()
        where.OR = [
          { name: { contains: term, mode: "insensitive" } },
          { slug: { contains: term, mode: "insensitive" } },
        ]
      }

      return await prisma.programCategory.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { programs: true },
          },
        },
      })
    },
    { ttlSeconds: 120, tags: ["program_categories"] }
  )
}

/**
 * Delete a category (with dependency safety check)
 */
export async function deleteProgramCategory(id: number): Promise<{ success: boolean; message: string }> {
  const linkedCount = await prisma.program.count({
    where: { categoryId: id },
  })

  if (linkedCount > 0) {
    throw new Error(`Cannot delete category: it is assigned to ${linkedCount} active program(s). Reassign or delete those programs first.`)
  }

  await prisma.programCategory.delete({
    where: { id },
  })

  serverCache.invalidateTags(["program_categories", "programs"])

  return { success: true, message: "Category deleted successfully." }
}

/* =========================================================================
   PROGRAM SERVICE METHODS
   ========================================================================= */

/**
 * Create a new Program (Course or Internship)
 */
export async function createProgram(rawInput: CreateProgramInput): Promise<{ success: boolean; data: ProgramRecordItem }> {
  const input = createProgramSchema.parse(rawInput)

  // 1. Verify Category Exists
  const category = await prisma.programCategory.findUnique({
    where: { id: input.categoryId },
    select: { id: true, name: true, slug: true },
  })
  if (!category) {
    throw new Error(`Selected category #${input.categoryId} does not exist.`)
  }

  // 2. Verify Slug Uniqueness
  const existingSlug = await prisma.program.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  })
  if (existingSlug) {
    throw new Error(`A program with slug "${input.slug}" already exists.`)
  }

  // 3. Create Program Record
  const newProgram = await prisma.program.create({
    data: {
      title: input.title,
      slug: input.slug,
      type: input.type,
      categoryId: input.categoryId,
      status: input.status,
      level: input.level,
      deliveryMode: input.deliveryMode,

      shortDescription: input.shortDescription || null,
      description: input.description || null,
      highlights: input.highlights,
      learningOutcomes: input.learningOutcomes,
      prerequisites: input.prerequisites,
      tags: input.tags,

      thumbnail: input.thumbnail ? (input.thumbnail as Prisma.InputJsonValue) : Prisma.DbNull,
      banner: input.banner ? (input.banner as Prisma.InputJsonValue) : Prisma.DbNull,
      syllabusUrl: input.syllabusUrl || null,

      duration: input.duration || null,
      durationHours: input.durationHours || null,
      startDate: input.startDate || null,
      endDate: input.endDate || null,

      price: input.price,
      discountPrice: input.discountPrice || null,
      currency: input.currency,
      maxCapacity: input.maxCapacity || null,

      rating: input.rating,
      ratingCount: input.ratingCount,
      isBestseller: input.isBestseller,
      isFeatured: input.isFeatured,
      isActive: input.isActive,
      certificateOffered: input.certificateOffered,
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  })

  // 4. Invalidate Caches
  serverCache.invalidateTags(["programs", "program_categories"])

  return { success: true, data: newProgram as ProgramRecordItem }
}

/**
 * Update an existing Program
 */
export async function updateProgram(rawInput: UpdateProgramInput): Promise<{ success: boolean; data: ProgramRecordItem }> {
  const input = updateProgramSchema.parse(rawInput)

  const existing = await prisma.program.findUnique({
    where: { id: input.id },
  })
  if (!existing) {
    throw new Error(`Program with ID ${input.id} was not found.`)
  }

  if (input.slug && input.slug !== existing.slug) {
    const slugConflict = await prisma.program.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    })
    if (slugConflict && slugConflict.id !== input.id) {
      throw new Error(`Slug "${input.slug}" is already used by another program.`)
    }
  }

  if (input.categoryId && input.categoryId !== existing.categoryId) {
    const cat = await prisma.programCategory.findUnique({
      where: { id: input.categoryId },
      select: { id: true },
    })
    if (!cat) {
      throw new Error(`Target category #${input.categoryId} does not exist.`)
    }
  }

  const dataToUpdate: Prisma.ProgramUpdateInput = {}
  if (input.title !== undefined) dataToUpdate.title = input.title
  if (input.slug !== undefined) dataToUpdate.slug = input.slug
  if (input.type !== undefined) dataToUpdate.type = input.type
  if (input.categoryId !== undefined) dataToUpdate.category = { connect: { id: input.categoryId } }
  if (input.status !== undefined) dataToUpdate.status = input.status
  if (input.level !== undefined) dataToUpdate.level = input.level
  if (input.deliveryMode !== undefined) dataToUpdate.deliveryMode = input.deliveryMode

  if (input.shortDescription !== undefined) dataToUpdate.shortDescription = input.shortDescription || null
  if (input.description !== undefined) dataToUpdate.description = input.description || null
  if (input.highlights !== undefined) dataToUpdate.highlights = (input.highlights as Prisma.InputJsonValue) || []
  if (input.learningOutcomes !== undefined) dataToUpdate.learningOutcomes = (input.learningOutcomes as Prisma.InputJsonValue) || []
  if (input.prerequisites !== undefined) dataToUpdate.prerequisites = (input.prerequisites as Prisma.InputJsonValue) || []
  if (input.tags !== undefined) dataToUpdate.tags = (input.tags as Prisma.InputJsonValue) || []

  if (input.thumbnail !== undefined) {
    dataToUpdate.thumbnail = input.thumbnail ? (input.thumbnail as Prisma.InputJsonValue) : Prisma.DbNull
  }
  if (input.banner !== undefined) {
    dataToUpdate.banner = input.banner ? (input.banner as Prisma.InputJsonValue) : Prisma.DbNull
  }
  if (input.syllabusUrl !== undefined) dataToUpdate.syllabusUrl = input.syllabusUrl || null

  if (input.duration !== undefined) dataToUpdate.duration = input.duration || null
  if (input.durationHours !== undefined) dataToUpdate.durationHours = input.durationHours || null
  if (input.startDate !== undefined) dataToUpdate.startDate = input.startDate || null
  if (input.endDate !== undefined) dataToUpdate.endDate = input.endDate || null

  if (input.price !== undefined) dataToUpdate.price = input.price
  if (input.discountPrice !== undefined) dataToUpdate.discountPrice = input.discountPrice || null
  if (input.currency !== undefined) dataToUpdate.currency = input.currency
  if (input.maxCapacity !== undefined) dataToUpdate.maxCapacity = input.maxCapacity || null

  if (input.rating !== undefined) dataToUpdate.rating = input.rating
  if (input.ratingCount !== undefined) dataToUpdate.ratingCount = input.ratingCount
  if (input.isBestseller !== undefined) dataToUpdate.isBestseller = input.isBestseller
  if (input.isFeatured !== undefined) dataToUpdate.isFeatured = input.isFeatured
  if (input.isActive !== undefined) dataToUpdate.isActive = input.isActive
  if (input.certificateOffered !== undefined) dataToUpdate.certificateOffered = input.certificateOffered

  const updated = await prisma.program.update({
    where: { id: input.id },
    data: dataToUpdate,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  })

  serverCache.invalidateTags(["programs", `program:${input.id}`, `program:${existing.slug}`])

  return { success: true, data: updated as ProgramRecordItem }
}

/**
 * Fetch paginated programs with multi-filtering and aggregate KPIs
 */
export async function getPrograms(rawQuery?: Partial<GetProgramsListQueryInput>): Promise<PaginatedProgramsResult> {
  const query = getProgramsListQuerySchema.parse(rawQuery || {})
  const { page, limit, search, type, categoryId, status, level, isBestseller, isFeatured, isActive, sortBy, sortOrder } = query

  const cacheKey = `programs:p=${page}:l=${limit}:t=${type}:c=${categoryId || ""}:st=${status}:lvl=${level}:bs=${isBestseller}:ft=${isFeatured}:s=${search || ""}:sb=${sortBy}:so=${sortOrder}`

  return await serverCache.getOrSet(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit
      const take = limit

      const where: Prisma.ProgramWhereInput = {}

      if (type && type !== "ALL") where.type = type
      if (categoryId) where.categoryId = categoryId
      if (status && status !== "ALL") where.status = status
      if (level && level !== "ALL") where.level = level
      if (isBestseller !== undefined) where.isBestseller = isBestseller
      if (isFeatured !== undefined) where.isFeatured = isFeatured
      if (isActive !== undefined) where.isActive = isActive

      if (search && search.trim() !== "") {
        const term = search.trim()
        where.OR = [
          { title: { contains: term, mode: "insensitive" } },
          { slug: { contains: term, mode: "insensitive" } },
          { shortDescription: { contains: term, mode: "insensitive" } },
          { category: { name: { contains: term, mode: "insensitive" } } },
        ]
      }

      // Execute data query and aggregate stats in parallel transaction
      const [programs, total, totalCount, courseCount, internshipCount, publishedCount, draftCount, enrolledAggregate] =
        await prisma.$transaction([
          prisma.program.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy]: sortOrder },
            include: {
              category: {
                select: { id: true, name: true, slug: true },
              },
            },
          }),
          prisma.program.count({ where }),
          prisma.program.count(),
          prisma.program.count({ where: { type: "COURSE" } }),
          prisma.program.count({ where: { type: "INTERNSHIP" } }),
          prisma.program.count({ where: { status: "PUBLISHED" } }),
          prisma.program.count({ where: { status: "DRAFT" } }),
          prisma.program.aggregate({
            _sum: { enrolledCount: true },
          }),
        ])

      const totalPages = Math.ceil(total / limit) || 1

      return {
        success: true,
        data: programs as ProgramRecordItem[],
        stats: {
          total: totalCount,
          courses: courseCount,
          internships: internshipCount,
          published: publishedCount,
          drafts: draftCount,
          totalEnrolled: enrolledAggregate._sum.enrolledCount || 0,
        },
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }
    },
    { ttlSeconds: 30, tags: ["programs"] }
  )
}

/**
 * Fetch single program by ID
 */
export async function getProgramById(id: number): Promise<ProgramRecordItem | null> {
  const cacheKey = `program:${id}`

  return await serverCache.getOrSet(
    cacheKey,
    async () => {
      const program = await prisma.program.findUnique({
        where: { id },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      })

      return (program as ProgramRecordItem) || null
    },
    { ttlSeconds: 60, tags: ["programs", `program:${id}`] }
  )
}

/**
 * Fetch single program by Slug
 */
export async function getProgramBySlug(slug: string): Promise<ProgramRecordItem | null> {
  const cacheKey = `program:slug:${slug}`

  return await serverCache.getOrSet(
    cacheKey,
    async () => {
      const program = await prisma.program.findUnique({
        where: { slug },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      })

      return (program as ProgramRecordItem) || null
    },
    { ttlSeconds: 60, tags: ["programs", `program:slug:${slug}`] }
  )
}

/**
 * Toggle Program Quick Status / Badges
 */
export async function toggleProgramStatus(rawInput: ToggleProgramStatusInput): Promise<{ success: boolean; data: ProgramRecordItem }> {
  const input = toggleProgramStatusSchema.parse(rawInput)

  const dataToUpdate: Prisma.ProgramUpdateInput = {}
  if (input.status !== undefined) dataToUpdate.status = input.status
  if (input.isActive !== undefined) dataToUpdate.isActive = input.isActive
  if (input.isBestseller !== undefined) dataToUpdate.isBestseller = input.isBestseller
  if (input.isFeatured !== undefined) dataToUpdate.isFeatured = input.isFeatured

  const updated = await prisma.program.update({
    where: { id: input.id },
    data: dataToUpdate,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  })

  serverCache.invalidateTags(["programs", `program:${input.id}`])

  return { success: true, data: updated as ProgramRecordItem }
}

/**
 * Delete a Program
 */
export async function deleteProgram(id: number): Promise<{ success: boolean; message: string }> {
  const program = await prisma.program.findUnique({
    where: { id },
    select: { id: true, slug: true },
  })

  if (!program) {
    throw new Error(`Program #${id} not found.`)
  }

  await prisma.program.delete({
    where: { id },
  })

  serverCache.invalidateTags(["programs", `program:${id}`, `program:${program.slug}`])

  return { success: true, message: "Program deleted successfully." }
}
