import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  SparklesIcon,
  BriefcaseIcon,
  ClockIcon,
  AwardIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "lucide-react"

export function InternshipsHeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] pt-14 sm:pt-20 pb-12 sm:pb-16 border-b border-[#ede7de]">
      {/* Mesh Grid Pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-0 right-1/4 w-[650px] h-[320px] bg-radial from-[#f3e7d5]/50 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="container-site relative flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            {/* Illuminated Eyebrow Capsule */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>INTERNSHIP DIRECTORY & ROLES DISCOVERY</span>
              <span className="h-2 w-px bg-[#d6cbba]" />
              <span className="text-[10px] text-[#64748b] tracking-normal font-medium">
                6 Active Tracks
              </span>
            </div>

            {/* Two-Tone Display Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
              Supervised Internships. <br />
              <span className="italic text-[#a07142]">Built for Documented Proof of Work.</span>
            </h1>

            {/* Editorial Subparagraph */}
            <p className="text-sm sm:text-base text-[#596579] leading-relaxed max-w-2xl mt-4 font-normal">
              Select a structured internship track designed to build hands-on competency, record weekly supervisor-reviewed milestones, and grant official QR-verified credentialing upon completion.
            </p>
          </div>

          {/* Action CTA & Quick Assurance Note */}
          <div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-end shrink-0">
            <div className="text-left lg:text-right hidden sm:block">
              <div className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-[#7388a1]">
                SUPERVISED REVIEWS • REAL BRIEFS • QR LEDGER
              </div>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-2xs transition-all group"
            >
              <span>Apply for Internship Cohort</span>
              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 4 Quick Stat Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#e2dcce]/80">
          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <BriefcaseIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">6 Disciplines</span>
              <span className="text-[10.5px] text-[#64748b]">Tech, Ops, Design, Comms</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <ClockIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">4, 8 or 12 Weeks</span>
              <span className="text-[10.5px] text-[#64748b]">Flexible Duration Options</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <AwardIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">QR Verified</span>
              <span className="text-[10.5px] text-[#64748b]">Tamper-Proof Audit Record</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">From ₹1,499</span>
              <span className="text-[10.5px] text-[#64748b]">All-Inclusive + Paired Training</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
