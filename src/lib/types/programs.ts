import type { Program, ProgramCategory } from "../../../generated/prisma/client"

export interface ProgramCategoryItem extends ProgramCategory {
  _count?: {
    programs: number
  }
}

export interface ProgramRecordItem extends Program {
  category: {
    id: number
    name: string
    slug: string
  }
}

export interface ProgramStatsSummary {
  total: number
  courses: number
  internships: number
  published: number
  drafts: number
  totalEnrolled: number
}

export interface PaginatedProgramsResult {
  success: boolean
  data: ProgramRecordItem[]
  stats: ProgramStatsSummary
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

/**
 * Standard structured JSON image payload stored in database
 */
export interface ImageType {
  id: string
  url: string
  bytes: number
  format: string
  provider: "CLOUDINARY" | "AWS_S3" | "LOCAL"
}

/**
 * Standard structured JSON document / PDF payload stored in database
 */
export interface DocumentType {
  id: string
  url: string
  bytes: number
  format: string
  provider: "CLOUDINARY" | "AWS_S3" | "LOCAL"
  fileName?: string
}

/**
 * Pure client/server utility to generate slug without pulling backend dependencies
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Safely resolves an image URL from either a structured ImageType JSON object or a legacy string URL
 */
export function resolveImageUrl(image: unknown, fallbackUrl = ""): string {
  if (!image) return fallbackUrl
  if (typeof image === "string") return image
  if (typeof image === "object" && image !== null) {
    const img = image as Record<string, any>
    return img.url || img.secureUrl || fallbackUrl
  }
  return fallbackUrl
}

/**
 * Safely resolves a document URL from either a structured DocumentType JSON object or a string URL
 */
export function resolveDocumentUrl(doc: unknown, fallbackUrl = ""): string {
  if (!doc) return fallbackUrl
  if (typeof doc === "string") return doc
  if (typeof doc === "object" && doc !== null) {
    const d = doc as Record<string, any>
    return d.url || d.secureUrl || fallbackUrl
  }
  return fallbackUrl
}
