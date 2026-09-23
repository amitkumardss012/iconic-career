import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
  issueCertificateSchema,
  updateCertificateSchema,
  certificateFilterSchema,
  revokeCertificateSchema,
  toggleDownloadSchema,
} from "@/lib/validation/certificate"
import {
  issueCertificate,
  updateCertificate,
  getCertificates,
  getCertificateById,
  getCertificateStats,
  toggleCertificateDownload,
  revokeCertificate,
  deleteCertificate,
  getEligibleEnrollments,
} from "@/lib/services/certificates"

/**
 * Server function to get aggregated certificate statistics
 */
export const getCertificateStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  return await getCertificateStats()
})

/**
 * Server function to fetch paginated certificates list with search & filters
 */
export const getCertificatesFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => certificateFilterSchema.parse(input || {}))
  .handler(async ({ data }) => {
    return await getCertificates(data)
  })

/**
 * Server function to get a single certificate by ID
 */
export const getCertificateByIdFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ id: z.number().int().positive() }).parse(input))
  .handler(async ({ data }) => {
    return await getCertificateById(data.id)
  })

/**
 * Server function to get eligible enrollments for certificate issuance
 */
export const getEligibleEnrollmentsFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ search: z.string().optional() }).parse(input || {}))
  .handler(async ({ data }) => {
    return await getEligibleEnrollments(data.search)
  })

/**
 * Server function for issuing a new certificate
 */
export const issueCertificateFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => issueCertificateSchema.parse(input))
  .handler(async ({ data }) => {
    return await issueCertificate(data)
  })

/**
 * Server function to update ALL fields of an existing certificate
 */
export const updateCertificateFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        id: z.number().int().positive(),
        data: updateCertificateSchema,
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    return await updateCertificate(data.id, data.data)
  })

/**
 * Server function to quickly toggle download permission (Allowed / Locked)
 */
export const toggleCertificateDownloadFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => toggleDownloadSchema.parse(input))
  .handler(async ({ data }) => {
    return await toggleCertificateDownload(data)
  })

/**
 * Server function to revoke a certificate with audit trail
 */
export const revokeCertificateFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => revokeCertificateSchema.parse(input))
  .handler(async ({ data }) => {
    return await revokeCertificate(data)
  })

/**
 * Server function to delete a certificate
 */
export const deleteCertificateFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.number().int().positive() }).parse(input))
  .handler(async ({ data }) => {
    return await deleteCertificate(data.id)
  })

/**
 * Public server function to verify a certificate by unique number
 */
export const verifyCertificatePublicFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ certificateNumber: z.string().trim().min(1, "Certificate number is required") }).parse(input)
  )
  .handler(async ({ data }) => {
    const { verifyCertificatePublic } = await import("@/lib/services/certificates")
    return await verifyCertificatePublic(data.certificateNumber)
  })

/**
 * Public server function to record a download event for telemetry
 */
export const recordCertificateDownloadFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ certificateNumber: z.string().trim().min(1) }).parse(input)
  )
  .handler(async ({ data }) => {
    const { recordCertificateDownload } = await import("@/lib/services/certificates")
    return await recordCertificateDownload(data.certificateNumber)
  })
