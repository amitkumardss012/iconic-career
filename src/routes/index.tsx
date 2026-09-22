import { createFileRoute } from "@tanstack/react-router"
import { getStaticFeaturedFaqs } from "@/lib/data/static-content"
import { getHomeProgramsFn } from "@/lib/server/programs"
import { createMetaTags } from "@/lib/seo"
import { HeroSection } from "@/components/home/hero-section"
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section"
import { TrustCredibilitySection } from "@/components/home/trust-credibility-section"
import { CurriculumTracksSection } from "@/components/home/curriculum-tracks-section"
import { InternshipJourneySection } from "@/components/home/internship-journey-section"
import { StudentOutcomesSection } from "@/components/home/student-outcomes-section"
import { CertificateShowcaseSection } from "@/components/home/certificate-showcase-section"
import { VerificationCalloutSection } from "@/components/home/verification-callout-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FaqPreviewSection } from "@/components/home/faq-preview-section"
import { FinalCtaSection } from "@/components/home/final-cta-section"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: createMetaTags({
      path: "/",
    }),
  }),
  loader: async () => {
    const featuredFaqs = getStaticFeaturedFaqs()
    const { courses, internships } = await getHomeProgramsFn({ data: {} })
    return { featuredFaqs, courses, internships }
  },
  component: HomePage,
})

function HomePage() {
  const { featuredFaqs, courses, internships } = Route.useLoaderData()

  return (
    <div className="flex flex-col">
      {/* 01. HERO SECTION (Exact to mockup) */}
      <HeroSection />

      {/* 02. WHY CHOOSE US SECTION (Exact to mockup) */}
      <WhyChooseUsSection />

      {/* 03. TRUST & CREDIBILITY SECTION (Exact to mockup) */}
      <TrustCredibilitySection />

      {/* 04. CURRICULUM & TRACKS SECTION (Interactive Curriculum Studio) */}
      <CurriculumTracksSection courses={courses} internships={internships} />

      {/* 05. INTERNSHIP EXPERIENCE JOURNEY (Connected Milestone Pipeline) */}
      <InternshipJourneySection />

      {/* 06. WHAT STUDENTS RECEIVE (Executive Deliverables Bento Vault) */}
      <StudentOutcomesSection />

      {/* 07. CERTIFICATE SHOWCASE (Sovereign Credential Stage) */}
      <CertificateShowcaseSection />

      {/* 08. CERTIFICATE VERIFICATION CALLOUT (Public Registry Search Console) */}
      <VerificationCalloutSection />

      {/* 09. TESTIMONIALS (Verified Alumni Story Deck) */}
      <TestimonialsSection />

      {/* 10. FAQ PREVIEW (Split-Screen Knowledgebase) */}
      <FaqPreviewSection faqs={featuredFaqs} />

      {/* 11. FINAL CONVERSION CTA (Cinematic Career Launchpad) */}
      <FinalCtaSection />
    </div>
  )
}
