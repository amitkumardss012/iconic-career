import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { ContactHeroSection } from "@/components/contact/contact-hero-section"
import { ContactChannelsCard } from "@/components/contact/contact-channels-card"
import { ContactForm } from "@/components/forms/contact-form"
import { ContactAssuranceStrip } from "@/components/contact/contact-assurance-strip"

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: createMetaTags({
      title: "Contact Admissions & Coordination",
      description:
        "Speak directly with the admissions, program coordination, and institutional partnership team at The Iconic Career.",
      path: "/contact",
    }),
  }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <div className="w-full flex flex-col bg-[#faf8f5]">
      {/* 01. EDITORIAL HERO SECTION */}
      <ContactHeroSection />

      {/* 02. TWO-COLUMN COMMUNICATION & FORM DIRECTORY */}
      <section className="relative w-full py-12 sm:py-16">
        <div className="w-full max-w-350 mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Organization Directory & Channels */}
            <div className="lg:col-span-5">
              <ContactChannelsCard />
            </div>

            {/* Right Column: Inquiry Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* 03. INSTITUTIONAL ASSURANCE STRIP */}
      <ContactAssuranceStrip />
    </div>
  )
}
