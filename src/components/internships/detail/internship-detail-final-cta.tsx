import React from "react"
import { Link } from "@tanstack/react-router"
import type { Internship } from "@/lib/types"
import { ArrowRightIcon, SparklesIcon, CalendarIcon, AwardIcon, ShieldCheckIcon } from "lucide-react"

interface InternshipDetailFinalCtaProps {
  internship: Internship
}

export function InternshipDetailFinalCta({ internship }: InternshipDetailFinalCtaProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e1726] to-[#14233c] text-white py-20 md:py-28">
      {/* Background Ambient Dot Texture & Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(#c5a880 0.75px, transparent 0.75px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-radial from-[#a07142]/20 via-[#c5a880]/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c5a880]/30 bg-[#1c2e4a]/80 px-4 py-1.5 shadow-sm backdrop-blur-md mb-6">
            <SparklesIcon className="size-3.5 text-[#c5a880]" />
            <span className="text-[11px] font-mono tracking-widest text-[#e8dfd1] uppercase font-semibold">
              Internship Cohort Applications Open
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
            Ready to Begin the <br />
            <span className="italic text-[#c5a880]">{internship.name}?</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#cbd5e1] leading-relaxed max-w-2xl font-light">
            Reserve your supervised slot, set your commitment duration, and receive your initial briefing pack and mentor introduction.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center h-13 px-8 bg-[#a07142] hover:bg-[#b88552] text-white font-medium rounded-xl shadow-lg shadow-[#a07142]/20 gap-2 transition-transform duration-200 hover:-translate-y-0.5 text-sm"
            >
              <span>Apply for {internship.name}</span>
              <ArrowRightIcon className="size-4" />
            </Link>

            <Link
              to="/internships"
              className="w-full sm:w-auto inline-flex items-center justify-center h-13 px-8 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl backdrop-blur-sm transition-colors text-sm"
            >
              <span>View Other Internship Tracks</span>
            </Link>
          </div>

          {/* Assurance Badges */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-xs text-[#cbd5e1]">
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="size-4 text-[#c5a880]" />
              <span>Cohorts Start 1st Monday</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <AwardIcon className="size-4 text-[#c5a880]" />
              <span>Official Verification Seal</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheckIcon className="size-4 text-[#c5a880]" />
              <span>Weekly Mentor Briefings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
