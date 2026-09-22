import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { VerifyHeroSection } from "@/components/certificates/verify-hero-section"
import { VerifyDualMethodsSection } from "@/components/certificates/verify-dual-methods-section"
import { VerifySpecimenSection } from "@/components/certificates/verify-specimen-section"
import { VerifyFinalCtaSection } from "@/components/certificates/verify-final-cta-section"

export const Route = createFileRoute("/verify/")({
  head: () => ({
    meta: createMetaTags({
      title: "Public Certificate Verification",
      description:
        "Verify the authenticity, supervised duration, and completion standing of internship certificates issued by The Iconic Career.",
      path: "/verify",
    }),
  }),
  component: VerifyPage,
})

function VerifyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 01. Hero & Verification Terminal */}
      <VerifyHeroSection />

      {/* 02. Two Verification Pathways (Bento) */}
      <VerifyDualMethodsSection />

      {/* 03. Official Specimen Architecture */}
      <VerifySpecimenSection />

      {/* 04. Final Conversion Callout */}
      <VerifyFinalCtaSection />
    </div>
  )
}
