import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { AdminPageTemplate } from "@/components/admin/admin-page-template"
import { Settings } from "lucide-react"

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: createMetaTags({
      title: "Portal Settings & Governance | Admin Console",
      description: "Manage system preferences, role-based access control, API secrets, and portal branding.",
      path: "/admin/settings",
    }),
  }),
  component: AdminSettingsPage,
})

function AdminSettingsPage() {
  return (
    <AdminPageTemplate
      moduleName="Settings"
      category="Portal Configuration"
      description="Configure role-based access control (RBAC), API authentication secrets, payment gateway keys, SMTP email relays, and platform metadata."
      icon={Settings}
      badgeText="Module Initialized"
      primaryActionLabel="Save Changes"
      metrics={[
        { label: "Admin Users", value: "3 Active", change: "2FA Enabled", trend: "neutral" },
        { label: "Connected APIs", value: "5 Integrations", change: "Healthy", trend: "up" },
        { label: "Security Level", value: "Tier 1", change: "Strict Policy", trend: "up" },
        { label: "System Version", value: "v1.0.4", change: "Latest build", trend: "neutral" },
      ]}
      features={[
        "Granular administrator role management (Super Admin, Reviewer, Finance, Mentor)",
        "Razorpay, Resend/SMTP, and Database connection strings credential manager",
        "Branding configuration (Logos, certificates, SEO meta tags, email templates)",
        "Audit log retention and compliance data export tools",
      ]}
    />
  )
}
