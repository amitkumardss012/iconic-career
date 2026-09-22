import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { StudentPageTemplate } from "@/components/student/student-page-template"
import { BookOpen } from "lucide-react"

export const Route = createFileRoute("/student/courses")({
  head: () => ({
    meta: createMetaTags({
      title: "My Enrolled Courses | Student Portal",
      description: "Access course curriculum modules, lecture replays, and assignment submission dropboxes.",
      path: "/student/courses",
    }),
  }),
  component: StudentCoursesPage,
})

function StudentCoursesPage() {
  return (
    <StudentPageTemplate
      moduleName="My Courses"
      category="Candidate Curriculum"
      description="View and continue your active curriculum modules, review instructor comments, and submit weekly milestone projects."
      icon={BookOpen}
      badgeText="Active Courses (2)"
      primaryActionLabel="Resume Next Lesson"
      metrics={[
        { label: "Enrolled Courses", value: "2 Tracks", change: "100% On Schedule" },
        { label: "Completed Modules", value: "14 / 20", change: "+2 this week" },
        { label: "Milestone Grade", value: "94.5%", change: "A+ Grade" },
        { label: "Live Lab Hours", value: "36.5 Hrs", change: "+6.5 hrs logged" },
      ]}
      features={[
        "Structured weekly video modules with downloadable lecture slides & guides",
        "Interactive browser terminal and code challenge validator",
        "Automated GitHub milestone repository sync and test evaluator",
        "Direct discussion channel with batchmates and teaching assistants",
      ]}
    />
  )
}
