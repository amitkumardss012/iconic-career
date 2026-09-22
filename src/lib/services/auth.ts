import { prisma, Prisma } from "@/lib/prisma"
import { verifyPassword, hashPassword, signJwtToken } from "@/lib/server/crypto"
import { serverCache } from "@/lib/server/cache"
import {
  loginSchema,
  studentRegistrationSchema,
  type LoginInput,
  type StudentRegistrationInput,
} from "@/lib/validation/auth"
import { selectUserSafe, type UserSafe } from "@/lib/services/user"

export interface AuthSuccessResult {
  success: true
  token: string
  user: UserSafe
  role: "ADMIN" | "STUDENT"
  message: string
}

/**
 * Authenticate a user by email or mobile phone against the database
 */
export async function loginUser(rawInput: LoginInput): Promise<AuthSuccessResult> {
  const input = loginSchema.parse(rawInput)
  const identifier = input.identifier.trim().toLowerCase()

  // 1. Look up user by email OR phone number
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: identifier, mode: "insensitive" } },
        { phone: { equals: identifier } },
      ],
    },
  })

  if (!user) {
    throw new Error("No account found matching this email or mobile number.")
  }

  // 2. Validate password
  const isPasswordValid = verifyPassword(input.password, user.password)
  if (!isPasswordValid) {
    throw new Error("Incorrect password. Please try again.")
  }

  // 3. Generate official signed JSON Web Token
  const token = signJwtToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  // 4. Return sanitized user, token and role
  const safeUser: UserSafe = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }

  return {
    success: true,
    token,
    user: safeUser,
    role: user.role,
    message: `Welcome back, ${user.name}!`,
  }
}

/**
 * Register a new student user and linked academic profile
 */
export async function registerStudent(rawInput: StudentRegistrationInput): Promise<AuthSuccessResult> {
  const input = studentRegistrationSchema.parse(rawInput)

  // 1. Check for email collision
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  })

  if (existingEmail) {
    throw new Error(`An account with email "${input.email}" is already registered. Please log in or use another email.`)
  }

  // 2. Check for phone collision
  const existingPhone = await prisma.user.findUnique({
    where: { phone: input.phone },
    select: { id: true },
  })

  if (existingPhone) {
    throw new Error(`An account with phone number "${input.phone}" is already registered.`)
  }

  // 3. Securely hash password
  const hashedPassword = hashPassword(input.password)

  // 4. Atomically create User and StudentProfile
  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        password: hashedPassword,
        role: "STUDENT",
      },
    })

    await tx.studentProfile.create({
      data: {
        userId: user.id,
        gender: input.gender || null,
        parentName: input.parentName?.trim() || null,
        parentPhone: input.parentPhone?.trim() || null,
        parentEmail: input.parentEmail?.trim() || null,
        relationship: input.relationship?.trim() || null,
        emergencyContact: input.emergencyContact?.trim() || null,
        city: input.city?.trim() || null,
        state: input.state?.trim() || null,

        university: input.university?.trim() || null,
        college: input.college.trim(),
        degreeLevel: input.degreeLevel || "UG",
        department: input.department?.trim() || null,
        course: input.course.trim(),
        subject: input.subject?.trim() || null,
        session: input.session?.trim() || null,
        registrationNumber: input.registrationNumber?.trim() || null,

        consentLetter: input.consentLetter
          ? (input.consentLetter as Prisma.InputJsonValue)
          : Prisma.JsonNull,

        status: "ACTIVE",
        isActive: true,
      },
    })

    return user
  })

  // 5. Invalidate server cache tags
  serverCache.invalidateTags(["students", "users"])

  // 6. Generate official signed JSON Web Token
  const token = signJwtToken({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  })

  const safeUser: UserSafe = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  }

  return {
    success: true,
    token,
    user: safeUser,
    role: "STUDENT",
    message: `Congratulations ${safeUser.name}! Your student registration is complete.`,
  }
}


