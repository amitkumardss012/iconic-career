import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { AboutHeroSection } from "@/components/about/about-hero-section"
import { AboutWhoWeAreSection } from "@/components/about/about-who-we-are-section"
import { AboutWhatWeDoSection } from "@/components/about/about-what-we-do-section"
import { AboutMethodologySection } from "@/components/about/about-methodology-section"
import { AboutValuesSection } from "@/components/about/about-values-section"
import { AboutVerificationIntegritySection } from "@/components/about/about-verification-integrity-section"
import { AboutFinalCtaSection } from "@/components/about/about-final-cta-section"

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: createMetaTags({
      title: "About The Iconic Career",
      description:
        "Learn about our mission, structured internship methodology, and commitment to verifiable student credentials.",
      path: "/about",
    }),
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* 01. HERO (Identity & Mission) */}
      <AboutHeroSection />

      {/* 02. WHO WE ARE (The Broken Reality vs. The Standard) */}
      <AboutWhoWeAreSection />

      {/* 03. WHAT WE DO (4-Pillar Executive Bento Vault) */}
      <AboutWhatWeDoSection />

      {/* 04. OUR METHODOLOGY (Dark Contrast Stage & 4 Operating Rules) */}
      <AboutMethodologySection />

      {/* 05. CORE VALUES (Tactile Architectural Values Cards) */}
      <AboutValuesSection />

      {/* 06. VERIFICATION INTEGRITY (Public Audit Standards & QR Protocol) */}
      <AboutVerificationIntegritySection />

      {/* 07. FINAL CTA (Cinematic Career Launchpad) */}
      <AboutFinalCtaSection />
    </div>
  )
}
