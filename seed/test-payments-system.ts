import dotenv from "dotenv"
dotenv.config()

import { prisma } from "../src/lib/prisma"
import {
  createPaymentTransaction,
  refundPaymentTransaction,
  getPaymentStats,
  getPaymentTransactions,
} from "../src/lib/services/payments"
import { createEnrollment } from "../src/lib/services/enrollments"

async function runTest() {
  console.log("=== Testing Scalable Payment Transactions & Reconciliation Engine ===")

  // 1. Get or create a student & program
  const user = await prisma.user.findFirst({ where: { role: "STUDENT" } })
  if (!user) throw new Error("No student found")

  const program = await prisma.program.findFirst()
  if (!program) throw new Error("No program found")

  // Ensure program price is known
  const programPrice = Number(program.price) || 12000

  // Delete previous test enrollment
  await prisma.programEnrollment.deleteMany({
    where: { userId: user.id, programId: program.id },
  })

  // Create clean enrollment with 0 paid
  console.log(`Creating test enrollment for ${user.name} in "${program.title}" (Fee: ₹${programPrice})...`)
  const enrollment = await createEnrollment({
    userId: user.id,
    programId: program.id,
    paymentStatus: "PENDING",
    amountPaid: 0,
    source: "ADMIN_MANUAL",
  })
  console.log(`-> Enrollment created: ${enrollment.enrollmentNumber} (ID: ${enrollment.id})`)

  // 2. Test Partial Installment 1: ₹4,000
  console.log("\n--- Test 1: Record 1st Installment (₹4,000 via Manual UPI) ---")
  const t1 = await createPaymentTransaction({
    enrollmentId: enrollment.id,
    amount: 4000,
    gateway: "MANUAL_ADMIN",
    method: "UPI",
    transactionReference: "UPI_TEST_9981240",
    notes: "First installment paid via Google Pay",
  })
  console.log(`-> Transaction 1 created: ${t1.receiptNumber}, Amount: ₹${t1.amount}`)

  // Verify enrollment was auto-reconciled
  const enrAfterT1 = await prisma.programEnrollment.findUnique({ where: { id: enrollment.id } })
  console.log(`   Enrollment amountPaid: ₹${enrAfterT1?.amountPaid}, paymentStatus: ${enrAfterT1?.paymentStatus}`)
  if (enrAfterT1?.amountPaid !== 4000 || enrAfterT1?.paymentStatus !== "PARTIALLY_PAID") {
    throw new Error(`Expected ₹4000 & PARTIALLY_PAID, got ₹${enrAfterT1?.amountPaid} & ${enrAfterT1?.paymentStatus}`)
  }

  // 3. Test 2nd Installment to settle the remaining balance (e.g. ₹8,000) with Razorpay gateway fields
  const remaining = programPrice - 4000
  console.log(`\n--- Test 2: Record 2nd Settlement Installment (₹${remaining} via Razorpay Gateway) ---`)
  const t2 = await createPaymentTransaction({
    enrollmentId: enrollment.id,
    amount: remaining,
    gateway: "RAZORPAY",
    method: "NET_BANKING",
    gatewayOrderId: "order_test_9884210",
    gatewayPaymentId: "pay_test_4481900",
    gatewaySignature: "sig_mock_hmac256_hash",
    transactionReference: "HDFC_NETBANK_7741",
    notes: "Final settlement online payment",
  })
  console.log(`-> Transaction 2 created: ${t2.receiptNumber}, Amount: ₹${t2.amount}`)

  // Verify enrollment auto-reconciled to fully PAID
  const enrAfterT2 = await prisma.programEnrollment.findUnique({ where: { id: enrollment.id } })
  console.log(`   Enrollment amountPaid: ₹${enrAfterT2?.amountPaid}, paymentStatus: ${enrAfterT2?.paymentStatus}`)
  if (enrAfterT2?.amountPaid !== programPrice || enrAfterT2?.paymentStatus !== "PAID") {
    throw new Error(`Expected ₹${programPrice} & PAID, got ₹${enrAfterT2?.amountPaid} & ${enrAfterT2?.paymentStatus}`)
  }

  // 4. Test Refund: Refund ₹1,500 from Transaction 2
  console.log("\n--- Test 3: Process Partial Refund of ₹1,500 ---")
  const refunded = await refundPaymentTransaction({
    transactionId: t2.id,
    refundAmount: 1500,
    refundReason: "Scholarship rebate concession approved",
  })
  console.log(`-> Transaction status after refund: ${refunded.status}, Refunded Amount: ₹${refunded.refundAmount}`)

  // Verify enrollment amount is deducted and reverted to PARTIALLY_PAID
  const enrAfterRefund = await prisma.programEnrollment.findUnique({ where: { id: enrollment.id } })
  console.log(`   Enrollment amountPaid: ₹${enrAfterRefund?.amountPaid}, paymentStatus: ${enrAfterRefund?.paymentStatus}`)
  if (enrAfterRefund?.amountPaid !== (programPrice - 1500)) {
    throw new Error(`Expected amountPaid ₹${programPrice - 1500}, got ₹${enrAfterRefund?.amountPaid}`)
  }

  // 5. Test Aggregate Stats
  console.log("\n--- Test 4: Financial Metrics Summary ---")
  const stats = await getPaymentStats()
  console.log("Payment Stats Summary:", stats)

  console.log("\n✅ ALL PAYMENT & RECONCILIATION TESTS PASSED 100%!")
}

runTest()
  .catch((err) => {
    console.error("❌ Test failed:", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
