import { prisma } from "@/lib/prisma"
import { serverCache } from "@/lib/server/cache"
import {
  createPaymentTransactionSchema,
  updatePaymentTransactionSchema,
  refundPaymentTransactionSchema,
  paymentFilterSchema,
  type CreatePaymentTransactionInput,
  type UpdatePaymentTransactionInput,
  type RefundPaymentTransactionInput,
  type PaymentFilterInput,
} from "@/lib/validation/payment"

/**
 * Generate a unique receipt serial number (e.g. RCP-2026-00124)
 */
export async function generateReceiptNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const count = prisma.paymentTransaction ? await prisma.paymentTransaction.count() : 0
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  return `RCP-${currentYear}-${String(count + 1).padStart(4, "0")}${randomSuffix}`
}

/**
 * Reconcile financial figures on the parent ProgramEnrollment record
 */
async function reconcileEnrollmentFinancials(tx: any, enrollmentId: number) {
  const enrollment = await tx.programEnrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      program: { select: { price: true } },
      transactions: {
        where: {
          status: { in: ["SUCCESS", "PARTIALLY_REFUNDED", "REFUNDED"] },
        },
      },
    },
  })

  if (!enrollment) return

  // Calculate sum of successful payments minus refunds
  let totalPaid = 0
  let latestRef: string | null = null

  for (const t of enrollment.transactions) {
    if (t.status === "SUCCESS") {
      totalPaid += t.amount
      if (t.transactionReference) latestRef = t.transactionReference
    } else if (t.status === "PARTIALLY_REFUNDED") {
      totalPaid += t.amount - (t.refundAmount || 0)
    }
  }

  const programPrice = enrollment.program?.price || 0
  let newPaymentStatus = enrollment.paymentStatus

  if (enrollment.paymentStatus !== "WAIVED" && enrollment.paymentStatus !== "FREE") {
    if (totalPaid >= programPrice && programPrice > 0) {
      newPaymentStatus = "PAID"
    } else if (totalPaid > 0) {
      newPaymentStatus = "PARTIALLY_PAID"
    } else {
      newPaymentStatus = "PENDING"
    }
  }

  await tx.programEnrollment.update({
    where: { id: enrollmentId },
    data: {
      amountPaid: totalPaid,
      paymentStatus: newPaymentStatus,
      paymentReference: latestRef || enrollment.paymentReference,
    },
  })
}

/**
 * Create a new payment transaction (manual admin or online gateway)
 */
export async function createPaymentTransaction(rawInput: CreatePaymentTransactionInput) {
  const input = createPaymentTransactionSchema.parse(rawInput)

  // 1. Verify parent enrollment
  const enrollment = await prisma.programEnrollment.findUnique({
    where: { id: input.enrollmentId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      program: { select: { id: true, title: true, price: true } },
    },
  })

  if (!enrollment) {
    throw new Error(`Enrollment with ID ${input.enrollmentId} does not exist.`)
  }

  // 2. Determine receipt number
  let receiptNumber = input.receiptNumber?.trim()
  if (receiptNumber) {
    const existing = await prisma.paymentTransaction.findUnique({
      where: { receiptNumber },
    })
    if (existing) {
      throw new Error(`Receipt number "${receiptNumber}" is already in use.`)
    }
  } else {
    receiptNumber = await generateReceiptNumber()
  }

  const paidDate = input.paidAt ? new Date(input.paidAt) : new Date()

  // 3. Create transaction and reconcile parent enrollment
  const transaction = await prisma.$transaction(async (tx) => {
    const created = await tx.paymentTransaction.create({
      data: {
        receiptNumber,
        enrollmentId: input.enrollmentId,
        userId: enrollment.userId,
        amount: input.amount,
        currency: input.currency,
        type: input.type,
        status: input.status,
        gateway: input.gateway,
        method: input.method,
        transactionReference: input.transactionReference?.trim() || null,
        gatewayOrderId: input.gatewayOrderId?.trim() || null,
        gatewayPaymentId: input.gatewayPaymentId?.trim() || null,
        gatewaySignature: input.gatewaySignature?.trim() || null,
        gatewayResponse: (input.gatewayResponse as any) || undefined,
        recordedById: input.recordedById || null,
        notes: input.notes?.trim() || null,
        paidAt: paidDate,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        enrollment: {
          include: {
            program: true,
          },
        },
        recordedBy: { select: { id: true, name: true, email: true } },
      },
    })

    // Reconcile enrollment total amount and status if successful
    if (input.status === "SUCCESS") {
      await reconcileEnrollmentFinancials(tx, input.enrollmentId)
    }

    return created
  })

  serverCache.invalidateTags(["payments", "enrollments"])

  return transaction
}

/**
 * Get paginated list of payment transactions with rich filtering
 */
export async function getPaymentTransactions(rawFilter?: Partial<PaymentFilterInput>) {
  const filter = paymentFilterSchema.parse(rawFilter || {})
  const { page, limit, enrollmentId, userId, gateway, method, status, search } = filter
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (enrollmentId) where.enrollmentId = enrollmentId
  if (userId) where.userId = userId
  if (gateway) where.gateway = gateway
  if (method) where.method = method
  if (status) where.status = status

  if (search && search.trim()) {
    const q = search.trim()
    where.OR = [
      { receiptNumber: { contains: q, mode: "insensitive" } },
      { transactionReference: { contains: q, mode: "insensitive" } },
      { gatewayOrderId: { contains: q, mode: "insensitive" } },
      { gatewayPaymentId: { contains: q, mode: "insensitive" } },
      { user: { name: { contains: q, mode: "insensitive" } } },
      { user: { email: { contains: q, mode: "insensitive" } } },
      { enrollment: { enrollmentNumber: { contains: q, mode: "insensitive" } } },
      { enrollment: { program: { title: { contains: q, mode: "insensitive" } } } },
    ]
  }

  if (!prisma.paymentTransaction) {
    return {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 1,
    }
  }

  const [total, items] = await Promise.all([
    prisma.paymentTransaction.count({ where }),
    prisma.paymentTransaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { paidAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        enrollment: {
          include: {
            program: { select: { id: true, title: true, type: true, price: true } },
          },
        },
        recordedBy: { select: { id: true, name: true, email: true } },
      },
    }),
  ])

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

/**
 * Refund a payment transaction
 */
export async function refundPaymentTransaction(rawInput: RefundPaymentTransactionInput) {
  const input = refundPaymentTransactionSchema.parse(rawInput)

  if (!prisma.paymentTransaction) {
    throw new Error("Database schema delegate is initializing. Please refresh.")
  }

  const transaction = await prisma.paymentTransaction.findUnique({
    where: { id: input.transactionId },
  })

  if (!transaction) {
    throw new Error(`Transaction with ID ${input.transactionId} not found.`)
  }

  if (transaction.status !== "SUCCESS" && transaction.status !== "PARTIALLY_REFUNDED") {
    throw new Error(`Cannot refund transaction with status ${transaction.status}.`)
  }

  const currentRefund = transaction.refundAmount || 0
  const newRefund = currentRefund + input.refundAmount

  if (newRefund > transaction.amount) {
    throw new Error(`Total refund (₹${newRefund}) cannot exceed original payment amount (₹${transaction.amount}).`)
  }

  const isFullRefund = newRefund === transaction.amount
  const newStatus = isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED"

  const updated = await prisma.$transaction(async (tx) => {
    const res = await tx.paymentTransaction.update({
      where: { id: input.transactionId },
      data: {
        refundAmount: newRefund,
        refundReason: input.refundReason.trim(),
        refundedAt: new Date(),
        status: newStatus,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        enrollment: { include: { program: true } },
      },
    })

    await reconcileEnrollmentFinancials(tx, transaction.enrollmentId)
    return res
  })

  serverCache.invalidateTags(["payments", "enrollments"])
  return updated
}

export interface PaymentStatsSummary {
  totalRevenue: number
  totalTransactions: number
  successfulTransactions: number
  totalRefunded: number
  netRevenue: number
}

/**
 * Aggregate summary metrics for the financial console
 */
export async function getPaymentStats(): Promise<PaymentStatsSummary> {
  if (!prisma.paymentTransaction) {
    return {
      totalRevenue: 0,
      totalTransactions: 0,
      successfulTransactions: 0,
      totalRefunded: 0,
      netRevenue: 0,
    }
  }

  const [totalCount, successCount, successTransactions] = await Promise.all([
    prisma.paymentTransaction.count(),
    prisma.paymentTransaction.count({ where: { status: "SUCCESS" } }),
    prisma.paymentTransaction.findMany({
      where: { status: { in: ["SUCCESS", "PARTIALLY_REFUNDED", "REFUNDED"] } },
      select: { amount: true, refundAmount: true },
    }),
  ])

  let totalRevenue = 0
  let totalRefunded = 0

  for (const t of successTransactions) {
    totalRevenue += t.amount
    totalRefunded += t.refundAmount || 0
  }

  return {
    totalRevenue,
    totalTransactions: totalCount,
    successfulTransactions: successCount,
    totalRefunded,
    netRevenue: totalRevenue - totalRefunded,
  }
}

export type PaymentTransactionRecordItem = Awaited<ReturnType<typeof getPaymentTransactions>>["items"][number]
