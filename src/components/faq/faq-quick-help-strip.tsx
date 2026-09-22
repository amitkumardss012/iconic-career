import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  UsersIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  ArrowRightIcon,
} from "lucide-react"

export function FaqQuickHelpStrip() {
  return (
    <section className="relative w-full bg-[#f4ede2]/60 py-16 sm:py-20 border-t border-b border-[#e2dcce]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-3">
              <ShieldCheckIcon className="size-3.5 text-[#d4af37]" />
              <span>DIRECT ASSISTANCE CHANNELS</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-[#14233c]">
              Need Specialized Support? <br />
              <span className="italic text-[#a07142]">Connect with Our Departments</span>
            </h2>
          </div>
          <p className="text-sm text-[#596579] max-w-md font-normal leading-relaxed">
            Our coordination teams are structured by domain to provide prompt, documented answers to students, hiring managers, and university administrators.
          </p>
        </div>

        {/* 3 Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <UsersIcon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  CHANNEL 01
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                Candidate Admissions & Advising
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Questions about eligibility, cohort start dates, curriculum paths, and duration options.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de]">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#14233c] group-hover:text-[#a07142] transition-colors"
              >
                <span>Contact Admissions</span>
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <ShieldCheckIcon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  CHANNEL 02
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                Employer Credential Verification
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Instant authenticity audits for hiring teams and background screening partners via our public ledger.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de]">
              <Link
                to="/verify"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#14233c] group-hover:text-[#a07142] transition-colors"
              >
                <span>Open Verification Console</span>
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <GraduationCapIcon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  CHANNEL 03
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                University & Academic Liaison
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Institutional partnerships, academic credits, MoU agreements, and departmental cohort tracking.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de]">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#14233c] group-hover:text-[#a07142] transition-colors"
              >
                <span>Inquire for Institution</span>
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
