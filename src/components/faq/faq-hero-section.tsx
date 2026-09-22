import * as React from "react"
import {
  SparklesIcon,
  SearchIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  AwardIcon,
} from "lucide-react"

export function FaqHeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] pt-14 sm:pt-20 pb-12 sm:pb-16 border-b border-[#ede7de]">
      {/* Background Architectural Mesh */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-0 right-1/4 w-[650px] h-[320px] bg-radial from-[#f3e7d5]/50 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-8 sm:gap-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Illuminated Capsule Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
            <SparklesIcon className="size-3 text-[#d4af37]" />
            <span>KNOWLEDGEBASE & HELP DIRECTORY • 8 CORE CATEGORIES</span>
          </div>

          {/* Two-Tone Display Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
            Frequently Asked Questions. <br />
            <span className="italic text-[#a07142]">Clear Guidance for Every Milestone.</span>
          </h1>

          {/* Subparagraph */}
          <p className="text-sm sm:text-base text-[#596579] leading-relaxed max-w-2xl mt-4 font-normal">
            Clear, documented answers regarding candidate registration, supervised internship hours, payment verification, and public QR credential audits.
          </p>
        </div>

        {/* 4 Reassurance Metric Capsules */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto w-full pt-4 border-t border-[#e2dcce]/80">
          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <SearchIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">Keyword Search</span>
              <span className="text-[10.5px] text-[#64748b]">Instant Live Filtering</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <HelpCircleIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">8 Core Topics</span>
              <span className="text-[10.5px] text-[#64748b]">Admissions to Verification</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <ClockIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">Admissions Help</span>
              <span className="text-[10.5px] text-[#64748b]">Official Coordinator Desk</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <AwardIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">Public Registry</span>
              <span className="text-[10.5px] text-[#64748b]">QR Credential Lookup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
