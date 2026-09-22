import * as React from "react"
import {
  SparklesIcon,
  MailIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
} from "lucide-react"

export function ContactHeroSection() {
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
            <span>OFFICIAL COMMUNICATION DIRECTORY • ADMISSIONS & SUPPORT</span>
          </div>

          {/* Two-Tone Display Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
            Speak Directly With Our Team. <br />
            <span className="italic text-[#a07142]">Responsive Support for Every Candidate.</span>
          </h1>

          {/* Subparagraph */}
          <p className="text-sm sm:text-base text-[#596579] leading-relaxed max-w-2xl mt-4 font-normal">
            Whether you are a prospective intern exploring curriculum tracks, an academic institution discussing cohort integration, or an evaluator requiring credential authentication, our coordination desk is ready to assist.
          </p>
        </div>

        {/* 4 Reassurance Metric Capsules */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto w-full pt-4 border-t border-[#e2dcce]/80">
          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <MailIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">Email Desk</span>
              <span className="text-[10.5px] text-[#64748b]">Direct Admissions Mail</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <ClockIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">Mon–Fri Desk</span>
              <span className="text-[10.5px] text-[#64748b]">09:30 – 18:30 IST</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <CheckCircle2Icon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">Priority Response</span>
              <span className="text-[10.5px] text-[#64748b]">Within 1 Business Day</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2dcce] bg-white/80 p-3.5 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="size-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#14233c] block">Public Registry</span>
              <span className="text-[10.5px] text-[#64748b]">Self-Service /verify</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
