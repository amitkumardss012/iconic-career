import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { AdminPageTemplate } from "@/components/admin/admin-page-template"
import { BarChart3 } from "lucide-react"

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: createMetaTags({
      title: "Analytics & Institutional Reports | Admin Console",
      description: "Generate placement audit reports, revenue summaries, cohort completion metrics, and data exports.",
      path: "/admin/reports",
    }),
  }),
  component: AdminReportsPage,
})

function AdminReportsPage() {
  return (
    <AdminPageTemplate
      moduleName="Reports"
      category="Intelligence & Analytics"
      description="Export comprehensive operational datasets, candidate hiring metrics, cohort retention curves, and financial reconciliation books."
      icon={BarChart3}
      badgeText="Module Initialized"
      primaryActionLabel="Generate Report"
      metrics={[
        { label: "Available Reports", value: "12 Pre-built", change: "Custom queries allowed", trend: "neutral" },
        { label: "Placement Rate", value: "96.8%", change: "+2.4% year-over-year", trend: "up" },
        { label: "Avg Salary Package", value: "₹7.8 LPA", change: "Top tier placement", trend: "up" },
        { label: "Export Formats", value: "CSV, XLSX, PDF", change: "Direct download", trend: "neutral" },
      ]}
      features={[
        "Interactive cohort lifecycle analysis and dropout attribution heatmaps",
        "Corporate partner hiring velocity & feedback rating aggregation",
        "Scheduled automated weekly intelligence summary emails to leadership",
        "Granular filter builder with date ranges, track segments, and outcome metrics",
      ]}
    />
  )
}
