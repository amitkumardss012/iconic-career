import dotenv from "dotenv"
dotenv.config()

import { prisma } from "../src/lib/prisma"
import { updateEnrollment } from "../src/lib/services/enrollments"

async function runTest() {
  console.log("=== Testing Full Enrollment Update Service ===")

  // Find any existing enrollment
  const enrollment = await prisma.programEnrollment.findFirst({
    include: {
      user: true,
      program: true,
    },
  })

  if (!enrollment) {
    console.log("No enrollment found to update. Test completed.")
    return
  }

  console.log(`Found enrollment: ${enrollment.enrollmentNumber} (ID: ${enrollment.id})`)
  console.log(`Student: ${enrollment.user?.name}, Current Status: ${enrollment.status}`)

  const newStartDate = new Date("2026-10-01T00:00:00.000Z")
  const newExpectedEndDate = new Date("2026-12-01T00:00:00.000Z")

  const updated = await updateEnrollment(enrollment.id, {
    status: "ACTIVE",
    durationWeeks: 12,
    durationMonths: 3,
    startDate: newStartDate.toISOString(),
    expectedEndDate: newExpectedEndDate.toISOString(),
    progressPercent: 65,
    grade: "A+",
    mentorName: "Dr. Vikram Sarabhai",
    mentorEmail: "vikram@iconiccareer.com",
    paymentStatus: "PAID",
    amountPaid: 4999,
    paymentReference: "TEST_PAY_REF_99812",
    certificateIssued: true,
    certificateId: "CERT-2026-TEST-001",
    adminNotes: "Test updated internal admin note.",
  })

  console.log("=== Update Result ===")
  console.log(`Enrollment Number: ${updated.enrollmentNumber}`)
  console.log(`Status: ${updated.status}`)
  console.log(`Duration: ${updated.durationWeeks} weeks (${updated.durationMonths} months)`)
  console.log(`Progress: ${updated.progressPercent}%`)
  console.log(`Grade: ${updated.grade}`)
  console.log(`Mentor: ${updated.mentorName} (${updated.mentorEmail})`)
  console.log(`Payment Status: ${updated.paymentStatus}, Amount: ₹${updated.amountPaid}, Ref: ${updated.paymentReference}`)
  console.log(`Certificate Issued: ${updated.certificateIssued}, ID: ${updated.certificateId}`)
  console.log(`Admin Notes: ${updated.adminNotes}`)

  console.log("✅ Full Enrollment Update Test Passed Successfully!")
}

runTest()
  .catch((err) => {
    console.error("❌ Test failed:", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
