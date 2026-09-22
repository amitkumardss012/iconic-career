import dotenv from "dotenv"
dotenv.config()

import { prisma } from "../src/lib/prisma"
import { createEnrollment } from "../src/lib/services/enrollments"

async function testCreate() {
  console.log("=== Testing createEnrollment service invocation ===")

  // 1. Find a test student
  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  })

  if (!student) {
    throw new Error("No student found in DB to test enrollment.")
  }

  // 2. Find a test program
  const program = await prisma.program.findFirst()
  if (!program) {
    throw new Error("No program found in DB to test enrollment.")
  }

  console.log(`Enrolling Student ID: ${student.id} (${student.name}) into Program ID: ${program.id} (${program.title})`)

  // 3. Remove any existing enrollment for this pair to allow clean test
  await prisma.programEnrollment.deleteMany({
    where: {
      userId: student.id,
      programId: program.id,
    },
  })

  // 4. Create enrollment
  const res = await createEnrollment({
    userId: student.id,
    programId: program.id,
    startDate: new Date().toISOString(),
    durationWeeks: 8,
    durationMonths: 2,
    paymentStatus: "PAID",
    amountPaid: Number(program.price || 0),
    mentorName: "Dr. Aryan Mehta",
    mentorEmail: "aryan@iconiccareer.com",
    adminNotes: "Automated verification test enrollment.",
    source: "ADMIN_MANUAL",
  })

  console.log("-> Enrollment created successfully!")
  console.log("   Enrollment Number:", res.enrollmentNumber)
  console.log("   Expected End Date:", res.expectedEndDate)
  console.log("   Student Name:", res.user?.name)
  console.log("   Program Title:", res.program?.title)
  console.log("   Duration:", res.durationWeeks, "Weeks")

  console.log("\n=== TEST PASSED: Student enrollment created cleanly without any error! ===")
}

testCreate().catch((err) => {
  console.error("TEST FAILED:", err)
  process.exit(1)
})
