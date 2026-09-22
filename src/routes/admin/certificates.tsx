import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { AdminPageTemplate } from "@/components/admin/admin-page-template"
import { Award } from "lucide-react"

export const Route = createFileRoute("/admin/certificates")({
  head: () => ({
    meta: createMetaTags({
      title: "Certificate Issuance & Verification | Admin Console",
      description: "Generate, digitally sign, verify, and revoke cryptographic graduation credentials.",
      path: "/admin/certificates",
    }),
  }),
  component: AdminCertificatesPage,
})

function AdminCertificatesPage() {
  return (
    <AdminPageTemplate
      moduleName="Certificates"
      category="Credential Ledger"
      description="Issue tamper-evident cryptographic certificates, manage candidate credential verification QR codes, and audit ledger entries."
      icon={Award}
      badgeText="Module Initialized"
      primaryActionLabel="Issue Certificate"
      metrics={[
        { label: "Total Issued", value: "412", change: "+18 this month", trend: "up" },
        { label: "Public Verifications", value: "1,894", change: "+140% employer lookups", trend: "up" },
        { label: "Active Templates", value: "6 Formats", change: "Standardized", trend: "neutral" },
        { label: "Verification Integrity", value: "100%", change: "0 forged attempts", trend: "up" },
      ]}
      features={[
        "Dynamic high-resolution PDF certificate generator with custom seals",
        "Unique public verification ID generation mapped to /verify/[certificateId]",
        "Batch issuance tool with automated candidate notification email",
        "Emergency revocation and credential reissue audit workflow",
      ]}
    />
  )
}
