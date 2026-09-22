import "dotenv/config"
import { prisma } from "../src/lib/prisma"
import { hashPassword } from "../src/lib/server/crypto"

async function seedAdmin() {
  console.log("🌱 Starting Admin User Seed...")

  const adminName = process.env.ADMIN_SEED_NAME || "Master Administrator"
  const adminEmail = (process.env.ADMIN_SEED_EMAIL || "admin@iconiccareer.com").toLowerCase().trim()
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "Admin@12345"
  const adminPhone = process.env.ADMIN_SEED_PHONE || "+919876543210"

  // 1. Hash password securely using scrypt with random salt
  const hashedPassword = hashPassword(adminPassword)

  // 2. Upsert the admin record in the database
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: hashedPassword,
      phone: adminPhone,
      role: "ADMIN",
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      phone: adminPhone,
      role: "ADMIN",
    },
  })

  console.log("✅ Admin user seeded successfully!")
  console.log("------------------------------------------")
  console.log(`👤 Name:     ${admin.name}`)
  console.log(`📧 Email:    ${admin.email}`)
  console.log(`📱 Phone:    ${admin.phone}`)
  console.log(`🔑 Role:     ${admin.role}`)
  console.log(`🔒 Password: ${adminPassword}`)
  console.log("------------------------------------------")
  console.log("👉 You can now log in at /login with these credentials.")
}

seedAdmin()
  .catch((error) => {
    console.error("❌ Error seeding admin user:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
