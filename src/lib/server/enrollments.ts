import { createServerFn } from "@tanstack/react-start"
import {
  createEnrollmentSchema,
  extendInternshipSchema,
  updateEnrollmentSchema,
  enrollmentFilterSchema,
} from "@/lib/validation/enrollment"
import {
  createEnrollment,
  extendInternshipPeriod,
  updateEnrollment,
  getEnrollments,
  getEnrollmentById,
  deleteEnrollment,
  getEnrollmentStats,
} from "@/lib/services/enrollments"
import { z } from "zod"

/**
 * Server function to get aggregated enrollment metrics
 */
export const getEnrollmentStatsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return await getEnrollmentStats()
  })

/**
 * Server function to fetch paginated enrollments
 */
export const getEnrollmentsFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => enrollmentFilterSchema.parse(input || {}))
  .handler(async ({ data }) => {
    return await getEnrollments(data)
  })

/**
 * Server function to get single enrollment by ID
 */
export const getEnrollmentByIdFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ id: z.number().int().positive() }).parse(input))
  .handler(async ({ data }) => {
    return await getEnrollmentById(data.id)
  })

/**
 * Server function for creating a program/internship enrollment
 */
export const createEnrollmentFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createEnrollmentSchema.parse(input))
  .handler(async ({ data }) => {
    return await createEnrollment(data)
  })

/**
 * Server function to extend an internship period
 */
export const extendInternshipFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => extendInternshipSchema.parse(input))
  .handler(async ({ data }) => {
    return await extendInternshipPeriod(data)
  })

/**
 * Server function to update an enrollment
 */
export const updateEnrollmentFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        id: z.number().int().positive(),
        data: updateEnrollmentSchema,
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    return await updateEnrollment(data.id, data.data)
  })

/**
 * Server function to delete an enrollment
 */
export const deleteEnrollmentFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.number().int().positive() }).parse(input))
  .handler(async ({ data }) => {
    return await deleteEnrollment(data.id)
  })
