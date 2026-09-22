import { internships as staticInternships } from "@/lib/data/internships"
import { programs as staticPrograms } from "@/lib/data/programs"
import { faqItems } from "@/lib/data/faq"
import { services } from "@/lib/data/services"
import { testimonials } from "@/lib/data/testimonials"
import type { Internship, Program, ProgramCategory } from "@/lib/types"
import { prisma } from "@/lib/prisma"
import { serverCache } from "@/lib/server/cache"
import { resolveImageUrl, type ProgramRecordItem } from "@/lib/types/programs"

function mapCategorySlug(categorySlug: string): ProgramCategory {
  const normalized = (categorySlug || "").toLowerCase().trim()
  if (normalized.includes("tech") || normalized.includes("code") || normalized.includes("digital") || normalized.includes("ai") || normalized.includes("software")) {
    return "technology"
  }
  if (normalized.includes("biz") || normalized.includes("business") || normalized.includes("manage") || normalized.includes("consult")) {
    return "business"
  }
  if (normalized.includes("design") || normalized.includes("ui") || normalized.includes("creative") || normalized.includes("visual")) {
    return "design"
  }
  if (normalized.includes("comm") || normalized.includes("media") || normalized.includes("journalism") || normalized.includes("pr")) {
    return "communications"
  }
  return "operations"
}

function adaptProgramRecordToProgram(record: ProgramRecordItem): Program {
  const highlights = Array.isArray(record.highlights) ? (record.highlights as string[]) : []
  const learningOutcomes = Array.isArray(record.learningOutcomes) ? (record.learningOutcomes as string[]) : []
  const prerequisites = Array.isArray(record.prerequisites) ? (record.prerequisites as string[]) : []
  const tags = Array.isArray(record.tags) ? (record.tags as string[]) : []

  const priceVal = record.discountPrice || record.price || 2499
  const originalPriceVal = record.discountPrice ? record.price : (record.price ? Math.round(record.price * 1.8) : 4999)
  const discountVal = originalPriceVal > priceVal ? `${Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100)}% OFF` : "SPECIAL OFFER"

  const structure = highlights.length > 0
    ? highlights.map((h, i) => ({
        title: `Phase 0${i + 1}: ${h}`,
        detail: `Supervised execution sprint focusing on ${h.toLowerCase()} with mentor checkpoints and milestone deliverables.`,
      }))
    : [
        { title: "Phase 01: Foundations & Diagnostic Brief", detail: "Workspace orientation, core methodology review, and baseline milestone scoping." },
        { title: "Phase 02: Supervised Execution Sprints", detail: "Guided execution of weekly project deliverables with senior supervisor reviews." },
        { title: "Phase 03: Industry Deliverable Finalization", detail: "Full-scale project builds meeting enterprise quality and compliance standards." },
        { title: "Phase 04: Portfolio Dossier & Verification", detail: "Supervisor evaluation, letter of completion, and immutable QR credential registry." },
      ]

  const defaultDuration = record.duration || (record.durationHours ? `${Math.round(record.durationHours / 10)} Weeks` : "8 Weeks")

  const imageSrc = resolveImageUrl(record.banner) || resolveImageUrl(record.thumbnail) || `/images/programs/${record.slug}.jpg`

  return {
    id: String(record.id),
    slug: record.slug,
    name: record.title,
    category: mapCategorySlug(record.category.slug),
    categoryLabel: record.category.name,
    summary: record.shortDescription || record.description?.slice(0, 160) || "Structured curriculum track pairing academic rigor with practical internship deliverables.",
    description: record.description || record.shortDescription || "Comprehensive curriculum track designed for hands-on mastery with verified company supervision.",
    durationOptions: [defaultDuration, "12 Weeks"],
    defaultDuration,
    internshipAvailable: true,
    certificateAvailable: record.certificateOffered ?? true,
    whoItsFor: prerequisites.length > 0 ? prerequisites : ["Undergraduate & postgraduate students", "Early-career professionals", "Career transitioners seeking proof of work"],
    learningOutcomes: learningOutcomes.length > 0 ? learningOutcomes : ["Mastery of industry workflows and modern toolchains", "Supervisor-reviewed project deliverables", "Tamper-evident QR certificate for resume and LinkedIn"],
    structure,
    internshipRelationship: `Pairs directly with the ${record.category.name} Internship Track for supervised practical experience.`,
    certificateNote: "Awarded upon successful completion of all curriculum milestones, practical logs, and supervisor evaluation.",
    image: {
      src: imageSrc,
      alt: record.title,
    },
    relatedInternshipSlugs: [`${record.slug}-internship`, record.slug],
    faqs: [
      {
        question: `How is the ${record.title} curriculum structured?`,
        answer: "The program is delivered 100% online in weekly structured phases with supervised task logs, milestone feedback, and project reviews.",
      },
      {
        question: "Is the completion certificate publicly verifiable?",
        answer: "Yes, every certificate is cryptographically recorded with a permanent QR code on our public verification registry.",
      },
      {
        question: "Can I do this program alongside college or work?",
        answer: "Yes, the program requires 8-12 hours per week with flexible sprint milestones designed specifically for university students and working professionals.",
      },
    ],
    price: record.price,
    discountPrice: record.discountPrice,
    formattedPrice: `₹${priceVal.toLocaleString("en-IN")}`,
    formattedOriginalPrice: `₹${originalPriceVal.toLocaleString("en-IN")}`,
    discountPercentage: discountVal,
    rating: record.rating ? record.rating.toFixed(1) : "4.8",
    reviewsCount: record.ratingCount ? record.ratingCount.toLocaleString("en-IN") : "950",
    cohortDate: "Oct 15",
    seatsLeft: 6,
    badge: record.isBestseller ? "MOST POPULAR" : record.isFeatured ? "FEATURED TRACK" : "ACTIVE TRACK",
    level: record.level,
    deliveryMode: record.deliveryMode,
    tags,
    isBestseller: record.isBestseller,
    isFeatured: record.isFeatured,
  }
}

function adaptProgramRecordToInternship(record: ProgramRecordItem): Internship {
  const highlights = Array.isArray(record.highlights) ? (record.highlights as string[]) : []
  const prerequisites = Array.isArray(record.prerequisites) ? (record.prerequisites as string[]) : []

  const priceVal = record.discountPrice || record.price || 1999
  const originalPriceVal = record.discountPrice ? record.price : (record.price ? Math.round(record.price * 1.8) : 3999)
  const discountVal = originalPriceVal > priceVal ? `${Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100)}% OFF` : "SPECIAL OFFER"

  const defaultDuration = record.duration || "8 Weeks"
  const imageSrc = resolveImageUrl(record.thumbnail) || resolveImageUrl(record.banner) || `/images/internships/${record.slug}.jpg`

  const structure = highlights.length > 0
    ? highlights.map((h, i) => ({
        title: `Sprint 0${i + 1}: ${h}`,
        detail: `Hands-on practical sprint addressing ${h.toLowerCase()} under mentor review and industry standards.`,
      }))
    : [
        { title: "Sprint 01: Onboarding & Project Brief", detail: "Workspace configuration, scope clarification, and initial sprint deliverables." },
        { title: "Sprint 02: Supervised Execution", detail: "Weekly deliverable submissions with structured mentor evaluations." },
        { title: "Sprint 03: Applied Project Finalization", detail: "Completing full-scope industry deliverables, documentation, and reports." },
        { title: "Sprint 04: Final Dossier & Evaluation", detail: "Supervisor evaluation, completion sign-off, and QR credentialing." },
      ]

  const isAlreadyInternshipSlug = record.slug.endsWith("-internship")
  const internshipSlug = isAlreadyInternshipSlug ? record.slug : `${record.slug}-internship`
  const programSlug = isAlreadyInternshipSlug ? record.slug.replace(/-internship$/, "") : record.slug

  return {
    id: String(record.id),
    slug: internshipSlug,
    name: record.type === "INTERNSHIP" ? record.title : `${record.title} Internship Track`,
    category: mapCategorySlug(record.category.slug),
    categoryLabel: record.category.name,
    summary: record.shortDescription || record.description?.slice(0, 160) || "Supervised company internship track building verifiable proof of work.",
    overview: record.description || record.shortDescription || "Gain supervised industry experience with structured deliverables, weekly mentor reviews, and tamper-evident QR verification.",
    programSlug,
    durationOptions: [defaultDuration, "12 Weeks"],
    defaultDuration,
    eligibility: prerequisites.length > 0 ? prerequisites : ["Enrolled student or recent graduate", "Basic domain familiarity", "Commitment of 8-12 hrs/week"],
    structure,
    completionProcess: [
      "Complete weekly supervisor sprints and submit task logs",
      "Participate in milestone review check-ins",
      "Deliver final project dossier adhering to enterprise specifications",
      "Pass final supervisor assessment to receive verifiable credential",
    ],
    certificateProcess: [
      "Supervisor audit and performance evaluation scoring",
      "Cryptographic credential ID generation with QR code",
      "Publication to our public verification registry",
    ],
    extensionNote: "Participants may request an extension of up to 4 weeks with supervisor approval for expanded capstone scope.",
    image: {
      src: imageSrc,
      alt: record.title,
    },
    faqs: [
      {
        question: `What are the weekly time commitments for this internship?`,
        answer: "Interns dedicate 8-12 hours per week to complete structured briefs, submit task logs, and attend weekly check-ins.",
      },
      {
        question: "Will I receive an official certificate and letter of completion?",
        answer: "Yes, successful interns receive a tamper-evident certificate with QR verification and a performance evaluation dossier.",
      },
      {
        question: "Is this internship accepted for university credit/NOC?",
        answer: "Yes, our structured supervisory documentation and verification portal are specifically designed to fulfill university internship requirements.",
      },
    ],
    price: record.price,
    discountPrice: record.discountPrice,
    formattedPrice: `₹${priceVal.toLocaleString("en-IN")}`,
    formattedOriginalPrice: `₹${originalPriceVal.toLocaleString("en-IN")}`,
    discountPercentage: discountVal,
    rating: record.rating ? record.rating.toFixed(1) : "4.8",
    reviewsCount: record.ratingCount ? record.ratingCount.toLocaleString("en-IN") : "900",
    cohortDate: "Oct 15",
    badge: record.isBestseller ? "MOST POPULAR" : "SUPERVISED TRACK",
  }
}

/* =========================================================================
   PUBLIC CONTENT API METHODS (WITH DB INTEGRATION & CACHING)
   ========================================================================= */

export async function listPrograms(): Promise<Program[]> {
  try {
    const cached = await serverCache.getOrSet(
      "public:programs:list",
      async () => {
        const records = await prisma.program.findMany({
          where: {
            isActive: true,
            status: "PUBLISHED",
          },
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
          orderBy: [
            { isFeatured: "desc" },
            { isBestseller: "desc" },
            { rating: "desc" },
            { id: "asc" },
          ],
        })
        return records as ProgramRecordItem[]
      },
      { ttlSeconds: 60, tags: ["programs", "public_programs"] }
    )

    if (cached && cached.length > 0) {
      return cached.map(adaptProgramRecordToProgram)
    }
  } catch (error) {
    console.error("[listPrograms] Error fetching from database, using static fallback:", error)
  }

  return staticPrograms
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  try {
    const cached = await serverCache.getOrSet(
      `public:program:slug:${slug}`,
      async () => {
        const record = await prisma.program.findUnique({
          where: { slug },
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        })
        return (record as ProgramRecordItem) || null
      },
      { ttlSeconds: 60, tags: ["programs", `program:${slug}`] }
    )

    if (cached) {
      return adaptProgramRecordToProgram(cached)
    }
  } catch (error) {
    console.error(`[getProgramBySlug] Error fetching slug "${slug}":`, error)
  }

  return staticPrograms.find((program) => program.slug === slug)
}

export async function listInternships(): Promise<Internship[]> {
  try {
    const cached = await serverCache.getOrSet(
      "public:internships:list",
      async () => {
        // Query both dedicated INTERNSHIP type or all published programs to make into internships
        const records = await prisma.program.findMany({
          where: {
            isActive: true,
            status: "PUBLISHED",
          },
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
          orderBy: [
            { isFeatured: "desc" },
            { isBestseller: "desc" },
            { rating: "desc" },
            { id: "asc" },
          ],
        })
        return records as ProgramRecordItem[]
      },
      { ttlSeconds: 60, tags: ["programs", "public_internships"] }
    )

    if (cached && cached.length > 0) {
      return cached.map(adaptProgramRecordToInternship)
    }
  } catch (error) {
    console.error("[listInternships] Error fetching from database, using static fallback:", error)
  }

  return staticInternships
}

export async function getInternshipBySlug(slug: string): Promise<Internship | undefined> {
  try {
    // Check if slug has -internship suffix or matches base slug
    const cleanSlug = slug.replace(/-internship$/, "")

    const cached = await serverCache.getOrSet(
      `public:internship:slug:${slug}`,
      async () => {
        const record = await prisma.program.findFirst({
          where: {
            OR: [
              { slug },
              { slug: cleanSlug },
            ],
          },
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        })
        return (record as ProgramRecordItem) || null
      },
      { ttlSeconds: 60, tags: ["programs", `internship:${slug}`] }
    )

    if (cached) {
      return adaptProgramRecordToInternship(cached)
    }
  } catch (error) {
    console.error(`[getInternshipBySlug] Error fetching slug "${slug}":`, error)
  }

  return staticInternships.find((internship) => internship.slug === slug || internship.slug === `${slug}-internship` || internship.programSlug === slug)
}

export async function getInternshipForProgram(programSlug: string): Promise<Internship | undefined> {
  try {
    const cached = await serverCache.getOrSet(
      `public:program_internship:${programSlug}`,
      async () => {
        const record = await prisma.program.findFirst({
          where: {
            slug: programSlug,
          },
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        })
        return (record as ProgramRecordItem) || null
      },
      { ttlSeconds: 60, tags: ["programs", `program:${programSlug}`] }
    )

    if (cached) {
      return adaptProgramRecordToInternship(cached)
    }
  } catch (error) {
    console.error(`[getInternshipForProgram] Error fetching for program "${programSlug}":`, error)
  }

  return staticInternships.find((internship) => internship.programSlug === programSlug || internship.slug === `${programSlug}-internship`)
}

export async function listFaq() {
  return faqItems
}

export async function listFeaturedFaq() {
  return faqItems.filter((item) => item.featured)
}

export async function listServices() {
  return services
}

export async function listTestimonials() {
  return testimonials
}
