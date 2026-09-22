import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  AwardIcon,
  CheckCircle2Icon,
} from "lucide-react"

export function FinalCtaSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a1628] text-white py-20 sm:py-24 lg:py-32">
      {/* Ambient Radial Lighting & Gold Flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-radial from-[#d4af37]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Decorative Corner Borders */}
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 z-10">
        <div className="relative rounded-3xl border-2 border-[#d4af37]/30 bg-[#0e1f33]/90 p-8 sm:p-14 lg:p-20 text-center shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Subtle Golden Geometry Accents */}
          <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-[#d4af37]" />
          <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-[#d4af37]" />
          <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-[#d4af37]" />
          <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-[#d4af37]" />

          <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center gap-6">
            {/* Illuminated Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5d77f] shadow-sm backdrop-blur-xs">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>APPLICATIONS OPEN FOR AUTUMN COHORTS</span>
            </div>

            {/* Display Headline */}
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.06]">
              Your Career Story Starts Here. <br />
              <span className="italic text-[#f5d77f]">Begin With Verifiable Standing.</span>
            </h2>

            {/* Subparagraph */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Join thousands of students from leading universities across India gaining structured internship exposure, weekly supervisor reviews, and tamper-evident credentials recognized by employers.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#d4af37] hover:bg-[#c59b63] text-[#0a1628] font-bold px-7 py-3.5 text-sm transition-all shadow-lg hover:shadow-xl gap-2 group"
              >
                <span>Apply for Cohort Today</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/programs"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 text-sm transition-all backdrop-blur-xs"
              >
                Browse All 20+ Tracks
              </Link>
            </div>

            {/* Live Metrics Trust Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-6 border-t border-white/15 w-full text-center">
              <div className="flex flex-col items-center">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-white">50,000+</span>
                <span className="text-xs text-slate-400 mt-0.5">Students Empowered</span>
              </div>
              <div className="flex flex-col items-center sm:border-x sm:border-white/15">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-[#f5d77f]">100%</span>
                <span className="text-xs text-slate-400 mt-0.5">Online & Mentored</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-white">Verified</span>
                <span className="text-xs text-slate-400 mt-0.5">Public Registry Lookup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
