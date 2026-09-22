import { createFileRoute, redirect } from "@tanstack/react-router"
import { StudentLayout } from "@/components/student/student-layout"
import { createMetaTags } from "@/lib/seo"
import { getClientSession } from "@/lib/auth/session"

export const Route = createFileRoute("/student")({
  beforeLoad: ({ location }) => {
    const session = getClientSession()
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      })
    }
    return { session }
  },
  head: () => ({
    meta: createMetaTags({
      title: "Student Portal | The Iconic Career",
      description: "Candidate learning management, enrolled courses, and verified certificates.",
      path: "/student",
    }),
  }),
  component: StudentLayoutRoute,
})

function StudentLayoutRoute() {
  return <StudentLayout />
}
