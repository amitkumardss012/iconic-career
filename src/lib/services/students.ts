import { prisma } from "@/lib/prisma"
import type { Prisma } from "../../../generated/prisma/client"
import { hashPassword } from "@/lib/server/crypto"
import { serverCache } from "@/lib/server/cache"
import type { DocumentType } from "@/lib/types/programs"
import {
  createStudentRecordSchema,
  updateStudentRecordSchema,
  getStudentsListQuerySchema,
  toggleStudentStatusSchema,
  type CreateStudentRecordInput,
  type UpdateStudentRecordInput,
  type GetStudentsListQueryInput,
  type ToggleStudentStatusInput,
} from "@/lib/validation/student"

export interface StudentRecordItem {
  id: number
  userId: number
  name: string
  email: string
  phone: string | null
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null
  parentName: string | null
  parentPhone: string | null
  parentEmail: string | null
  relationship: string | null
  university: string | null
  college: string
  degreeLevel: "UG" | "PG" | "DIPLOMA" | "DOCTORATE" | "OTHER" | null
  department: string | null
  course: string
  subject: string | null
  session: string | null
  registrationNumber: string | null
  consentLetter: DocumentType | string | null
  status: "ACTIVE" | "INACTIVE" | "COMPLETED" | "SUSPENDED"
  isActive: boolean
  city: string | null
  state: string | null
  emergencyContact: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface StudentStatsSummary {
  total: number
  active: number
  inactive: number
  completed: number
  suspended: number
}

export interface PaginatedStudentsResult {
  success: boolean
  data: StudentRecordItem[]
  stats: StudentStatsSummary
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
 * Helper to map Prisma user + studentProfile record into a clean student item
 */
function mapToStudentItem(profile: any): StudentRecordItem {
  return {
    id: profile.id,
    userId: profile.userId,
    name: profile.user?.name || "",
    email: profile.user?.email || "",
    phone: profile.user?.phone || null,
    gender: profile.gender || null,
    parentName: profile.parentName || null,
    parentPhone: profile.parentPhone || null,
    parentEmail: profile.parentEmail || null,
    relationship: profile.relationship || null,
    university: profile.university || null,
    college: profile.college,
    degreeLevel: profile.degreeLevel || "UG",
    department: profile.department || null,
    course: profile.course,
    subject: profile.subject || null,
    session: profile.session || null,
    registrationNumber: profile.registrationNumber || null,
    consentLetter: profile.consentLetter || null,
    status: profile.status,
    isActive: profile.isActive,
    city: profile.city,
    state: profile.state,
    emergencyContact: profile.emergencyContact,
    notes: profile.notes,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  }
}

/**
 * Create a new Student record (User + StudentProfile)
 */
export async function createStudent(rawInput: CreateStudentRecordInput): Promise<{ success: boolean; data: StudentRecordItem }> {
  const input = createStudentRecordSchema.parse(rawInput)

  // 1. Verify email uniqueness
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  })
  if (existingEmail) {
    throw new Error(`A user with email "${input.email}" already exists.`)
  }

  // 2. Verify phone uniqueness
  const existingPhone = await prisma.user.findUnique({
    where: { phone: input.phone },
    select: { id: true },
  })
  if (existingPhone) {
    throw new Error(`A user with phone number "${input.phone}" already exists.`)
  }

  // 3. Password handling
  const rawPassword = input.password && input.password.trim() !== "" ? input.password : "Student@12345"
  const hashedPassword = hashPassword(rawPassword)

  // 4. Transactional creation of User and StudentProfile
  const newProfile = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        password: hashedPassword,
        role: "STUDENT",
      },
    })

    return await tx.studentProfile.create({
      data: {
        userId: user.id,
        gender: input.gender || null,
        parentName: input.parentName || null,
        parentPhone: input.parentPhone || null,
        parentEmail: input.parentEmail || null,
        relationship: input.relationship || null,
        university: input.university || null,
        college: input.college,
        degreeLevel: input.degreeLevel || "UG",
        department: input.department || null,
        course: input.course,
        subject: input.subject || null,
        session: input.session || null,
        registrationNumber: input.registrationNumber || null,
        consentLetter: input.consentLetter ? (input.consentLetter as any) : null,
        status: input.status || "ACTIVE",
        isActive: input.status !== "INACTIVE",
        city: input.city || null,
        state: input.state || null,
        emergencyContact: input.emergencyContact || null,
        notes: input.notes || null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
      },
    })
  })

  // 5. Invalidate caches
  serverCache.invalidateTags(["students", "users"])

  return {
    success: true,
    data: mapToStudentItem(newProfile),
  }
}

/**
 * Update an existing Student record
 */
export async function updateStudent(rawInput: UpdateStudentRecordInput): Promise<{ success: boolean; data: StudentRecordItem }> {
  const input = updateStudentRecordSchema.parse(rawInput)

  // 1. Verify profile exists
  const existingProfile = await prisma.studentProfile.findUnique({
    where: { id: input.id },
    include: { user: true },
  })

  if (!existingProfile) {
    throw new Error(`Student record with ID ${input.id} was not found.`)
  }

  // 2. Check email uniqueness if modified
  if (input.email && input.email !== existingProfile.user.email) {
    const emailConflict = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    })
    if (emailConflict && emailConflict.id !== existingProfile.userId) {
      throw new Error(`Email "${input.email}" is already in use by another account.`)
    }
  }

  // 3. Check phone uniqueness if modified
  if (input.phone && input.phone !== existingProfile.user.phone) {
    const phoneConflict = await prisma.user.findUnique({
      where: { phone: input.phone },
      select: { id: true },
    })
    if (phoneConflict && phoneConflict.id !== existingProfile.userId) {
      throw new Error(`Phone number "${input.phone}" is already in use by another account.`)
    }
  }

  // 4. Update via transaction
  const updatedProfile = await prisma.$transaction(async (tx) => {
    // Update user fields
    const userUpdate: Prisma.UserUpdateInput = {}
    if (input.name !== undefined) userUpdate.name = input.name
    if (input.email !== undefined) userUpdate.email = input.email
    if (input.phone !== undefined) userUpdate.phone = input.phone
    if (input.password && input.password.trim() !== "") {
      userUpdate.password = hashPassword(input.password)
    }

    if (Object.keys(userUpdate).length > 0) {
      await tx.user.update({
        where: { id: existingProfile.userId },
        data: userUpdate,
      })
    }

    // Update profile fields
    const profileUpdate: Prisma.StudentProfileUpdateInput = {}
    if (input.gender !== undefined) profileUpdate.gender = input.gender || null
    if (input.parentName !== undefined) profileUpdate.parentName = input.parentName || null
    if (input.parentPhone !== undefined) profileUpdate.parentPhone = input.parentPhone || null
    if (input.parentEmail !== undefined) profileUpdate.parentEmail = input.parentEmail || null
    if (input.relationship !== undefined) profileUpdate.relationship = input.relationship || null
    if (input.university !== undefined) profileUpdate.university = input.university || null
    if (input.college !== undefined) profileUpdate.college = input.college
    if (input.degreeLevel !== undefined) profileUpdate.degreeLevel = input.degreeLevel || "UG"
    if (input.department !== undefined) profileUpdate.department = input.department || null
    if (input.course !== undefined) profileUpdate.course = input.course
    if (input.subject !== undefined) profileUpdate.subject = input.subject || null
    if (input.session !== undefined) profileUpdate.session = input.session || null
    if (input.registrationNumber !== undefined) profileUpdate.registrationNumber = input.registrationNumber || null
    if (input.consentLetter !== undefined) profileUpdate.consentLetter = input.consentLetter ? (input.consentLetter as any) : null
    if (input.status !== undefined) {
      profileUpdate.status = input.status
      profileUpdate.isActive = input.status === "ACTIVE"
    }
    if (input.isActive !== undefined) {
      profileUpdate.isActive = input.isActive
      if (!input.isActive) profileUpdate.status = "INACTIVE"
      else if (existingProfile.status === "INACTIVE") profileUpdate.status = "ACTIVE"
    }
    if (input.city !== undefined) profileUpdate.city = input.city || null
    if (input.state !== undefined) profileUpdate.state = input.state || null
    if (input.emergencyContact !== undefined) profileUpdate.emergencyContact = input.emergencyContact || null
    if (input.notes !== undefined) profileUpdate.notes = input.notes || null

    return await tx.studentProfile.update({
      where: { id: input.id },
      data: profileUpdate,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
      },
    })
  })

  // 5. Invalidate caches
  serverCache.invalidateTags(["students", `student:${input.id}`, "users"])

  return {
    success: true,
    data: mapToStudentItem(updatedProfile),
  }
}

/**
 * Fetch paginated student records with search and instant stats
 */
export async function getStudents(rawQuery?: Partial<GetStudentsListQueryInput>): Promise<PaginatedStudentsResult> {
  const query = getStudentsListQuerySchema.parse(rawQuery || {})
  const { page, limit, search, status, college, department, sortBy, sortOrder } = query

  const cacheKey = `students:p=${page}:l=${limit}:s=${search || ""}:st=${status}:c=${college || ""}:d=${department || ""}:sb=${sortBy}:so=${sortOrder}`

  return await serverCache.getOrSet(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit
      const take = limit

      // Construct dynamic Prisma where clause
      const where: Prisma.StudentProfileWhereInput = {}

      if (status && status !== "ALL") {
        where.status = status
      }

      if (college && college.trim() !== "") {
        where.college = { contains: college.trim(), mode: "insensitive" }
      }

      if (department && department.trim() !== "") {
        where.department = { contains: department.trim(), mode: "insensitive" }
      }

      if (search && search.trim() !== "") {
        const term = search.trim()
        where.OR = [
          { user: { name: { contains: term, mode: "insensitive" } } },
          { user: { email: { contains: term, mode: "insensitive" } } },
          { user: { phone: { contains: term, mode: "insensitive" } } },
          { college: { contains: term, mode: "insensitive" } },
          { course: { contains: term, mode: "insensitive" } },
          { university: { contains: term, mode: "insensitive" } },
          { department: { contains: term, mode: "insensitive" } },
          { subject: { contains: term, mode: "insensitive" } },
          { registrationNumber: { contains: term, mode: "insensitive" } },
          { parentName: { contains: term, mode: "insensitive" } },
          { parentPhone: { contains: term, mode: "insensitive" } },
          { city: { contains: term, mode: "insensitive" } },
        ]
      }

      // Determine orderBy mapping
      let orderBy: Prisma.StudentProfileOrderByWithRelationInput = { createdAt: sortOrder }
      if (sortBy === "name") {
        orderBy = { user: { name: sortOrder } }
      } else if (sortBy === "college") {
        orderBy = { college: sortOrder }
      } else if (sortBy === "status") {
        orderBy = { status: sortOrder }
      }

      // Execute data query, count, and overall stats in parallel
      const [profiles, total, totalCount, activeCount, inactiveCount, completedCount, suspendedCount] =
        await prisma.$transaction([
          prisma.studentProfile.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
              user: {
                select: { id: true, name: true, email: true, phone: true, role: true },
              },
            },
          }),
          prisma.studentProfile.count({ where }),
          prisma.studentProfile.count(),
          prisma.studentProfile.count({ where: { status: "ACTIVE" } }),
          prisma.studentProfile.count({ where: { status: "INACTIVE" } }),
          prisma.studentProfile.count({ where: { status: "COMPLETED" } }),
          prisma.studentProfile.count({ where: { status: "SUSPENDED" } }),
        ])

      const totalPages = Math.ceil(total / limit) || 1

      return {
        success: true,
        data: profiles.map(mapToStudentItem),
        stats: {
          total: totalCount,
          active: activeCount,
          inactive: inactiveCount,
          completed: completedCount,
          suspended: suspendedCount,
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
    { ttlSeconds: 30, tags: ["students"] }
  )
}

/**
 * Fetch a single student record by ID
 */
export async function getStudentById(id: number): Promise<StudentRecordItem | null> {
  const cacheKey = `student:${id}`

  return await serverCache.getOrSet(
    cacheKey,
    async () => {
      const profile = await prisma.studentProfile.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, role: true },
          },
        },
      })

      return profile ? mapToStudentItem(profile) : null
    },
    { ttlSeconds: 60, tags: ["students", `student:${id}`] }
  )
}

/**
 * Toggle student active/inactive status
 */
export async function toggleStudentStatus(rawInput: ToggleStudentStatusInput): Promise<{ success: boolean; data: StudentRecordItem }> {
  const input = toggleStudentStatusSchema.parse(rawInput)

  const updated = await prisma.studentProfile.update({
    where: { id: input.studentId },
    data: {
      isActive: input.isActive,
      status: input.status || (input.isActive ? "ACTIVE" : "INACTIVE"),
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, role: true },
      },
    },
  })

  serverCache.invalidateTags(["students", `student:${input.studentId}`])

  return {
    success: true,
    data: mapToStudentItem(updated),
  }
}

/**
 * Delete a student record and associated user
 */
export async function deleteStudent(studentId: number): Promise<{ success: boolean; message: string }> {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { userId: true },
  })

  if (!profile) {
    throw new Error(`Student record #${studentId} not found.`)
  }

  // Deleting the user will cascade delete the studentProfile
  await prisma.user.delete({
    where: { id: profile.userId },
  })

  serverCache.invalidateTags(["students", "users"])

  return {
    success: true,
    message: "Student record deleted successfully.",
  }
}
