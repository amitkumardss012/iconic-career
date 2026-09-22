import dotenv from "dotenv"
dotenv.config()

import { prisma } from "../src/lib/prisma"
import { createEnrollment } from "../src/lib/services/enrollments"

async function runTest() {
  console.log("=== Testing Auto Payment Record Creation on Enrollment ===")

  const user = await prisma.user.findFirst({ where: { role: "STUDENT" } })
  if (!user) throw new Error("No student user found")

  const program = await prisma.program.findFirst()
  if (!program) throw new Error("No program found")

  // Delete previous test enrollment
  await prisma.programEnrollment.deleteMany({
    where: { userId: user.id, programId: program.id },
  })

  // 1. Create an enrollment with initial paid amount = ₹7500
  console.log(`Enrolling student "${user.name}" with initial payment of ₹7500...`)
  const enrollment = await createEnrollment({
    userId: user.id,
    programId: program.id,
    paymentStatus: "PARTIALLY_PAID",
    amountPaid: 7500,
    paymentReference: "AUTO_PAY_REF_7719",
    source: "ADMIN_MANUAL",
  })

  console.log(`-> Enrollment created: ${enrollment.enrollmentNumber} (ID: ${enrollment.id})`)
  console.log(`   Enrollment amountPaid: ₹${enrollment.amountPaid}`)

  // 2. Verify that a PaymentTransaction was automatically created
  const transactions = await prisma.paymentTransaction.findMany({
    where: { enrollmentId: enrollment.id },
  })

  console.log(`Found ${transactions.length} payment transaction(s) for this enrollment:`)
  for (const t of transactions) {
    console.log(` - Receipt: ${t.receiptNumber}, Amount: ₹${t.amount}, Method: ${t.method}, Status: ${t.status}, Ref: ${t.transactionReference}`)
  }

  if (transactions.length !== 1) {
    throw new Error(`Expected exactly 1 payment transaction, found ${transactions.length}`)
  }

  const tx = transactions[0]
  if (tx.amount !== 7500 || tx.status !== "SUCCESS" || tx.transactionReference !== "AUTO_PAY_REF_7719") {
    throw new Error(`Transaction details mismatch: ${JSON.stringify(tx)}`)
  }

  console.log("✅ Auto Payment Record on Enrollment Test Passed 100%!")
}

runTest()
  .catch((err) => {
    console.error("❌ Test failed:", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
