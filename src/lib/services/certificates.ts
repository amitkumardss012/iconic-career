import { prisma } from "@/lib/prisma"
import { serverCache } from "@/lib/server/cache"
import {
  issueCertificateSchema,
  updateCertificateSchema,
  certificateFilterSchema,
  revokeCertificateSchema,
  toggleDownloadSchema,
  type IssueCertificateInput,
  type UpdateCertificateInput,
  type CertificateFilterInput,
  type RevokeCertificateInput,
  type ToggleDownloadInput,
  type CertificateSnapshotInput,
} from "@/lib/validation/certificate"

export interface CertificateRecordItem {
  id: number
  certificateNumber: string
  enrollmentId: number
  userId: number
  programId: number
  issuedById?: number | null
  status: "ISSUED" | "REVOKED" | "SUSPENDED"
  isDownloadAllowed: boolean
  issueDate: Date | string
  validUntil?: Date | string | null
  grade?: string | null
  percentage?: number | null
  durationText?: string | null
  snapshotData?: CertificateSnapshotInput | null
  fileUrl?: string | null
  fileMetadata?: any
  downloadCount: number
  lastDownloadedAt?: Date | string | null
  viewCount: number
  lastViewedAt?: Date | string | null
  revokedAt?: Date | string | null
  revocationReason?: string | null
  revokedById?: number | null
  adminNotes?: string | null
  metadata?: any
  createdAt: Date | string
  updatedAt: Date | string
  user: {
    id: number
    name: string
    email: string
    phone?: string | null
    studentProfile?: {
      college?: string
      department?: string
      course?: string
      registrationNumber?: string
    } | null
  }
  program: {
    id: number
    title: string
    slug: string
    type: "COURSE" | "INTERNSHIP"
    duration?: string | null
  }
  enrollment: {
    id: number
    enrollmentNumber: string
    status: string
    startDate: Date | string
    expectedEndDate: Date | string
    grade?: string | null
    progressPercent?: number
  }
  issuedBy?: {
    id: number
    name: string
    email: string
  } | null
  revokedBy?: {
    id: number
    name: string
    email: string
  } | null
}

export interface CertificateStatsSummary {
  total: number
  issued: number
  revoked: number
  suspended: number
  downloadAllowed: number
  downloadLocked: number
  totalDownloads: number
}

/**
 * Generate a unique certificate number (e.g. IC-2026-0041289)
 */
export async function generateCertificateNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const count = prisma.certificate ? await prisma.certificate.count() : 0
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return `IC-${currentYear}-${String(count + 1).padStart(4, "0")}${randomSuffix}`
}

/**
 * Issue a new certificate for an enrollment
 */
export async function issueCertificate(rawInput: IssueCertificateInput) {
  const input = issueCertificateSchema.parse(rawInput)

  if (!prisma.certificate || !prisma.programEnrollment) {
    throw new Error("Database schema delegate is initializing. Please refresh.")
  }

  // 1. Fetch enrollment with related data
  const enrollment = await prisma.programEnrollment.findUnique({
    where: { id: input.enrollmentId },
    include: {
      user: {
        include: {
          studentProfile: true,
        },
      },
      program: true,
      certificate: true,
    },
  })

  if (!enrollment) {
    throw new Error(`Enrollment with ID #${input.enrollmentId} does not exist.`)
  }

  // 2. Generate or validate certificate number
  let finalCertNumber = input.certificateNumber?.trim()
  if (!finalCertNumber) {
    finalCertNumber = enrollment.certificate?.certificateNumber || (await generateCertificateNumber())
  } else {
    const existing = await prisma.certificate.findUnique({
      where: { certificateNumber: finalCertNumber },
    })
    if (existing && existing.enrollmentId !== enrollment.id) {
      throw new Error(`Certificate number "${finalCertNumber}" is already in use by another certificate. Please enter a unique number.`)
    }
  }

  // 3. Build snapshot data (auto-populated with fallbacks, respecting any admin overrides)
  const profile = enrollment.user.studentProfile
  const snapshot: CertificateSnapshotInput = {
    recipientName: input.snapshotData?.recipientName || enrollment.user.name,
    recipientEmail: input.snapshotData?.recipientEmail || enrollment.user.email,
    college: input.snapshotData?.college || profile?.college || "Not Specified",
    degree: input.snapshotData?.degree || profile?.degreeLevel || "",
    department: input.snapshotData?.department || profile?.department || profile?.course || "",
    programTitle: input.snapshotData?.programTitle || enrollment.program.title,
    programType: (input.snapshotData?.programType as "COURSE" | "INTERNSHIP") || (enrollment.program.type as "COURSE" | "INTERNSHIP") || "COURSE",
    durationText:
      input.snapshotData?.durationText ||
      input.durationText ||
      enrollment.program.duration ||
      `${enrollment.durationMonths || 2} Months`,
    mentorName: input.snapshotData?.mentorName || enrollment.mentorName || "",
    mentorEmail: input.snapshotData?.mentorEmail || enrollment.mentorEmail || "",
  }

  const issueDateObj = input.issueDate ? new Date(input.issueDate) : new Date()
  const validUntilObj = input.validUntil ? new Date(input.validUntil) : null

  // 4. Create or Update (Reissue) Certificate in DB
  let certificateResult
  if (enrollment.certificate) {
    // If enrollment already has a certificate, update/reissue with new values
    certificateResult = await prisma.certificate.update({
      where: { id: enrollment.certificate.id },
      data: {
        certificateNumber: finalCertNumber,
        status: input.status || "ISSUED",
        isDownloadAllowed: input.isDownloadAllowed ?? true,
        issueDate: issueDateObj,
        validUntil: validUntilObj,
        grade: input.grade || enrollment.grade || null,
        percentage: input.percentage !== undefined ? input.percentage : null,
        durationText: input.durationText || snapshot.durationText || null,
        snapshotData: snapshot as unknown as object,
        fileUrl: input.fileUrl || null,
        adminNotes: input.adminNotes || null,
        issuedById: input.issuedById || null,
      },
      include: {
        user: {
          include: { studentProfile: true },
        },
        program: true,
        enrollment: true,
        issuedBy: true,
      },
    })
  } else {
    certificateResult = await prisma.certificate.create({
      data: {
        certificateNumber: finalCertNumber,
        enrollmentId: enrollment.id,
        userId: enrollment.userId,
        programId: enrollment.programId,
        issuedById: input.issuedById || null,
        status: input.status || "ISSUED",
        isDownloadAllowed: input.isDownloadAllowed ?? true,
        issueDate: issueDateObj,
        validUntil: validUntilObj,
        grade: input.grade || enrollment.grade || null,
        percentage: input.percentage !== undefined ? input.percentage : null,
        durationText: input.durationText || snapshot.durationText || null,
        snapshotData: snapshot as unknown as object,
        fileUrl: input.fileUrl || null,
        adminNotes: input.adminNotes || null,
      },
      include: {
        user: {
          include: { studentProfile: true },
        },
        program: true,
        enrollment: true,
        issuedBy: true,
      },
    })
  }

  // 5. Synchronize ProgramEnrollment record
  await prisma.programEnrollment.update({
    where: { id: enrollment.id },
    data: {
      certificateIssued: true,
      certificateId: finalCertNumber,
      certificateIssuedAt: issueDateObj,
    },
  })

  // 6. Invalidate caches
  serverCache.invalidateTags(["certificates", "enrollments", "dashboard"])

  return certificateResult
}

/**
 * Update ALL fields of an existing certificate
 */
export async function updateCertificate(id: number, rawInput: UpdateCertificateInput) {
  const input = updateCertificateSchema.parse(rawInput)

  if (!prisma.certificate) {
    throw new Error("Database schema delegate is initializing. Please refresh.")
  }

  const existing = await prisma.certificate.findUnique({
    where: { id },
    include: { enrollment: true },
  })

  if (!existing) {
    throw new Error(`Certificate #${id} not found.`)
  }

  // Check unique certificate number if changed
  if (input.certificateNumber && input.certificateNumber.trim() !== existing.certificateNumber) {
    const duplicate = await prisma.certificate.findUnique({
      where: { certificateNumber: input.certificateNumber.trim() },
    })
    if (duplicate && duplicate.id !== id) {
      throw new Error(`Certificate number "${input.certificateNumber}" is already in use.`)
    }
  }

  // Prepare data updates
  const data: Record<string, unknown> = {}

  if (input.certificateNumber !== undefined) data.certificateNumber = input.certificateNumber.trim()
  if (input.status !== undefined) data.status = input.status
  if (input.isDownloadAllowed !== undefined) data.isDownloadAllowed = input.isDownloadAllowed
  if (input.issueDate !== undefined) data.issueDate = new Date(input.issueDate)
  if (input.validUntil !== undefined) data.validUntil = input.validUntil ? new Date(input.validUntil) : null
  if (input.grade !== undefined) data.grade = input.grade
  if (input.percentage !== undefined) data.percentage = input.percentage
  if (input.durationText !== undefined) data.durationText = input.durationText
  if (input.snapshotData !== undefined) data.snapshotData = input.snapshotData as unknown as object
  if (input.fileUrl !== undefined) data.fileUrl = input.fileUrl
  if (input.adminNotes !== undefined) data.adminNotes = input.adminNotes

  // Revocation handling
  if (input.status === "REVOKED" && existing.status !== "REVOKED") {
    data.revokedAt = input.revokedAt ? new Date(input.revokedAt) : new Date()
    data.revocationReason = input.revocationReason || "Revoked by administrative action."
    if (input.revokedById) data.revokedById = input.revokedById
  } else if (input.status && input.status !== "REVOKED" && existing.status === "REVOKED") {
    data.revokedAt = null
    data.revocationReason = null
    data.revokedById = null
  } else {
    if (input.revocationReason !== undefined) data.revocationReason = input.revocationReason
    if (input.revokedAt !== undefined) data.revokedAt = input.revokedAt ? new Date(input.revokedAt) : null
  }

  const updated = await prisma.certificate.update({
    where: { id },
    data,
    include: {
      user: {
        include: { studentProfile: true },
      },
      program: true,
      enrollment: true,
      issuedBy: true,
      revokedBy: true,
    },
  })

  // Synchronize ProgramEnrollment certificateId if number changed
  if (input.certificateNumber && existing.enrollment) {
    await prisma.programEnrollment.update({
      where: { id: existing.enrollment.id },
      data: {
        certificateId: input.certificateNumber.trim(),
        certificateIssuedAt: data.issueDate ? (data.issueDate as Date) : undefined,
      },
    })
  }

  // Invalidate caches
  serverCache.invalidateTags(["certificates", "enrollments", "dashboard"])

  return updated
}

/**
 * Toggle download permission for a certificate
 */
export async function toggleCertificateDownload(rawInput: ToggleDownloadInput) {
  const input = toggleDownloadSchema.parse(rawInput)

  const updated = await prisma.certificate.update({
    where: { id: input.certificateId },
    data: { isDownloadAllowed: input.isDownloadAllowed },
  })

  serverCache.invalidateTags(["certificates"])
  return updated
}

/**
 * Revoke a certificate
 */
export async function revokeCertificate(rawInput: RevokeCertificateInput) {
  const input = revokeCertificateSchema.parse(rawInput)

  const updated = await prisma.certificate.update({
    where: { id: input.certificateId },
    data: {
      status: "REVOKED",
      revocationReason: input.reason,
      revokedAt: new Date(),
      revokedById: input.adminId || null,
    },
    include: {
      user: true,
      program: true,
      enrollment: true,
    },
  })

  serverCache.invalidateTags(["certificates", "enrollments"])
  return updated
}

/**
 * Delete a certificate and reset enrollment status
 */
export async function deleteCertificate(id: number) {
  const cert = await prisma.certificate.findUnique({
    where: { id },
  })

  if (!cert) {
    throw new Error(`Certificate #${id} not found.`)
  }

  // Reset enrollment link
  await prisma.programEnrollment.update({
    where: { id: cert.enrollmentId },
    data: {
      certificateIssued: false,
      certificateId: null,
      certificateIssuedAt: null,
    },
  })

  await prisma.certificate.delete({
    where: { id },
  })

  serverCache.invalidateTags(["certificates", "enrollments", "dashboard"])
  return { success: true, message: `Certificate ${cert.certificateNumber} removed successfully.` }
}

/**
 * Get paginated certificates with filtering and search
 */
export async function getCertificates(rawFilters: CertificateFilterInput) {
  const filters = certificateFilterSchema.parse(rawFilters)

  const page = Math.max(1, filters.page)
  const limit = Math.min(100, Math.max(1, filters.limit))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  // Filter by search (certificateNumber, student name, email, program title)
  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim()
    where.OR = [
      { certificateNumber: { contains: term } },
      { user: { name: { contains: term } } },
      { user: { email: { contains: term } } },
      { program: { title: { contains: term } } },
      { enrollment: { enrollmentNumber: { contains: term } } },
    ]
  }

  // Filter by status
  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status
  }

  // Filter by download permission
  if (filters.isDownloadAllowed === "ALLOWED") {
    where.isDownloadAllowed = true
  } else if (filters.isDownloadAllowed === "LOCKED") {
    where.isDownloadAllowed = false
  }

  // Filter by program
  if (filters.programId) {
    where.programId = filters.programId
  }

  const [items, total] = await Promise.all([
    prisma.certificate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: { studentProfile: true },
        },
        program: true,
        enrollment: true,
        issuedBy: true,
        revokedBy: true,
      },
    }),
    prisma.certificate.count({ where }),
  ])

  return {
    items: items as unknown as CertificateRecordItem[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

/**
 * Get single certificate by ID
 */
export async function getCertificateById(id: number) {
  const cert = await prisma.certificate.findUnique({
    where: { id },
    include: {
      user: {
        include: { studentProfile: true },
      },
      program: true,
      enrollment: true,
      issuedBy: true,
      revokedBy: true,
    },
  })

  if (!cert) {
    throw new Error(`Certificate #${id} not found.`)
  }

  return cert as unknown as CertificateRecordItem
}

/**
 * Get aggregate certificate metrics
 */
export async function getCertificateStats(): Promise<CertificateStatsSummary> {
  const [total, issued, revoked, suspended, downloadAllowed, downloadLocked, aggregates] =
    await Promise.all([
      prisma.certificate.count(),
      prisma.certificate.count({ where: { status: "ISSUED" } }),
      prisma.certificate.count({ where: { status: "REVOKED" } }),
      prisma.certificate.count({ where: { status: "SUSPENDED" } }),
      prisma.certificate.count({ where: { isDownloadAllowed: true } }),
      prisma.certificate.count({ where: { isDownloadAllowed: false } }),
      prisma.certificate.aggregate({
        _sum: {
          downloadCount: true,
        },
      }),
    ])

  return {
    total,
    issued,
    revoked,
    suspended,
    downloadAllowed,
    downloadLocked,
    totalDownloads: aggregates._sum.downloadCount || 0,
  }
}

/**
 * Get all enrollments for certificate issuance (without any restriction/criteria)
 */
export async function getEligibleEnrollments(search?: string) {
  const where: Record<string, unknown> = {}

  if (search && search.trim()) {
    const term = search.trim()
    where.OR = [
      { enrollmentNumber: { contains: term } },
      { user: { name: { contains: term } } },
      { user: { email: { contains: term } } },
      { program: { title: { contains: term } } },
    ]
  }

  const enrollments = await prisma.programEnrollment.findMany({
    where,
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        include: { studentProfile: true },
      },
      program: true,
      certificate: true,
    },
  })

  return enrollments.map((enr) => ({
    id: enr.id,
    enrollmentNumber: enr.enrollmentNumber,
    userId: enr.userId,
    userName: enr.user.name,
    userEmail: enr.user.email,
    userPhone: enr.user.phone,
    college: enr.user.studentProfile?.college || "Not Specified",
    department: enr.user.studentProfile?.department || enr.user.studentProfile?.course || "",
    degree: enr.user.studentProfile?.degreeLevel || "UG",
    programId: enr.programId,
    programTitle: enr.program.title,
    programType: enr.program.type,
    programDuration: enr.program.duration || `${enr.durationMonths || 2} Months`,
    status: enr.status,
    grade: enr.grade,
    progressPercent: enr.progressPercent,
    mentorName: enr.mentorName,
    mentorEmail: enr.mentorEmail,
    startDate: enr.startDate,
    expectedEndDate: enr.expectedEndDate,
    existingCertificateNumber: enr.certificate?.certificateNumber || null,
  }))
}
