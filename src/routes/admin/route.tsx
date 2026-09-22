import { createFileRoute, redirect } from "@tanstack/react-router"
import { AdminLayout } from "@/components/admin/admin-layout"
import { createMetaTags } from "@/lib/seo"
import { getClientSession } from "@/lib/auth/session"

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    const session = getClientSession()
    if (!session || session.role !== "ADMIN") {
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
      title: "Admin Console | The Iconic Career",
      description: "Administrative console for managing candidates, courses, internships, and certifications.",
      path: "/admin",
    }),
  }),
  component: AdminLayoutRoute,
})

function AdminLayoutRoute() {
  return <AdminLayout />
}
