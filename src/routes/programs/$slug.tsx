import { createFileRoute, notFound } from "@tanstack/react-router"
import { getStaticProgramBySlug, getStaticInternshipForProgram } from "@/lib/data/static-content"
import { createMetaTags } from "@/lib/seo"
import { ProgramDetailHero } from "@/components/programs/detail/program-detail-hero"
import { ProgramDetailContent } from "@/components/programs/detail/program-detail-content"
import { ProgramDetailFinalCta } from "@/components/programs/detail/program-detail-final-cta"
import type { getProgramBySlug } from "#/lib/services/content"

const PROGRAM_PRICING: Record<
  string,
  {
    price: string
    originalPrice: string
    discount: string
    rating: string
    reviewsCount: string
    cohortDate: string
  }
> = {
  "digital-practice": {
    price: "₹2,999",
    originalPrice: "₹5,499",
    discount: "45% OFF",
    rating: "4.9",
    reviewsCount: "1,240",
    cohortDate: "Oct 15",
  },
  "business-operations": {
    price: "₹2,499",
    originalPrice: "₹4,999",
    discount: "50% OFF",
    rating: "4.8",
    reviewsCount: "980",
    cohortDate: "Oct 15",
  },
  "design-studio": {
    price: "₹3,499",
    originalPrice: "₹6,499",
    discount: "46% OFF",
    rating: "4.9",
    reviewsCount: "850",
    cohortDate: "Oct 20",
  },
  "communications-practice": {
    price: "₹2,499",
    originalPrice: "₹4,499",
    discount: "44% OFF",
    rating: "4.8",
    reviewsCount: "710",
    cohortDate: "Oct 20",
  },
  "workplace-practice": {
    price: "₹1,999",
    originalPrice: "₹3,999",
    discount: "50% OFF",
    rating: "4.7",
    reviewsCount: "1,420",
    cohortDate: "Oct 15",
  },
  "research-support": {
    price: "₹2,999",
    originalPrice: "₹5,499",
    discount: "45% OFF",
    rating: "4.8",
    reviewsCount: "630",
    cohortDate: "Oct 25",
  },
}

export const Route = createFileRoute("/programs/$slug")({
  loader: ({ params }) => {
    const program = getStaticProgramBySlug(params.slug)
    if (!program) {
      throw notFound()
    }
    const relatedInternship = getStaticInternshipForProgram(program.slug)
    const fallbackPricing = PROGRAM_PRICING[program.slug] || {
      price: "₹2,499",
      originalPrice: "₹4,999",
      discount: "50% OFF",
      rating: "4.8",
      reviewsCount: "900",
      cohortDate: "Oct 15",
    }
    const pricing = {
      price: program.formattedPrice || fallbackPricing.price,
      originalPrice: program.formattedOriginalPrice || fallbackPricing.originalPrice,
      discount: program.discountPercentage || fallbackPricing.discount,
      rating: program.rating || fallbackPricing.rating,
      reviewsCount: program.reviewsCount || fallbackPricing.reviewsCount,
      cohortDate: program.cohortDate || fallbackPricing.cohortDate,
    }
    return { program, relatedInternship, pricing }
  },
  head: ({ loaderData }: { loaderData?: { program?: { name: string; summary: string; slug: string } } }) => {
    if (!loaderData?.program) {
      return {
        meta: createMetaTags({
          title: "Program Not Found",
          path: "/programs",
        }),
      }
    }
    return {
      meta: createMetaTags({
        title: `${loaderData.program.name} Program Syllabus & Curriculum`,
        description: loaderData.program.summary,
        path: `/programs/${loaderData.program.slug}`,
      }),
    }
  },
  component: ProgramDetailPage,
})

function ProgramDetailPage() {
  const data = Route.useLoaderData()
  const { program, relatedInternship, pricing } = data as {
    program: NonNullable<Awaited<ReturnType<typeof getProgramBySlug>>>
    relatedInternship?: Awaited<ReturnType<typeof getStaticInternshipForProgram>>
    pricing: {
      price: string
      originalPrice: string
      discount: string
      rating: string
      reviewsCount: string
      cohortDate: string
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 01. PROGRAM HERO & ENROLLMENT CONSOLE */}
      <ProgramDetailHero
        program={program}
        relatedInternship={relatedInternship}
        pricing={pricing}
      />

      {/* 02. IN-DEPTH SYLLABUS, COMPETENCIES & FAQS */}
      <ProgramDetailContent program={program} />

      {/* 03. FINAL CONVERSION LAUNCHPAD */}
      <ProgramDetailFinalCta program={program} />
    </div>
  )
}
