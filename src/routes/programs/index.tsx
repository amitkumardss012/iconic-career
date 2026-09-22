import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { getHomeProgramsFn } from "@/lib/server/programs"
import { ProgramsHeroSection } from "@/components/programs/programs-hero-section"
import { ProgramsCatalog } from "@/components/programs/programs-catalog"
import { ProgramsAssuranceStrip } from "@/components/programs/programs-assurance-strip"
import { ProgramsFinalCtaSection } from "@/components/programs/programs-final-cta-section"

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: createMetaTags({
      title: "Programs Catalog | The Iconic Career",
      description:
        "Explore our structured curriculum programs pairing academic instruction with supervised company internship tracks.",
      path: "/programs",
    }),
  }),
  loader: async () => {
    const { courses } = await getHomeProgramsFn({ data: { type: "COURSE" } })
    return { programs: courses }
  },
  component: ProgramsPage,
})

function ProgramsPage() {
  const { programs } = Route.useLoaderData()

  return (
    <div className="flex flex-col">
      {/* 01. PROGRAMS HERO */}
      <ProgramsHeroSection />

      {/* 02. DISCOVERY TERMINAL & CATALOG GRID */}
      <ProgramsCatalog initialPrograms={programs} />

      {/* 03. CURRICULUM ARCHITECTURE & ASSURANCE STRIP */}
      <ProgramsAssuranceStrip />

      {/* 04. FINAL CONVERSION LAUNCHPAD */}
      <ProgramsFinalCtaSection />
    </div>
  )
}
