import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  SparklesIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  MailIcon,
} from "lucide-react"

export function FaqFinalCtaSection() {
  return (
    <section className="relative w-full py-20 sm:py-24 bg-[#faf8f5] overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-[#0e1726] px-6 py-14 sm:px-12 sm:py-18 lg:px-20 text-center shadow-[0_20px_50px_rgba(14,23,38,0.25)] border border-[#22334f]">
          {/* Subtle Golden Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-radial from-[#d4af37]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

          {/* Mesh Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-6">
            {/* Illuminated Eyebrow Capsule */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#19263e] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8c56c] shadow-xs">
              <SparklesIcon className="size-3.5 text-[#d4af37]" />
              <span>DIRECT INQUIRY DESK</span>
            </div>

            {/* Display Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-[1.12]">
              Still Have an <br />
              <span className="italic text-[#e8c56c]">Unanswered Question?</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed max-w-xl font-normal">
              Our admissions coordinators and domain supervisors are available to guide you through program parameters, payment verification, or internship onboarding.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#e5bd3d] hover:to-[#c99510] text-[#0e1726] px-6 py-3.5 text-sm font-bold shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all hover:scale-[1.02] group"
              >
                <MailIcon className="size-4" />
                <span>Contact Admissions Desk</span>
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/internships"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white px-5 py-3.5 text-sm font-semibold backdrop-blur-sm transition-all"
              >
                <span>Browse Internship Tracks</span>
              </Link>
            </div>

            {/* Reassurance Feature Strip */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-6 border-t border-white/10 text-xs text-[#cbd5e1]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                <span>Documented Email Response</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                <span>Supervisor Onboarding Support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                <span>Instant Registry Lookup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
