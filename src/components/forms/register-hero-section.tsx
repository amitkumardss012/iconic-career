import * as React from "react"
import {
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  AwardIcon,
  CheckCircle2Icon,
} from "lucide-react"

export function RegisterHeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] pt-12 sm:pt-16 pb-8 sm:pb-12 border-b border-[#ede7de]">
      {/* Background Architectural Mesh */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-radial from-[#f3e7d5]/50 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-6 sm:gap-8">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Illuminated Capsule Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-3">
            <SparklesIcon className="size-3 text-[#d4af37]" />
            <span>CANDIDATE ENROLLMENT DIRECTORY • 5-STAGE PIPELINE</span>
          </div>

          {/* Two-Tone Display Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
            Begin Your Internship Journey. <br />
            <span className="italic text-[#a07142]">Documented Proof of Work Starts Here.</span>
          </h1>

          {/* Subparagraph */}
          <p className="text-sm sm:text-base text-[#596579] leading-relaxed max-w-2xl mt-3 font-normal">
            Follow the guided 5-step registration pipeline below. Your submission establishes your student profile, connects your academic training with supervised briefs, and assigns your dedicated reviewer.
          </p>
        </div>

        {/* 4 Reassurance Metric Capsules */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto w-full pt-4 border-t border-[#e2dcce]/80">
          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <CheckCircle2Icon className="size-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">Zero Setup Friction</span>
              <span className="text-[10px] text-[#64748b]">Instant Profile Creation</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <ClockIcon className="size-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">4, 8 or 12 Weeks</span>
              <span className="text-[10px] text-[#64748b]">Flexible Duration Options</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <AwardIcon className="size-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">QR Credential</span>
              <span className="text-[10px] text-[#64748b]">Public Registry Audit</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3 flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="size-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">From ₹1,499</span>
              <span className="text-[10px] text-[#64748b]">All-Inclusive Program Fee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
