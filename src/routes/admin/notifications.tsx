import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { AdminPageTemplate } from "@/components/admin/admin-page-template"
import { Bell } from "lucide-react"

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: createMetaTags({
      title: "Notifications & Broadcasts | Admin Console",
      description: "Manage candidate alerts, cohort announcements, SMS notifications, and system bulletins.",
      path: "/admin/notifications",
    }),
  }),
  component: AdminNotificationsPage,
})

function AdminNotificationsPage() {
  return (
    <AdminPageTemplate
      moduleName="Notifications"
      category="Candidate Communications"
      description="Create targeted announcements, schedule cohort milestone reminders, configure transactional email triggers, and send alerts."
      icon={Bell}
      badgeText="Module Initialized"
      primaryActionLabel="New Broadcast"
      metrics={[
        { label: "Sent This Month", value: "8,420", change: "+14.2% engagement", trend: "up" },
        { label: "Delivery Rate", value: "99.4%", change: "High inbox deliverability", trend: "up" },
        { label: "Open Rate", value: "68.2%", change: "+4.1% industry avg", trend: "up" },
        { label: "Scheduled Alerts", value: "3 Scheduled", change: "Upcoming", trend: "neutral" },
      ]}
      features={[
        "Multi-channel broadcast manager (Email, In-app banner, WhatsApp/SMS)",
        "Cohort-targeted audience segmenting and dynamic tag interpolation",
        "Automated milestone deadline reminder scheduling",
        "Comprehensive dispatch audit logs and failure re-delivery pipeline",
      ]}
    />
  )
}
