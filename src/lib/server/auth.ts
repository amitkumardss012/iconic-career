import { createServerFn } from "@tanstack/react-start"
import { loginSchema, studentRegistrationSchema } from "@/lib/validation/auth"
import { loginUser, registerStudent } from "@/lib/services/auth"

/**
 * Server function for user login authentication
 */
export const loginFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => loginSchema.parse(input))
  .handler(async ({ data }) => {
    return await loginUser(data)
  })

/**
 * Server function for candidate / student public registration
 */
export const registerStudentFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => studentRegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    return await registerStudent(data)
  })

