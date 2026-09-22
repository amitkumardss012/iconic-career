import React from "react"
import { Link } from "@tanstack/react-router"
import type { Program, Internship } from "@/lib/types"
import {
  ClockIcon,
  AwardIcon,
  StarIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  SparklesIcon,
  UsersIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from "lucide-react"

interface ProgramDetailHeroProps {
  program: Program
  relatedInternship?: Internship
  pricing: {
    price: string
    originalPrice: string
    discount: string
    rating: string
    reviewsCount: string
    cohortDate: string
  }
}

export function ProgramDetailHero({
  program,
  relatedInternship,
  pricing,
}: ProgramDetailHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pt-8 pb-14 md:pt-12 md:pb-20 border-b border-[#e8dfd1]">
      {/* Background Architectural Dot Texture & Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#c5b8a5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-[#a07142]/10 via-[#c5a880]/5 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-mono">
          <Link
            to="/programs"
            className="inline-flex items-center gap-1.5 text-[#64748b] hover:text-[#14233c] transition-colors"
          >
            <ArrowLeftIcon className="size-3 text-[#a07142]" />
            <span>All Programs</span>
          </Link>
          <span className="text-[#d8cbb8]">/</span>
          <span className="text-[#a07142] font-semibold uppercase tracking-wider">
            {program.categoryLabel}
          </span>
          <span className="text-[#d8cbb8]">/</span>
          <span className="text-[#14233c] font-semibold">{program.name}</span>
        </div>

        {/* Hero Grid: Main Information (Left) + Sticky Enrollment Console (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Narrative, Accreditations & Key Value */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Illuminated Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8cbb8] bg-white/90 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] shadow-2xs backdrop-blur-md">
              <SparklesIcon className="size-3 text-[#a07142]" />
              <span>Academic Curriculum Track • Supervised Pathway</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#14233c] leading-[1.12]">
              {program.name}
              <br />
              <span className="italic text-[#a07142] font-normal">
                Curriculum Syllabus
              </span>
            </h1>

            {/* Summary */}
            <p className="text-base sm:text-lg text-[#556477] leading-relaxed font-light">
              {program.summary}
            </p>

            {/* Trust Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#e8dfd1] text-xs">
              <div className="flex items-center gap-2 text-[#14233c]">
                <ClockIcon className="size-4 text-[#a07142] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#64748b] block font-mono uppercase">Duration</span>
                  <span className="font-semibold">{program.defaultDuration || "8 Weeks"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#14233c]">
                <StarIcon className="size-4 fill-amber-400 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#64748b] block font-mono uppercase">Evaluator Score</span>
                  <span className="font-semibold">{pricing.rating} ({pricing.reviewsCount})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#14233c]">
                <AwardIcon className="size-4 text-[#a07142] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#64748b] block font-mono uppercase">Certification</span>
                  <span className="font-semibold">Public QR Ledger</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#14233c]">
                <CalendarIcon className="size-4 text-[#a07142] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#64748b] block font-mono uppercase">Cohort Launch</span>
                  <span className="font-semibold">{pricing.cohortDate}</span>
                </div>
              </div>
            </div>

            {/* Assurance Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#556477]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                <span>Verified industry mentor review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                <span>Zero hidden enrollment fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                <span>Linked internship track included</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Enrollment Console Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#d6cbba] bg-white p-6 sm:p-7 shadow-[0_12px_36px_rgba(20,35,60,0.06)] flex flex-col gap-5">
              {/* Media Preview with Vignette */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#14233c]">
                <img
                  src={program.image.src}
                  alt={program.image.alt} loading="eager"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726]/80 via-transparent to-black/20" />
                
                {/* Floating Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center rounded-md bg-[#0e1726]/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                    {program.categoryLabel}
                  </span>
                </div>

                {/* Floating Batch Status */}
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-md border border-white/10">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Next Batch: {pricing.cohortDate}</span>
                  </span>
                </div>
              </div>

              {/* Transparent Pricing Console */}
              <div className="flex items-baseline justify-between border-b border-[#f0e8dc] pb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-4xl font-normal text-[#14233c]">
                    {pricing.price}
                  </span>
                  <span className="text-sm text-[#8a99ad] line-through font-mono">
                    {pricing.originalPrice}
                  </span>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#faf0e6] px-2.5 py-1 text-xs font-bold text-[#a07142] border border-[#e8d5c4]">
                  {pricing.discount}
                </span>
              </div>

              {/* Duration Options Selector Preview */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-semibold text-[#14233c] uppercase tracking-wider">
                  Select Commitment Option
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {program.durationOptions.map((opt, idx) => (
                    <div
                      key={opt}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        idx === 1
                          ? "border-[#a07142] bg-[#faf8f5] text-[#14233c] font-semibold ring-1 ring-[#a07142]"
                          : "border-[#e8dfd1] bg-white text-[#556477]"
                      }`}
                    >
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-1">
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center h-12 px-6 bg-[#14233c] hover:bg-[#a07142] text-white font-medium rounded-xl shadow-md transition-colors gap-2 text-sm"
                >
                  <span>Enroll in Program</span>
                  <ArrowRightIcon className="size-4" />
                </Link>

                {relatedInternship && (
                  <Link
                    to="/internships/$slug" params={{ slug: relatedInternship.slug }}
                    className="w-full inline-flex items-center justify-center h-11 px-5 border border-[#d8cbb8] bg-white hover:bg-[#faf8f5] text-[#14233c] font-medium rounded-xl transition-colors gap-2 text-xs"
                  >
                    <BriefcaseIcon className="size-3.5 text-[#a07142]" />
                    <span>View Linked Internship Track</span>
                  </Link>
                )}
              </div>

              {/* Mentorship & Guarantee Note */}
              <div className="rounded-xl bg-[#faf8f5] p-3.5 text-xs text-[#556477] border border-[#e8dfd1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="size-4 text-[#a07142]" />
                  <span>Cohort Mentorship: 1:10 Ratio</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#a07142] font-semibold">
                  <ShieldCheckIcon className="size-3" />
                  <span>100% Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
