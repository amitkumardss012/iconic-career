import React from "react"
import { Link } from "@tanstack/react-router"
import type { Internship, Program } from "@/lib/types"
import {
  ClockIcon,
  AwardIcon,
  StarIcon,
  BookOpenIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  SparklesIcon,
  UsersIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from "lucide-react"

interface InternshipDetailHeroProps {
  internship: Internship
  relatedProgram?: Program
  pricing: {
    price: string
    originalPrice: string
    discount: string
    rating: string
    reviewsCount: string
    cohortDate: string
  }
}

export function InternshipDetailHero({
  internship,
  relatedProgram,
  pricing,
}: InternshipDetailHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pt-8 pb-14 md:pt-12 md:pb-20 border-b border-[#e8dfd1]">
      {/* Background Architectural Dot Grid & Ambient Warm Lighting */}
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
            to="/internships"
            className="inline-flex items-center gap-1.5 text-[#64748b] hover:text-[#14233c] transition-colors"
          >
            <ArrowLeftIcon className="size-3 text-[#a07142]" />
            <span>All Internships</span>
          </Link>
          <span className="text-[#d8cbb8]">/</span>
          <span className="text-[#a07142] font-semibold uppercase tracking-wider">
            {internship.categoryLabel}
          </span>
          <span className="text-[#d8cbb8]">/</span>
          <span className="text-[#14233c] font-semibold">{internship.name}</span>
        </div>

        {/* Hero Grid: Narrative (Left) + Sticky Application Console (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Role Narrative, Accreditations & Key Value */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Illuminated Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8cbb8] bg-white/90 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] shadow-2xs backdrop-blur-md">
              <SparklesIcon className="size-3 text-[#a07142]" />
              <span>Supervised Industry Track • Applied Work Experience</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#14233c] leading-[1.12]">
              {internship.name}
              <br />
              <span className="italic text-[#a07142] font-normal">
                Supervised Practice Track
              </span>
            </h1>

            {/* Summary */}
            <p className="text-base sm:text-lg text-[#556477] leading-relaxed font-light">
              {internship.summary}
            </p>

            {/* Trust Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#e8dfd1] text-xs">
              <div className="flex items-center gap-2 text-[#14233c]">
                <ClockIcon className="size-4 text-[#a07142] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#64748b] block font-mono uppercase">Duration</span>
                  <span className="font-semibold">{internship.defaultDuration || "8 Weeks"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#14233c]">
                <StarIcon className="size-4 fill-amber-400 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#64748b] block font-mono uppercase">Intern Rating</span>
                  <span className="font-semibold">{pricing.rating} ({pricing.reviewsCount})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#14233c]">
                <AwardIcon className="size-4 text-[#a07142] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#64748b] block font-mono uppercase">Credential</span>
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
                <span>Weekly supervised project briefs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                <span>Documented task logs & review notes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-3.5 text-emerald-600" />
                <span>Official completion certificate included</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Application Console Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#d6cbba] bg-white p-6 sm:p-7 shadow-[0_12px_36px_rgba(20,35,60,0.06)] flex flex-col gap-5">
              {/* Media Preview with Vignette */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#14233c]">
                <img
                  src={internship.image.src}
                  alt={internship.image.alt} loading="eager"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726]/80 via-transparent to-black/20" />

                {/* Floating Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center rounded-md bg-[#0e1726]/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                    {internship.categoryLabel}
                  </span>
                </div>

                {/* Floating Live Batch Pulse */}
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
                  Select Internship Commitment
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {internship.durationOptions.map((opt, idx) => (
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
                  <span>Apply for Internship</span>
                  <ArrowRightIcon className="size-4" />
                </Link>

                {relatedProgram && (
                  <Link
                    to="/programs/$slug" params={{ slug: relatedProgram.slug }}
                    className="w-full inline-flex items-center justify-center h-11 px-5 border border-[#d8cbb8] bg-white hover:bg-[#faf8f5] text-[#14233c] font-medium rounded-xl transition-colors gap-2 text-xs"
                  >
                    <BookOpenIcon className="size-3.5 text-[#a07142]" />
                    <span>View Linked Academic Curriculum</span>
                  </Link>
                )}
              </div>

              {/* Supervisor & Cohort Details */}
              <div className="rounded-xl bg-[#faf8f5] p-3.5 text-xs text-[#556477] border border-[#e8dfd1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="size-4 text-[#a07142]" />
                  <span>Supervisor Ratio: 1:10</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#a07142] font-semibold">
                  <ShieldCheckIcon className="size-3" />
                  <span>Documented Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
