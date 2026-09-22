import { prisma } from "@/lib/prisma"
import { serverCache } from "@/lib/server/cache"
import { generateReceiptNumber } from "@/lib/services/payments"
import {
  createEnrollmentSchema,
  extendInternshipSchema,
  updateEnrollmentSchema,
  enrollmentFilterSchema,
  type CreateEnrollmentInput,
  type ExtendInternshipInput,
  type UpdateEnrollmentInput,
  type EnrollmentFilterInput,
} from "@/lib/validation/enrollment"

export interface ExtensionHistoryItem {
  id: string
  extendedByAdminId?: number | null
  extendedByAdminName?: string | null
  extendedAt: string
  addedWeeks: number
  previousEndDate: string
  newEndDate: string
  reason: string
}

/**
 * Generate a unique, professional enrollment number (e.g. ENR-2026-00412)
 */
export async function generateEnrollmentNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const count = prisma.programEnrollment ? await prisma.programEnrollment.count() : 0
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  return `ENR-${currentYear}-${String(count + 1).padStart(4, "0")}${randomSuffix}`
}


/**
 * Calculate the expected completion end date based on duration parameters
 */
export function calculateExpectedEndDate(
  startDate: Date,
  durationWeeks?: number | null,
  durationMonths?: number | null,
  fallbackDurationStr?: string | null
): Date {
  const end = new Date(startDate.getTime())

  if (durationWeeks && durationWeeks > 0) {
    end.setDate(end.getDate() + durationWeeks * 7)
    return end
  }

  if (durationMonths && durationMonths > 0) {
    end.setMonth(end.getMonth() + durationMonths)
    return end
  }

  // Parse string if available e.g. "8 weeks", "3 months", "6 months"
  if (fallbackDurationStr) {
    const lower = fallbackDurationStr.toLowerCase()
    const weeksMatch = lower.match(/(\d+)\s*week/)
    if (weeksMatch && weeksMatch[1]) {
      end.setDate(end.getDate() + parseInt(weeksMatch[1], 10) * 7)
      return end
    }

    const monthsMatch = lower.match(/(\d+)\s*month/)
    if (monthsMatch && monthsMatch[1]) {
      end.setMonth(end.getMonth() + parseInt(monthsMatch[1], 10))
      return end
    }
  }

  // Default: 8 weeks
  end.setDate(end.getDate() + 8 * 7)
  return end
}

/**
 * Create a new program/internship enrollment for a student
 */
export async function createEnrollment(rawInput: CreateEnrollmentInput) {
  const input = createEnrollmentSchema.parse(rawInput)

  if (!prisma.programEnrollment) {
    throw new Error("Database schema delegate is initializing. Please refresh.")
  }

  // 1. Validate student exists (check User ID or StudentProfile ID)
  let resolvedUserId = input.userId
  let student = await prisma.user.findUnique({
    where: { id: input.userId },
    include: { studentProfile: true },
  })

  if (!student) {
    const profile = await prisma.studentProfile.findUnique({
      where: { id: input.userId },
      include: { user: { include: { studentProfile: true } } },
    })
    if (profile && profile.user) {
      student = profile.user
      resolvedUserId = profile.userId
    }
  }

  if (!student) {
    throw new Error(`Student with ID ${input.userId} does not exist.`)
  }

  // 2. Validate program exists
  const program = await prisma.program.findUnique({
    where: { id: input.programId },
    include: { category: true },
  })
  if (!program) {
    throw new Error(`Program with ID ${input.programId} does not exist.`)
  }

  // 3. Prevent duplicate active enrollment
  const existingActive = await prisma.programEnrollment.findFirst({
    where: {
      userId: resolvedUserId,
      programId: input.programId,
      status: { in: ["ACTIVE", "EXTENDED", "PENDING"] },
    },
  })
  if (existingActive) {
    throw new Error(
      `Student "${student.name}" is already actively enrolled in "${program.title}" (Enrollment: ${existingActive.enrollmentNumber}).`
    )
  }

  // 4. Calculate start and expected end date
  const start = input.startDate ? new Date(input.startDate) : new Date()
  const expectedEnd = input.expectedEndDate
    ? new Date(input.expectedEndDate)
    : calculateExpectedEndDate(start, input.durationWeeks, input.durationMonths, program.duration)

  // 5. Determine enrollment code (custom or auto-generated)
  let enrollmentNumber: string
  if (input.enrollmentNumber && input.enrollmentNumber.trim()) {
    const customNum = input.enrollmentNumber.trim()
    const duplicate = await prisma.programEnrollment.findUnique({
      where: { enrollmentNumber: customNum },
    })
    if (duplicate) {
      throw new Error(`Enrollment number "${customNum}" is already in use. Please generate or choose a different one.`)
    }
    enrollmentNumber = customNum
  } else {
    enrollmentNumber = await generateEnrollmentNumber()
  }

  // 6. Transactional enrollment creation + enrolled count increment
  const enrollment = await prisma.$transaction(async (tx) => {
    const created = await tx.programEnrollment.create({
      data: {
        enrollmentNumber,
        userId: resolvedUserId,
        programId: input.programId,
        status: input.status,
        source: input.source,
        adminAssignedById: input.adminAssignedById || null,
        durationWeeks: input.durationWeeks || null,
        durationMonths: input.durationMonths || null,
        startDate: start,
        expectedEndDate: expectedEnd,
        paymentStatus: input.paymentStatus,
        amountPaid: input.amountPaid,
        currency: input.currency,
        paymentReference: input.paymentReference?.trim() || null,
        mentorName: input.mentorName?.trim() || null,
        mentorEmail: input.mentorEmail?.trim() || null,
        adminNotes: input.adminNotes?.trim() || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            studentProfile: true,
          },
        },
        program: {
          include: {
            category: true,
          },
        },
        adminAssignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Increment program enrolledCount
    await tx.program.update({
      where: { id: input.programId },
      data: { enrolledCount: { increment: 1 } },
    })

    // If an initial payment was made, automatically record a PaymentTransaction
    if (input.amountPaid && input.amountPaid > 0) {
      const receiptNumber = await generateReceiptNumber()
      await tx.paymentTransaction.create({
        data: {
          receiptNumber,
          enrollmentId: created.id,
          userId: resolvedUserId,
          amount: input.amountPaid,
          currency: input.currency || "INR",
          type: "PAYMENT",
          status: "SUCCESS",
          gateway: "MANUAL_ADMIN",
          method: "UPI",
          transactionReference: input.paymentReference?.trim() || null,
          recordedById: input.adminAssignedById || null,
          notes: "Initial tuition payment recorded during enrollment creation.",
          paidAt: start,
        },
      })
    }

    return created
  })

  // Invalidate cache
  serverCache.invalidateTags(["enrollments", "programs", "students", "payments"])

  return enrollment
}

/**
 * Extend an internship or program duration period with an immutable audit trail
 */
export async function extendInternshipPeriod(rawInput: ExtendInternshipInput) {
  const input = extendInternshipSchema.parse(rawInput)

  if (!prisma.programEnrollment) {
    throw new Error("Database schema delegate is initializing. Please refresh.")
  }

  const enrollment = await prisma.programEnrollment.findUnique({
    where: { id: input.enrollmentId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      program: { select: { id: true, title: true, type: true } },
    },
  })

  if (!enrollment) {
    throw new Error(`Enrollment with ID ${input.enrollmentId} not found.`)
  }

  // Calculate current baseline end date
  const currentEffectiveEnd = enrollment.extendedUntil
    ? new Date(enrollment.extendedUntil)
    : new Date(enrollment.expectedEndDate)

  // Calculate new end date by adding addedWeeks * 7 days
  const newEndDate = new Date(currentEffectiveEnd.getTime())
  newEndDate.setDate(newEndDate.getDate() + input.addedWeeks * 7)

  // Create audit record
  const extensionRecord: ExtensionHistoryItem = {
    id: `ext_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    extendedByAdminId: input.adminId || null,
    extendedByAdminName: input.adminName || "Administrator",
    extendedAt: new Date().toISOString(),
    addedWeeks: input.addedWeeks,
    previousEndDate: currentEffectiveEnd.toISOString(),
    newEndDate: newEndDate.toISOString(),
    reason: input.reason.trim(),
  }

  // Existing history array
  const currentHistory = Array.isArray(enrollment.extensionHistory)
    ? (enrollment.extensionHistory as unknown as ExtensionHistoryItem[])
    : []

  const updatedHistory = [...currentHistory, extensionRecord]
  const cumulativeWeeks = (enrollment.extendedWeeks || 0) + input.addedWeeks

  // Update status to EXTENDED if it was ACTIVE
  const newStatus = enrollment.status === "ACTIVE" ? "EXTENDED" : enrollment.status

  const updated = await prisma.programEnrollment.update({
    where: { id: input.enrollmentId },
    data: {
      isExtended: true,
      extendedWeeks: cumulativeWeeks,
      extendedUntil: newEndDate,
      lastExtensionReason: input.reason.trim(),
      extensionHistory: updatedHistory as unknown as object,
      status: newStatus,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          studentProfile: true,
        },
      },
      program: {
        include: {
          category: true,
        },
      },
      adminAssignedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  serverCache.invalidateTags(["enrollments", "students"])

  return updated
}

/**
 * Update an existing enrollment record
 */
export async function updateEnrollment(id: number, rawInput: UpdateEnrollmentInput) {
  const input = updateEnrollmentSchema.parse(rawInput)

  if (!prisma.programEnrollment) {
    throw new Error("Database schema delegate is initializing. Please refresh.")
  }

  const existing = await prisma.programEnrollment.findUnique({
    where: { id },
  })
  if (!existing) {
    throw new Error(`Enrollment with ID ${id} does not exist.`)
  }

  const dataToUpdate: Record<string, unknown> = {}

  let programChanged = false
  let oldProgramId = existing.programId

  if (input.enrollmentNumber !== undefined && input.enrollmentNumber.trim() && input.enrollmentNumber.trim() !== existing.enrollmentNumber) {
    const customNum = input.enrollmentNumber.trim()
    const duplicate = await prisma.programEnrollment.findUnique({
      where: { enrollmentNumber: customNum },
    })
    if (duplicate && duplicate.id !== id) {
      throw new Error(`Enrollment number "${customNum}" is already in use by another student.`)
    }
    dataToUpdate.enrollmentNumber = customNum
  }

  if (input.programId !== undefined && input.programId !== existing.programId) {
    const programExists = await prisma.program.findUnique({
      where: { id: input.programId },
    })
    if (!programExists) {
      throw new Error(`Program with ID ${input.programId} does not exist.`)
    }
    dataToUpdate.programId = input.programId
    programChanged = true
  }

  if (input.status !== undefined) dataToUpdate.status = input.status
  if (input.durationWeeks !== undefined) dataToUpdate.durationWeeks = input.durationWeeks
  if (input.durationMonths !== undefined) dataToUpdate.durationMonths = input.durationMonths
  if (input.startDate !== undefined) dataToUpdate.startDate = new Date(input.startDate)
  if (input.expectedEndDate !== undefined) dataToUpdate.expectedEndDate = new Date(input.expectedEndDate)
  if (input.actualEndDate !== undefined) {
    dataToUpdate.actualEndDate = input.actualEndDate ? new Date(input.actualEndDate) : null
  }
  if (input.progressPercent !== undefined) dataToUpdate.progressPercent = input.progressPercent
  if (input.grade !== undefined) dataToUpdate.grade = input.grade?.trim() || null
  if (input.mentorName !== undefined) dataToUpdate.mentorName = input.mentorName?.trim() || null
  if (input.mentorEmail !== undefined) dataToUpdate.mentorEmail = input.mentorEmail?.trim() || null
  if (input.certificateIssued !== undefined) dataToUpdate.certificateIssued = input.certificateIssued
  if (input.certificateId !== undefined) dataToUpdate.certificateId = input.certificateId?.trim() || null
  if (input.paymentStatus !== undefined) dataToUpdate.paymentStatus = input.paymentStatus
  if (input.amountPaid !== undefined) dataToUpdate.amountPaid = input.amountPaid
  if (input.paymentReference !== undefined) dataToUpdate.paymentReference = input.paymentReference?.trim() || null
  if (input.adminNotes !== undefined) dataToUpdate.adminNotes = input.adminNotes?.trim() || null

  const updated = await prisma.$transaction(async (tx) => {
    const res = await tx.programEnrollment.update({
      where: { id },
      data: dataToUpdate,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            studentProfile: true,
          },
        },
        program: {
          include: {
            category: true,
          },
        },
      },
    })

    if (programChanged && input.programId) {
      // Decrement old program count
      await tx.program.update({
        where: { id: oldProgramId },
        data: { enrolledCount: { decrement: 1 } },
      })
      // Increment new program count
      await tx.program.update({
        where: { id: input.programId },
        data: { enrolledCount: { increment: 1 } },
      })
    }

    return res
  })

  serverCache.invalidateTags(["enrollments", "programs", "students"])

  return updated
}

/**
 * Get paginated list of enrollments with rich filtering
 */
export async function getEnrollments(rawFilter?: Partial<EnrollmentFilterInput>) {
  const filter = enrollmentFilterSchema.parse(rawFilter || {})
  const { page, limit, userId, programId, status, programType, isExtended, search } = filter
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (userId) where.userId = userId
  if (programId) where.programId = programId
  if (status) where.status = status
  if (isExtended !== undefined) where.isExtended = isExtended

  if (programType) {
    where.program = { type: programType }
  }

  if (search && search.trim()) {
    const query = search.trim()
    where.OR = [
      { enrollmentNumber: { contains: query, mode: "insensitive" } },
      { user: { name: { contains: query, mode: "insensitive" } } },
      { user: { email: { contains: query, mode: "insensitive" } } },
      { program: { title: { contains: query, mode: "insensitive" } } },
      { mentorName: { contains: query, mode: "insensitive" } },
    ]
  }

  if (!prisma.programEnrollment) {
    console.warn("Prisma Client programEnrollment delegate not initialized yet in this worker.")
    return {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 1,
    }
  }

  const [total, items] = await Promise.all([
    prisma.programEnrollment.count({ where }),
    prisma.programEnrollment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            studentProfile: true,
          },
        },
        program: {
          include: {
            category: true,
          },
        },
        adminAssignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ])

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

/**
 * Get a single enrollment by ID
 */
export async function getEnrollmentById(id: number) {
  if (!prisma.programEnrollment) {
    throw new Error("Enrollment service is initializing. Please refresh.")
  }

  const enrollment = await prisma.programEnrollment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          studentProfile: true,
        },
      },
      program: {
        include: {
          category: true,
        },
      },
      adminAssignedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!enrollment) {
    throw new Error(`Enrollment with ID ${id} not found.`)
  }

  return enrollment
}

/**
 * Delete an enrollment record
 */
export async function deleteEnrollment(id: number) {
  if (!prisma.programEnrollment) {
    throw new Error("Enrollment service is initializing. Please refresh.")
  }

  const enrollment = await prisma.programEnrollment.findUnique({
    where: { id },
  })
  if (!enrollment) {
    throw new Error(`Enrollment with ID ${id} not found.`)
  }

  await prisma.$transaction(async (tx) => {
    await tx.programEnrollment.delete({ where: { id } })
    // Decrement program enrolled count
    await tx.program.update({
      where: { id: enrollment.programId },
      data: {
        enrolledCount: {
          decrement: 1,
        },
      },
    })
  })

  serverCache.invalidateTags(["enrollments", "programs", "students"])

  return { success: true, message: `Enrollment ${enrollment.enrollmentNumber} deleted successfully.` }
}

export interface EnrollmentStatsSummary {
  total: number
  active: number
  activeCourses: number
  activeInternships: number
  extendedInternships: number
  completed: number
}

/**
 * Get aggregated statistics for the enrollments console
 */
export async function getEnrollmentStats(): Promise<EnrollmentStatsSummary> {
  if (!prisma.programEnrollment) {
    console.warn("Prisma Client programEnrollment delegate not initialized yet in this worker.")
    return {
      total: 0,
      active: 0,
      activeCourses: 0,
      activeInternships: 0,
      extendedInternships: 0,
      completed: 0,
    }
  }

  const [
    total,
    active,
    activeCourses,
    activeInternships,
    extendedInternships,
    completed,
  ] = await Promise.all([
    prisma.programEnrollment.count(),
    prisma.programEnrollment.count({ where: { status: { in: ["ACTIVE", "EXTENDED"] } } }),
    prisma.programEnrollment.count({ where: { status: { in: ["ACTIVE", "EXTENDED"] }, program: { type: "COURSE" } } }),
    prisma.programEnrollment.count({ where: { status: { in: ["ACTIVE", "EXTENDED"] }, program: { type: "INTERNSHIP" } } }),
    prisma.programEnrollment.count({ where: { isExtended: true } }),
    prisma.programEnrollment.count({ where: { status: "COMPLETED" } }),
  ])

  return {
    total,
    active,
    activeCourses,
    activeInternships,
    extendedInternships,
    completed,
  }
}


export type EnrollmentRecordItem = Awaited<ReturnType<typeof getEnrollments>>["items"][number]
