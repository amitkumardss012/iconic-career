import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { StudentDashboardPage } from "./index"

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: createMetaTags({
      title: "Student Dashboard | The Iconic Career",
      description: "Candidate learning dashboard, active courses, milestone submissions, and certificates.",
      path: "/student/dashboard",
    }),
  }),
  component: StudentDashboardPage,
})
