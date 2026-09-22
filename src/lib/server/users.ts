import { createServerFn } from "@tanstack/react-start"
import {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
  getUserByIdSchema,
  updateUserPasswordSchema,
} from "@/lib/validation/user"
import {
  createUser,
  updateUser,
  getUsers,
  getUserById,
  updateUserPassword,
} from "@/lib/services/user"

/**
 * Server function to query users with pagination, role filtering, and search
 */
export const getUsersFn = createServerFn({ method: "GET" })
  .validator((query: unknown) => getUsersQuerySchema.parse(query || {}))
  .handler(async ({ data }) => {
    return await getUsers(data)
  })

/**
 * Server function to fetch a single user by ID
 */
export const getUserByIdFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => getUserByIdSchema.parse(input))
  .handler(async ({ data }) => {
    return await getUserById(data.id)
  })

/**
 * Server function to create a new user (Student or Admin)
 */
export const createUserFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createUserSchema.parse(input))
  .handler(async ({ data }) => {
    return await createUser(data)
  })

/**
 * Server function to update an existing user
 */
export const updateUserFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => updateUserSchema.parse(input))
  .handler(async ({ data }) => {
    return await updateUser(data)
  })

/**
 * Server function to update/reset a user's password directly (Admin operation)
 */
export const updateUserPasswordFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => updateUserPasswordSchema.parse(input))
  .handler(async ({ data }) => {
    return await updateUserPassword(data)
  })

