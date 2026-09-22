import { createServerFn } from "@tanstack/react-start"
import {
  createPaymentTransactionSchema,
  updatePaymentTransactionSchema,
  refundPaymentTransactionSchema,
  paymentFilterSchema,
} from "@/lib/validation/payment"
import {
  createPaymentTransaction,
  getPaymentTransactions,
  getPaymentStats,
  refundPaymentTransaction,
} from "@/lib/services/payments"
import { z } from "zod"

/**
 * Server function to fetch payment statistics
 */
export const getPaymentStatsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return await getPaymentStats()
  })

/**
 * Server function to get paginated payment transactions
 */
export const getPaymentsFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => paymentFilterSchema.parse(input || {}))
  .handler(async ({ data }) => {
    return await getPaymentTransactions(data)
  })

/**
 * Server function to record a payment transaction
 */
export const createPaymentTransactionFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => createPaymentTransactionSchema.parse(input))
  .handler(async ({ data }) => {
    return await createPaymentTransaction(data)
  })

/**
 * Server function to refund a payment transaction
 */
export const refundPaymentTransactionFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => refundPaymentTransactionSchema.parse(input))
  .handler(async ({ data }) => {
    return await refundPaymentTransaction(data)
  })
