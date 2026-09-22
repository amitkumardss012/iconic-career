import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { AdminDashboardPage } from "./index"

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: createMetaTags({
      title: "Admin Dashboard | The Iconic Career",
      description: "Executive operational overview and centralized administration portal.",
      path: "/admin/dashboard",
    }),
  }),
  component: AdminDashboardPage,
})
