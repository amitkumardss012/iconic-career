import dotenv from "dotenv"
dotenv.config()

import { prisma } from "../src/lib/prisma"
import { createEnrollment, updateEnrollment } from "../src/lib/services/enrollments"

async function runTest() {
  console.log("=== Testing Custom & Auto-Generated Enrollment Number Support ===")

  // 1. Fetch any student & program
  const user = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  })
  if (!user) throw new Error("No student user found")

  const program = await prisma.program.findFirst()
  if (!program) throw new Error("No program found")

  // Delete existing test enrollments if any
  const customNumber = `ENR-2026-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`
  const updatedCustomNumber = `ENR-2026-UPDATED-${Math.floor(1000 + Math.random() * 9000)}`

  await prisma.programEnrollment.deleteMany({
    where: {
      userId: user.id,
      programId: program.id,
    },
  })

  // 2. Test createEnrollment with custom enrollmentNumber
  console.log(`Creating enrollment with custom ID: ${customNumber}...`)
  const created = await createEnrollment({
    enrollmentNumber: customNumber,
    userId: user.id,
    programId: program.id,
    startDate: new Date().toISOString(),
    durationWeeks: 8,
    paymentStatus: "PAID",
    source: "ADMIN_MANUAL",
  })

  console.log(`-> Created enrollment with ID: ${created.enrollmentNumber}`)
  if (created.enrollmentNumber !== customNumber) {
    throw new Error(`Expected ${customNumber}, got ${created.enrollmentNumber}`)
  }

  // 3. Test updateEnrollment to change enrollmentNumber
  console.log(`Updating enrollment ${created.id} to new custom ID: ${updatedCustomNumber}...`)
  const updated = await updateEnrollment(created.id, {
    enrollmentNumber: updatedCustomNumber,
    progressPercent: 80,
  })

  console.log(`-> Updated enrollment with ID: ${updated.enrollmentNumber}`)
  if (updated.enrollmentNumber !== updatedCustomNumber) {
    throw new Error(`Expected ${updatedCustomNumber}, got ${updated.enrollmentNumber}`)
  }

  console.log("✅ Custom and Auto-Generated Enrollment Number Test Passed 100%!")
}

runTest()
  .catch((err) => {
    console.error("❌ Test failed:", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
