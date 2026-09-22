import { z } from "zod"

export const paymentGatewayEnum = z.enum([
  "MANUAL_ADMIN",
  "RAZORPAY",
  "STRIPE",
  "CASHFREE",
  "INSTAMOJO",
])

export const paymentMethodEnum = z.enum([
  "UPI",
  "NET_BANKING",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
  "CASH",
  "CHEQUE",
  "WALLET",
  "SCHOLARSHIP",
  "OTHER",
])

export const transactionStatusEnum = z.enum([
  "PENDING",
  "SUCCESS",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
  "CANCELLED",
])

export const transactionTypeEnum = z.enum([
  "PAYMENT",
  "REFUND",
  "ADJUSTMENT",
])

export const createPaymentTransactionSchema = z.object({
  enrollmentId: z.number().int().positive("Please select an enrollment"),
  amount: z.number().positive("Payment amount must be greater than 0"),
  currency: z.string().default("INR"),
  type: transactionTypeEnum.default("PAYMENT"),
  status: transactionStatusEnum.default("SUCCESS"),
  gateway: paymentGatewayEnum.default("MANUAL_ADMIN"),
  method: paymentMethodEnum.default("UPI"),
  receiptNumber: z.string().trim().min(3, "Receipt number must be at least 3 characters").optional(),
  transactionReference: z.string().trim().optional().nullable(),
  gatewayOrderId: z.string().optional().nullable(),
  gatewayPaymentId: z.string().optional().nullable(),
  gatewaySignature: z.string().optional().nullable(),
  gatewayResponse: z.record(z.string(), z.unknown()).optional().nullable(),
  recordedById: z.number().int().positive().optional(),
  notes: z.string().trim().optional().nullable(),
  paidAt: z.string().optional(),
})

export const updatePaymentTransactionSchema = z.object({
  receiptNumber: z.string().trim().min(3).optional(),
  status: transactionStatusEnum.optional(),
  transactionReference: z.string().trim().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  paidAt: z.string().optional(),
})

export const refundPaymentTransactionSchema = z.object({
  transactionId: z.number().int().positive("Invalid transaction ID"),
  refundAmount: z.number().positive("Refund amount must be greater than 0"),
  refundReason: z.string().trim().min(3, "Please provide a refund reason"),
})

export const paymentFilterSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  enrollmentId: z.number().int().positive().optional(),
  userId: z.number().int().positive().optional(),
  gateway: paymentGatewayEnum.optional(),
  method: paymentMethodEnum.optional(),
  status: transactionStatusEnum.optional(),
  search: z.string().optional(),
})

export type CreatePaymentTransactionInput = z.input<typeof createPaymentTransactionSchema>
export type UpdatePaymentTransactionInput = z.input<typeof updatePaymentTransactionSchema>
export type RefundPaymentTransactionInput = z.input<typeof refundPaymentTransactionSchema>
export type PaymentFilterInput = z.input<typeof paymentFilterSchema>
