import { createServerFn } from "@tanstack/react-start"
import {
  createStudentRecordSchema,
  updateStudentRecordSchema,
  getStudentsListQuerySchema,
  toggleStudentStatusSchema,
  getStudentByIdSchema,
} from "@/lib/validation/student"
import {
  createStudent,
  updateStudent,
  getStudents,
  getStudentById,
  toggleStudentStatus,
  deleteStudent,
} from "@/lib/services/students"

/**
 * Server function to list students with search, filters, and pagination
 */
export const getStudentsListFn = createServerFn({ method: "GET" })
  .validator((query: unknown) => getStudentsListQuerySchema.parse(query || {}))
  .handler(async ({ data }) => {
    return await getStudents(data)
  })

/**
 * Server function to fetch a single student detail
 */
export const getStudentDetailFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => getStudentByIdSchema.parse(input))
  .handler(async ({ data }) => {
    return await getStudentById(data.id)
  })

/**
 * Server function to create a new student record
 */
export const createStudentFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createStudentRecordSchema.parse(input))
  .handler(async ({ data }) => {
    return await createStudent(data)
  })

/**
 * Server function to update a student record
 */
export const updateStudentFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => updateStudentRecordSchema.parse(input))
  .handler(async ({ data }) => {
    return await updateStudent(data)
  })

/**
 * Server function to toggle student active/inactive status
 */
export const toggleStudentStatusFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => toggleStudentStatusSchema.parse(input))
  .handler(async ({ data }) => {
    return await toggleStudentStatus(data)
  })

/**
 * Server function to delete a student record
 */
export const deleteStudentFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => getStudentByIdSchema.parse(input))
  .handler(async ({ data }) => {
    return await deleteStudent(data.id)
  })
