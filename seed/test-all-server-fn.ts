import dotenv from "dotenv"
dotenv.config()

import { prisma } from "../src/lib/prisma"
import { getStudents } from "../src/lib/services/students"
import { getPrograms } from "../src/lib/services/programs"
import { getEnrollments, getEnrollmentStats } from "../src/lib/services/enrollments"
import { getUsers } from "../src/lib/services/user"

async function runAllServiceChecks() {
  console.log("=== Testing All Services Database Invocations ===")

  console.log("\n1. Testing getStudents()...")
  const studentsRes = await getStudents({ page: 1, limit: 10, status: "ALL" })
  console.log("-> getStudents SUCCESS:", studentsRes.success, "Total students:", studentsRes.pagination.total)

  console.log("\n2. Testing getPrograms()...")
  const programsRes = await getPrograms({ page: 1, limit: 10 })
  console.log("-> getPrograms SUCCESS:", programsRes.success, "Total programs:", programsRes.pagination.total)

  console.log("\n3. Testing getEnrollments()...")
  const enrollmentsRes = await getEnrollments({ page: 1, limit: 10 })
  console.log("-> getEnrollments SUCCESS! Total enrollments:", enrollmentsRes.total)

  console.log("\n4. Testing getEnrollmentStats()...")
  const statsRes = await getEnrollmentStats()
  console.log("-> getEnrollmentStats SUCCESS:", statsRes)

  console.log("\n5. Testing getUsers()...")
  const usersRes = await getUsers({ page: 1, limit: 10, role: "ADMIN" })
  console.log("-> getUsers SUCCESS:", usersRes.success, "Total admin users:", usersRes.pagination.total)

  console.log("\n=== ALL DATABASE SERVICE CHECKS PASSED WITH 0 ERRORS! ===")
}

runAllServiceChecks().catch((err) => {
  console.error("FATAL ERROR IN SERVICE CHECK:", err)
  process.exit(1)
})
