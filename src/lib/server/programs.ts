import { createServerFn } from "@tanstack/react-start"
import { prisma, type Program } from "@/lib/prisma"
import {
  createProgramCategorySchema,
  updateProgramCategorySchema,
  getCategoriesQuerySchema,
  getCategoryByIdSchema,
  createProgramSchema,
  updateProgramSchema,
  getProgramsListQuerySchema,
  getProgramByIdSchema,
  toggleProgramStatusSchema,
} from "@/lib/validation/program"
import {
  createProgramCategory,
  updateProgramCategory,
  getProgramCategories,
  deleteProgramCategory,
  createProgram,
  updateProgram,
  getPrograms,
  getProgramById,
  toggleProgramStatus,
  deleteProgram,
} from "@/lib/services/programs"

/* =========================================================================
   CATEGORY SERVER FUNCTIONS
   ========================================================================= */

/**
 * Server function to list all program categories
 */
export const getProgramCategoriesFn = createServerFn({ method: "GET" })
  .validator((query: unknown) => getCategoriesQuerySchema.parse(query || {}))
  .handler(async ({ data }) => {
    return await getProgramCategories(data)
  })

/**
 * Server function to create a new program category
 */
export const createProgramCategoryFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createProgramCategorySchema.parse(input))
  .handler(async ({ data }) => {
    return await createProgramCategory(data)
  })

/**
 * Server function to update a program category
 */
export const updateProgramCategoryFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => updateProgramCategorySchema.parse(input))
  .handler(async ({ data }) => {
    return await updateProgramCategory(data)
  })

/**
 * Server function to delete a program category
 */
export const deleteProgramCategoryFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => getCategoryByIdSchema.parse(input))
  .handler(async ({ data }) => {
    return await deleteProgramCategory(data.id)
  })

/* =========================================================================
   PROGRAM SERVER FUNCTIONS
   ========================================================================= */

/**
 * Server function to list paginated programs with filters
 */
export const getProgramsListFn = createServerFn({ method: "GET" })
  .validator((query: unknown) => getProgramsListQuerySchema.parse(query || {}))
  .handler(async ({ data }) => {
    return await getPrograms(data)
  })

/**
 * Server function to fetch a single program detail
 */
export const getProgramDetailFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => getProgramByIdSchema.parse(input))
  .handler(async ({ data }) => {
    return await getProgramById(data.id)
  })

/**
 * Server function to create a new program (Course or Internship)
 */
export const createProgramFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createProgramSchema.parse(input))
  .handler(async ({ data }) => {
    return await createProgram(data)
  })

/**
 * Server function to update a program
 */
export const updateProgramFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => updateProgramSchema.parse(input))
  .handler(async ({ data }) => {
    return await updateProgram(data)
  })

/**
 * Server function to toggle program status / badges
 */
export const toggleProgramStatusFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => toggleProgramStatusSchema.parse(input))
  .handler(async ({ data }) => {
    return await toggleProgramStatus(data)
  })

/**
 * Server function to delete a program
 */
export const deleteProgramFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => getProgramByIdSchema.parse(input))
  .handler(async ({ data }) => {
    return await deleteProgram(data.id)
  })

/**
 * Server function for dynamic public Programs and Internships: queries active records from database with zero mock fallbacks
 */
export const getHomeProgramsFn = createServerFn({ method: "GET" })
  .validator((query?: { type?: "COURSE" | "INTERNSHIP"; category?: string; search?: string }) => query || {})
  .handler(async ({ data }) => {
    try {
      const whereClause: any = {
        isActive: true,
      }

      if (data?.type) {
        whereClause.type = data.type
      }

      if (data?.category && data.category !== "all") {
        whereClause.category = {
          slug: data.category,
        }
      }

      if (data?.search && data.search.trim()) {
        const searchVal = data.search.trim()
        whereClause.OR = [
          { title: { contains: searchVal, mode: "insensitive" } },
          { shortDescription: { contains: searchVal, mode: "insensitive" } },
          { description: { contains: searchVal, mode: "insensitive" } },
        ]
      }

      const rawPrograms = await prisma.program.findMany({
        where: whereClause,
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
      })

      function adaptItem(record: Program) {
        const highlights = Array.isArray(record.highlights) ? (record.highlights as string[]) : []
        const learningOutcomes = Array.isArray(record.learningOutcomes) ? (record.learningOutcomes as string[]) : []
        const prerequisites = Array.isArray(record.prerequisites) ? (record.prerequisites as string[]) : []
        const tags = Array.isArray(record.tags) ? (record.tags as string[]) : []

        const structure = highlights.map((h: string, i: number) => ({
          title: `Milestone ${i + 1}: ${h}`,
          detail: h,
        }))

        const defaultDuration = record.duration || (record.durationHours ? `${record.durationHours} Hours` : "")

        let imageSrc = ""
        if (record.banner && typeof record.banner === "object" && "url" in record.banner && typeof record.banner.url === "string") {
          imageSrc = record.banner.url
        } else if (record.thumbnail && typeof record.thumbnail === "object" && "url" in record.thumbnail && typeof record.thumbnail.url === "string") {
          imageSrc = record.thumbnail.url
        }

        const priceVal = record.price ?? 0
        const discountPriceVal = record.discountPrice ?? null

        let formattedPrice = priceVal > 0 ? `₹${priceVal.toLocaleString("en-IN")}` : ""
        let formattedOriginalPrice = ""
        let discountPercentage = ""

        if (discountPriceVal && discountPriceVal < priceVal) {
          formattedPrice = `₹${discountPriceVal.toLocaleString("en-IN")}`
          formattedOriginalPrice = `₹${priceVal.toLocaleString("en-IN")}`
          discountPercentage = `${Math.round(((priceVal - discountPriceVal) / priceVal) * 100)}% OFF`
        }

        const cohortDate = record.startDate
          ? new Date(record.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
          : ""

        const seatsLeft =
          record.maxCapacity && record.maxCapacity > record.enrolledCount
            ? record.maxCapacity - record.enrolledCount
            : undefined

        const badge = record.isBestseller
          ? "MOST POPULAR"
          : record.isFeatured
            ? "FEATURED TRACK"
            : ""

        const itemCategory = (record as any).category

        return {
          id: String(record.id),
          slug: record.slug,
          name: record.title,
          type: record.type as "COURSE" | "INTERNSHIP",
          category: (itemCategory?.slug || "technology") as any,
          categoryLabel: itemCategory?.name || "General",
          summary: record.shortDescription || record.description || "",
          description: record.description || record.shortDescription || "",
          durationOptions: defaultDuration ? [defaultDuration] : [],
          defaultDuration,
          internshipAvailable: record.type === "INTERNSHIP",
          certificateAvailable: record.certificateOffered ?? true,
          whoItsFor: prerequisites,
          learningOutcomes,
          structure,
          overview: record.description || record.shortDescription || "",
          programSlug: record.slug,
          eligibility: prerequisites,
          completionProcess: [],
          certificateProcess: [],
          extensionNote: "",
          internshipRelationship: "",
          certificateNote: record.certificateOffered
            ? "Awarded upon successful completion of all curriculum milestones."
            : "",
          image: {
            src: imageSrc,
            alt: record.title,
          },
          relatedInternshipSlugs: [],
          faqs: [],
          price: record.price,
          discountPrice: record.discountPrice,
          formattedPrice,
          formattedOriginalPrice,
          discountPercentage,
          rating: record.rating > 0 ? record.rating.toFixed(1) : "",
          reviewsCount: record.ratingCount > 0 ? record.ratingCount.toLocaleString("en-IN") : "",
          cohortDate,
          seatsLeft,
          badge,
          level: record.level,
          deliveryMode: record.deliveryMode,
          tags,
          isBestseller: record.isBestseller,
          isFeatured: record.isFeatured,
        }
      }

      const adapted = (rawPrograms as any[]).map(adaptItem)
      const courses = adapted.filter((p) => p.type === "COURSE")
      const internships = adapted.filter((p) => p.type === "INTERNSHIP")

      return { courses, internships, all: adapted }
    } catch (err) {
      console.error("[getHomeProgramsFn] DB query error:", err)
      return { courses: [], internships: [], all: [] }
    }
  })


