import { createFileRoute } from "@tanstack/react-router"
import { getStaticFaqs } from "@/lib/data/static-content"
import { createMetaTags } from "@/lib/seo"
import { FaqHeroSection } from "@/components/faq/faq-hero-section"
import { FaqBrowser } from "@/components/faq/faq-browser"
import { FaqQuickHelpStrip } from "@/components/faq/faq-quick-help-strip"
import { FaqFinalCtaSection } from "@/components/faq/faq-final-cta-section"

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: createMetaTags({
      title: "Frequently Asked Questions & Knowledgebase",
      description:
        "Find clear, documented answers regarding candidate registration, supervised internship hours, payment verification, and public QR credential audits.",
      path: "/faq",
    }),
  }),
  loader: () => {
    const allFaqs = getStaticFaqs()
    return { allFaqs }
  },
  component: FaqPage,
})

function FaqPage() {
  const { allFaqs } = Route.useLoaderData()

  return (
    <div className="w-full flex flex-col bg-[#faf8f5]">
      {/* 01. EDITORIAL HERO SECTION */}
      <FaqHeroSection />

      {/* 02. INTERACTIVE SEARCH CONSOLE & ACCORDION */}
      <FaqBrowser initialFaqs={allFaqs} />

      {/* 03. DIRECT ASSISTANCE CHANNELS STRIP */}
      <FaqQuickHelpStrip />

      {/* 04. CINEMATIC CONVERSION & CONTACT LAUNCHPAD */}
      <FaqFinalCtaSection />
    </div>
  )
}
