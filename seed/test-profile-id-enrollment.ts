import dotenv from "dotenv"
dotenv.config()

import { prisma } from "../src/lib/prisma"
import { createEnrollment } from "../src/lib/services/enrollments"

async function testProfileId() {
  console.log("=== Testing enrollment creation when passing StudentProfile.id ===")

  // Find a student profile where studentProfile.id != user.id
  const profile = await prisma.studentProfile.findFirst({
    include: { user: true },
  })

  if (!profile) {
    throw new Error("No student profile found.")
  }

  const program = await prisma.program.findFirst()
  if (!program) {
    throw new Error("No program found.")
  }

  console.log(`Testing with StudentProfile ID: ${profile.id} (User ID: ${profile.userId}, Name: ${profile.user.name})`)

  // Delete previous enrollment if any
  await prisma.programEnrollment.deleteMany({
    where: {
      userId: profile.userId,
      programId: program.id,
    },
  })

  // Pass profile.id (instead of user.id) directly to createEnrollment
  const res = await createEnrollment({
    userId: profile.id, // Passing studentProfile.id (e.g. 15)
    programId: program.id,
    startDate: new Date().toISOString(),
    durationWeeks: 8,
    paymentStatus: "PAID",
    source: "ADMIN_MANUAL",
  })

  console.log("-> Success! Correctly resolved student and created enrollment:", res.enrollmentNumber)
  console.log("   Enrollment student user ID:", res.userId)
  console.log("   Enrollment user name:", res.user?.name)
  console.log("=== PROFILE ID RESOLUTION TEST PASSED 100%! ===")
}

testProfileId().catch((err) => {
  console.error("Test failed:", err)
  process.exit(1)
})
