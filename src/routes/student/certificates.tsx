import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { StudentPageTemplate } from "@/components/student/student-page-template"
import { Award } from "lucide-react"

export const Route = createFileRoute("/student/certificates")({
  head: () => ({
    meta: createMetaTags({
      title: "My Verified Certificates | Student Portal",
      description: "View, download, and share your tamper-evident verifiable graduation certificates.",
      path: "/student/certificates",
    }),
  }),
  component: StudentCertificatesPage,
})

function StudentCertificatesPage() {
  return (
    <StudentPageTemplate
      moduleName="My Certificates"
      category="Verifiable Credentials"
      description="Access your tamper-evident cryptographically signed certificates, copy public verification links, and export PDF documents."
      icon={Award}
      badgeText="1 Certificate Available"
      primaryActionLabel="Download Official PDF"
      metrics={[
        { label: "Issued Credentials", value: "1 Diploma", change: "Full Verification" },
        { label: "Verification Status", value: "Valid", change: "100% Cryptographic" },
        { label: "Certificate ID", value: "#IC-2026-8942", change: "Publicly Searchable" },
        { label: "Issuer", value: "The Iconic Career", change: "Enterprise Accredited" },
      ]}
      features={[
        "High-resolution vector PDF certificate download with official cryptographic seals",
        "Permanent shareable verification link pointing to /verify/[certificateId]",
        "1-Click 'Add to LinkedIn Profile' credential badge embedder",
        "Official Academic Transcript & Internship Experience Letter export",
      ]}
    />
  )
}
