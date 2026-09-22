import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  AwardIcon,
  UsersIcon,
} from "lucide-react"

export function AboutHeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] pt-14 sm:pt-20 pb-16 sm:pb-24 border-b border-[#ede7de]">
      {/* Subtle Mesh Grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-radial from-[#f3e7d5]/50 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10 sm:gap-14">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
          <div className="max-w-3xl">
            {/* Illuminated Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>OUR IDENTITY & MISSION • EST. 2026</span>
              <span className="h-2 w-px bg-[#d6cbba]" />
              <span className="text-[10px] text-[#64748b] tracking-normal font-medium">
                Phase 1 Public Registry
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[62px] font-normal leading-[1.05] tracking-tight text-[#14233c]">
              Bridging Academic Theory. <br />
              <span className="italic text-[#a07142]">And Verifiable Standing.</span>
            </h1>

            {/* Subparagraph */}
            <p className="text-sm sm:text-base text-[#596579] leading-relaxed max-w-2xl mt-4 font-normal">
              The Iconic Career is an institutional internship and student management organization. We build structured curriculum programs that allow students to develop practical competency, document supervised hours, and graduate with tamper-evident credentials.
            </p>
          </div>

          {/* Quick Metrics Tag */}
          <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-end gap-3 shrink-0">
            <div className="hidden sm:block text-left lg:text-right">
              <div className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-[#7388a1]">
                ACADEMIC RIGOR • 1:1 SUPERVISION • ZERO HYPERBOLE
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-2xs transition-all group"
              >
                <span>Browse Programs</span>
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/verify"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#334155]/20 bg-white hover:bg-black/5 text-[#14233c] px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors"
              >
                <span>Verify Credential</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Panoramic Editorial Media Composition */}
        <div className="relative aspect-[21/9] sm:aspect-[24/10] w-full overflow-hidden rounded-2xl border-2 border-[#d6cbba] bg-[#0e1f33] shadow-xl group">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80"
            alt="Students collaborating around table in modern educational institute" loading="eager"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
          />

          {/* Dark Cinematic Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1f33]/90 via-[#0e1f33]/30 to-black/20 pointer-events-none" />

          {/* Floating Glassmorphic Pill Over Image (Bottom-Left) */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 max-w-md rounded-xl bg-[#0e2238]/90 border border-white/15 p-4 text-white shadow-2xl backdrop-blur-md hidden sm:block">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f]">
                <ShieldCheckIcon className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Documented Academic Standing
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Trusted by students from Delhi University, Amity, Chandigarh University, and UPES.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom-Right Live Metric Badge */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 flex items-center gap-2">
            <span className="rounded-lg bg-black/60 border border-white/15 px-3 py-1 text-xs font-mono font-bold text-amber-300 backdrop-blur-xs">
              50K+ CANDIDATES EMPOWERED
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
