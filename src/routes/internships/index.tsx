import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { getHomeProgramsFn } from "@/lib/server/programs"
import { InternshipsHeroSection } from "@/components/internships/internships-hero-section"
import { InternshipsCatalog } from "@/components/internships/internships-catalog"
import { InternshipsAssuranceStrip } from "@/components/internships/internships-assurance-strip"
import { InternshipsFinalCtaSection } from "@/components/internships/internships-final-cta-section"

export type InternshipsSearch = {
  search?: string
  category?: string
  q?: string
}

export const Route = createFileRoute("/internships/")({
  validateSearch: (search: Record<string, unknown>): InternshipsSearch => {
    return {
      search: typeof search.search === "string" ? search.search : typeof search.q === "string" ? search.q : undefined,
      category: typeof search.category === "string" ? search.category : undefined,
    }
  },
  head: () => ({
    meta: createMetaTags({
      title: "Internship Directory & Cohort Opportunities",
      description:
        "Discover supervised internship tracks across digital practice, business operations, design, communications, and workplace strategy. Build verifiable proof of work with QR credentials.",
      path: "/internships",
    }),
  }),
  loader: async () => {
    const { internships } = await getHomeProgramsFn({ data: { type: "INTERNSHIP" } })
    return { internships }
  },
  component: InternshipsPage,
})

function InternshipsPage() {
  const { internships } = Route.useLoaderData()
  const searchParams = Route.useSearch()

  return (
    <div className="w-full flex flex-col bg-[#faf8f5]">
      {/* 01. EDITORIAL HERO SECTION */}
      <InternshipsHeroSection />

      {/* 02. INTERACTIVE SEARCH & CATEGORY CATALOG */}
      <InternshipsCatalog
        initialInternships={internships}
        initialSearch={searchParams.search}
        initialCategory={searchParams.category}
      />

      {/* 03. SUPERVISED METHODOLOGY ASSURANCE STRIP */}
      <InternshipsAssuranceStrip />

      {/* 04. CINEMATIC CONVERSION LAUNCHPAD */}
      <InternshipsFinalCtaSection />
    </div>
  )
}
