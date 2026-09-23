import { prisma } from "@/lib/prisma"
import type { Prisma } from "../../../generated/prisma/client"
import { hashPassword } from "@/lib/server/crypto"
import { serverCache } from "@/lib/server/cache"
import {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  updateUserPasswordSchema,
  type CreateUserInput,
  type UpdateUserInput,
  type GetUsersQueryInput,
  type UpdateUserPasswordInput,
} from "@/lib/validation/user"

/**
 * Standard sanitized user fields to exclude sensitive passwords from responses
 */
export const selectUserSafe = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export type UserSafe = {
  id: number
  name: string
  email: string
  phone: string | null
  role: "ADMIN" | "STUDENT"
  createdAt: Date
  updatedAt: Date
}

export interface PaginatedUsersResult {
  success: boolean
  data: UserSafe[]
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
 * Create a new user record in PostgreSQL with hashed password
 */
export async function createUser(rawInput: CreateUserInput): Promise<{ success: boolean; data: UserSafe }> {
  const input = createUserSchema.parse(rawInput)

  // 1. Check for email conflict
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  })

  if (existingEmail) {
    throw new Error(`A user with email "${input.email}" already exists.`)
  }

  // 2. Check for phone conflict if provided
  if (input.phone && input.phone.trim() !== "") {
    const existingPhone = await prisma.user.findUnique({
      where: { phone: input.phone },
      select: { id: true },
    })

    if (existingPhone) {
      throw new Error(`A user with phone number "${input.phone}" already exists.`)
    }
  }

  // 3. Hash password securely
  const hashedPassword = hashPassword(input.password)

  // 4. Create user in database
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone && input.phone.trim() !== "" ? input.phone : null,
      role: input.role,
    },
    select: selectUserSafe,
  })

  // 5. Invalidate user caches
  serverCache.invalidateTags(["users"])

  return {
    success: true,
    data: user as UserSafe,
  }
}

/**
 * Update an existing user record with optional password hashing
 */
export async function updateUser(rawInput: UpdateUserInput): Promise<{ success: boolean; data: UserSafe }> {
  const input = updateUserSchema.parse(rawInput)

  // 1. Verify user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: input.id },
    select: { id: true, email: true, phone: true },
  })

  if (!targetUser) {
    throw new Error(`User with ID ${input.id} was not found.`)
  }

  // 2. Verify email uniqueness if email is changed
  if (input.email && input.email !== targetUser.email) {
    const conflictEmail = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    })
    if (conflictEmail && conflictEmail.id !== input.id) {
      throw new Error(`Email "${input.email}" is already taken by another account.`)
    }
  }

  // 3. Verify phone uniqueness if phone is changed
  if (input.phone && input.phone !== targetUser.phone) {
    const conflictPhone = await prisma.user.findUnique({
      where: { phone: input.phone },
      select: { id: true },
    })
    if (conflictPhone && conflictPhone.id !== input.id) {
      throw new Error(`Phone number "${input.phone}" is already registered.`)
    }
  }

  // 4. Construct data payload
  const dataToUpdate: Prisma.UserUpdateInput = {}
  if (input.name !== undefined) dataToUpdate.name = input.name
  if (input.email !== undefined) dataToUpdate.email = input.email
  if (input.password !== undefined && input.password.trim() !== "") {
    dataToUpdate.password = hashPassword(input.password)
  }
  if (input.phone !== undefined) {
    dataToUpdate.phone = input.phone && input.phone.trim() !== "" ? input.phone : null
  }
  if (input.role !== undefined) dataToUpdate.role = input.role

  const updatedUser = await prisma.user.update({
    where: { id: input.id },
    data: dataToUpdate,
    select: selectUserSafe,
  })

  // 5. Invalidate specific and list caches
  serverCache.invalidateKey(`user:${input.id}`)
  serverCache.invalidateTags(["users"])

  return {
    success: true,
    data: updatedUser as UserSafe,
  }
}

/**
 * Fetch paginated users with role filtering (ADMIN / STUDENT), search, and server-side caching
 */
export async function getUsers(rawQuery?: Partial<GetUsersQueryInput>): Promise<PaginatedUsersResult> {
  const query = getUsersQuerySchema.parse(rawQuery || {})

  const { page, limit, role, search, sortBy, sortOrder } = query
  const cacheKey = `users:p=${page}:l=${limit}:r=${role}:s=${search || ""}:sb=${sortBy}:so=${sortOrder}`

  return await serverCache.getOrSet(
    cacheKey,
    async () => {
      const skip = (page - 1) * limit
      const take = limit

      // Construct dynamic Prisma where filter
      const where: Prisma.UserWhereInput = {}

      if (role && role !== "ALL") {
        where.role = role
      }

      if (search && search.trim() !== "") {
        const term = search.trim()
        where.OR = [
          { name: { contains: term } },
          { email: { contains: term } },
          { phone: { contains: term } },
        ]
      }

      // Run data fetch and total count query in a parallel transaction
      const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
          where,
          skip,
          take,
          orderBy: { [sortBy]: sortOrder },
          select: selectUserSafe,
        }),
        prisma.user.count({ where }),
      ])

      const totalPages = Math.ceil(total / limit) || 1

      return {
        success: true,
        data: users as UserSafe[],
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
    { ttlSeconds: 60, tags: ["users"] }
  )
}

/**
 * Fetch a single user by ID with server-side caching
 */
export async function getUserById(id: number): Promise<UserSafe | null> {
  const cacheKey = `user:${id}`

  return await serverCache.getOrSet(
    cacheKey,
    async () => {
      const user = await prisma.user.findUnique({
        where: { id },
        select: selectUserSafe,
      })

      return (user as UserSafe) || null
    },
    { ttlSeconds: 300, tags: ["users", `user:${id}`] }
  )
}

/**
 * Direct user password update/reset by admin or authorized operations
 * Directly sets the new hashed password without requiring the old/current password.
 */
export async function updateUserPassword(rawInput: UpdateUserPasswordInput): Promise<{ success: boolean; data: UserSafe }> {
  const input = updateUserPasswordSchema.parse(rawInput)

  const existing = await prisma.user.findUnique({
    where: { id: input.id },
    select: { id: true, email: true },
  })

  if (!existing) {
    throw new Error(`User with ID ${input.id} was not found.`)
  }

  const hashedPassword = hashPassword(input.newPassword)

  const updatedUser = await prisma.user.update({
    where: { id: input.id },
    data: {
      password: hashedPassword,
    },
    select: selectUserSafe,
  })

  serverCache.invalidateKey(`user:${input.id}`)
  serverCache.invalidateTags(["users"])

  return {
    success: true,
    data: updatedUser as UserSafe,
  }
}

