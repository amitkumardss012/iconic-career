import * as React from "react"
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { getClientSession } from "@/lib/auth/session"
import { registerSearchSchema, type RegisterSearchInput } from "@/lib/validation/auth"
import { RegisterHeroSection } from "@/components/forms/register-hero-section"
import { StudentRegistrationForm } from "@/components/forms/student-registration-form"
import { RegisterAssuranceStrip } from "@/components/forms/register-assurance-strip"

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): RegisterSearchInput => {
    return registerSearchSchema.parse(search)
  },
  beforeLoad: () => {
    const session = getClientSession()
    if (session) {
      if (session.role === "ADMIN") {
        throw redirect({ to: "/admin" })
      } else {
        throw redirect({ to: "/student" })
      }
    }
  },
  head: () => ({
    meta: createMetaTags({
      title: "Candidate Registration & Student Enrollment Portal | The Iconic Career",
      description:
        "Create your student identity dossier, fill in your academic details, set your secure password, and enroll in industry-aligned internship tracks.",
      path: "/register",
    }),
  }),
  component: RegisterPage,
})

function RegisterPage() {
  const router = useRouter()
  const [checkingSession, setCheckingSession] = React.useState(true)

  React.useEffect(() => {
    const session = getClientSession()
    if (session) {
      if (session.role === "ADMIN") {
        router.navigate({ to: "/admin" })
      } else {
        router.navigate({ to: "/student" })
      }
    } else {
      setCheckingSession(false)
    }
  }, [router])

  if (checkingSession) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-[#faf8f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 animate-spin rounded-full border-2 border-[#14233c] border-t-transparent" />
          <span className="text-xs font-semibold text-[#596579]">Checking active session...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col bg-[#faf8f5]">
      {/* 01. EDITORIAL HERO SECTION */}
      <RegisterHeroSection />

      {/* 02. STUDENT REGISTRATION & CREDENTIAL SETUP CONSOLE */}
      <section className="relative w-full py-10 sm:py-16 px-4 sm:px-8 lg:px-12">
        <StudentRegistrationForm />
      </section>

      {/* 03. SUPERVISED ADMISSIONS ASSURANCE STRIP */}
      <RegisterAssuranceStrip />
    </div>
  )
}


