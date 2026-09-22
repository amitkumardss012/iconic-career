import "dotenv/config"
import { prisma } from "../src/lib/prisma"
import { hashPassword } from "../src/lib/server/crypto"

const SAMPLE_STUDENTS = [
  {
    name: "Alex Candidate",
    email: "student@iconiccareer.com",
    phone: "+919876543211",
    password: "Student@12345",
    college: "Indian Institute of Technology, Bombay",
    course: "B.Tech Computer Science & Engineering",
    status: "ACTIVE" as const,
    city: "Mumbai",
    state: "Maharashtra",
    notes: "High performing candidate in web architecture cohort.",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+919876543222",
    password: "Student@12345",
    college: "Delhi Technological University (DTU)",
    course: "B.Tech Information Technology",
    status: "ACTIVE" as const,
    city: "New Delhi",
    state: "Delhi",
    notes: "Specializes in PyTorch model fine-tuning.",
  },
  {
    name: "Rohan Varma",
    email: "rohan.varma@example.com",
    phone: "+919876543233",
    password: "Student@12345",
    college: "National Institute of Technology, Surathkal",
    course: "B.Tech Electronics & Communication",
    status: "COMPLETED" as const,
    city: "Mangalore",
    state: "Karnataka",
    notes: "Completed with A+ honor grade. Certificate issued.",
  },
  {
    name: "Sneha Mukherjee",
    email: "sneha.m@example.com",
    phone: "+919876543244",
    password: "Student@12345",
    college: "Jadavpur University, Kolkata",
    course: "B.Sc Computer Science (Hons)",
    status: "INACTIVE" as const,
    city: "Kolkata",
    state: "West Bengal",
    notes: "On medical hiatus, resume scheduled next month.",
  },
]

async function seedStudents() {
  console.log("🌱 Starting Student Records & Profiles Seed...")

  for (const s of SAMPLE_STUDENTS) {
    const hashedPassword = hashPassword(s.password)

    // Upsert User record
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {
        name: s.name,
        phone: s.phone,
        password: hashedPassword,
        role: "STUDENT",
      },
      create: {
        name: s.name,
        email: s.email,
        phone: s.phone,
        password: hashedPassword,
        role: "STUDENT",
      },
    })

    // Upsert StudentProfile record
    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        college: s.college,
        course: s.course,
        status: s.status,
        isActive: s.status === "ACTIVE",
        city: s.city,
        state: s.state,
        notes: s.notes,
      },
      create: {
        userId: user.id,
        college: s.college,
        course: s.course,
        status: s.status,
        isActive: s.status === "ACTIVE",
        city: s.city,
        state: s.state,
        notes: s.notes,
      },
    })

    console.log(`  ✅ Seeded: ${s.name} (${s.email}) - ${s.college}`)
  }

  console.log("--------------------------------------------------")
  console.log("🎉 All sample students seeded with full profiles!")
}

seedStudents()
  .catch((error) => {
    console.error("❌ Error seeding student records:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
