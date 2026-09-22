import { createFileRoute, notFound } from "@tanstack/react-router"
import {
  getStaticInternshipBySlug,
  getStaticProgramBySlug,
} from "@/lib/data/static-content"
import { createMetaTags } from "@/lib/seo"
import { InternshipDetailHero } from "@/components/internships/detail/internship-detail-hero"
import { InternshipDetailContent } from "@/components/internships/detail/internship-detail-content"
import { InternshipDetailFinalCta } from "@/components/internships/detail/internship-detail-final-cta"
import type { getInternshipBySlug, getProgramBySlug } from "#/lib/services/content"

const INTERNSHIP_PRICING: Record<
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
  "digital-practice-internship": {
    price: "₹2,999",
    originalPrice: "₹5,499",
    discount: "45% OFF",
    rating: "4.9",
    reviewsCount: "1,240",
    cohortDate: "Oct 15",
  },
  "business-operations-internship": {
    price: "₹1,999",
    originalPrice: "₹3,999",
    discount: "50% OFF",
    rating: "4.8",
    reviewsCount: "980",
    cohortDate: "Oct 15",
  },
  "design-studio-internship": {
    price: "₹2,499",
    originalPrice: "₹4,999",
    discount: "50% OFF",
    rating: "4.9",
    reviewsCount: "850",
    cohortDate: "Oct 20",
  },
  "communications-internship": {
    price: "₹1,999",
    originalPrice: "₹3,499",
    discount: "43% OFF",
    rating: "4.8",
    reviewsCount: "710",
    cohortDate: "Oct 20",
  },
  "workplace-practice-internship": {
    price: "₹1,499",
    originalPrice: "₹2,999",
    discount: "50% OFF",
    rating: "4.7",
    reviewsCount: "1,420",
    cohortDate: "Oct 15",
  },
  "research-support-internship": {
    price: "₹2,199",
    originalPrice: "₹4,299",
    discount: "49% OFF",
    rating: "4.8",
    reviewsCount: "630",
    cohortDate: "Oct 25",
  },
}

export const Route = createFileRoute("/internships/$slug")({
  loader: ({ params }) => {
    const internship = getStaticInternshipBySlug(params.slug)
    if (!internship) {
      throw notFound()
    }
    const relatedProgram = getStaticProgramBySlug(internship.programSlug)
    const fallbackPricing = INTERNSHIP_PRICING[internship.slug] || {
      price: "₹1,999",
      originalPrice: "₹3,999",
      discount: "50% OFF",
      rating: "4.8",
      reviewsCount: "900",
      cohortDate: "Oct 15",
    }
    const pricing = {
      price: internship.formattedPrice || fallbackPricing.price,
      originalPrice: internship.formattedOriginalPrice || fallbackPricing.originalPrice,
      discount: internship.discountPercentage || fallbackPricing.discount,
      rating: internship.rating || fallbackPricing.rating,
      reviewsCount: internship.reviewsCount || fallbackPricing.reviewsCount,
      cohortDate: internship.cohortDate || fallbackPricing.cohortDate,
    }
    return { internship, relatedProgram, pricing }
  },
  head: ({ loaderData }: { loaderData?: { internship?: { name: string; summary: string; slug: string } } }) => {
    if (!loaderData?.internship) {
      return {
        meta: createMetaTags({
          title: "Internship Not Found",
          path: "/internships",
        }),
      }
    }
    return {
      meta: createMetaTags({
        title: `${loaderData.internship.name} Track & Supervision`,
        description: loaderData.internship.summary,
        path: `/internships/${loaderData.internship.slug}`,
      }),
    }
  },
  component: InternshipDetailPage,
})

function InternshipDetailPage() {
  const data = Route.useLoaderData()
  const { internship, relatedProgram, pricing } = data as {
    internship: NonNullable<Awaited<ReturnType<typeof getInternshipBySlug>>>
    relatedProgram?: Awaited<ReturnType<typeof getProgramBySlug>>
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
      {/* 01. INTERNSHIP HERO & STICKY APPLICATION CONSOLE */}
      <InternshipDetailHero
        internship={internship}
        relatedProgram={relatedProgram}
        pricing={pricing}
      />

      {/* 02. PRACTICE METHODOLOGY, MILESTONES & COMPLETION PROTOCOL */}
      <InternshipDetailContent internship={internship} />

      {/* 03. FINAL CONVERSION LAUNCHPAD */}
      <InternshipDetailFinalCta internship={internship} />
    </div>
  )
}
