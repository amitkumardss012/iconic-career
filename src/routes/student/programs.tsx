import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { StudentPageTemplate } from "@/components/student/student-page-template"
import { GraduationCap } from "lucide-react"

export const Route = createFileRoute("/student/programs")({
  head: () => ({
    meta: createMetaTags({
      title: "My Internship Programs | Student Portal",
      description: "Track your supervised corporate internship cohort deliverables and industry supervisor evaluations.",
      path: "/student/programs",
    }),
  }),
  component: StudentProgramsPage,
})

function StudentProgramsPage() {
  return (
    <StudentPageTemplate
      moduleName="My Programs"
      category="Internship Tracks"
      description="Supervise your corporate internship track progression, view industry mentor milestone approvals, and review feedback."
      icon={GraduationCap}
      badgeText="Active Internship Track"
      primaryActionLabel="View Company Deliverables"
      metrics={[
        { label: "Active Track", value: "Full Stack Eng", change: "Cohort 2026-Q1" },
        { label: "Supervisor Rating", value: "4.9 / 5.0", change: "Excellent Standing" },
        { label: "Stipend Status", value: "Eligible", change: "Verification Complete" },
        { label: "Completion Date", value: "April 30, 2026", change: "4 Weeks Remaining" },
      ]}
      features={[
        "Corporate project milestone tracker with supervisor sign-off workflows",
        "Weekly 1:1 engineering mentor office hours scheduling",
        "Mid-term and final project evaluation dossier generation",
        "Verified Experience Letter & Recommendation issuance pipeline",
      ]}
    />
  )
}
