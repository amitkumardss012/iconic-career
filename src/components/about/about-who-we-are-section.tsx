import * as React from "react"
import {
  SparklesIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  TrendingUpIcon,
  LayersIcon,
} from "lucide-react"

export function AboutWhoWeAreSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28 border-b border-[#ede7de]">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12">
        {/* Top Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
            <SparklesIcon className="size-3 text-[#d4af37]" />
            <span>WHO WE ARE • THE PROBLEM WE SOLVED</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
            A Dedicated Team for <br />
            <span className="italic text-[#a07142]">Structured Early-Career Growth.</span>
          </h2>
        </div>

        {/* Narrative Contrast: The Reality vs. The Iconic Career Benchmark */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: The Broken Reality (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-red-200 bg-red-50/40 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircleIcon className="size-5 shrink-0" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  The Broken Internship Reality
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-[#14233c]">
                Undefined Tasks, Zero Supervision & Unverifiable Stationery
              </h3>

              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Too many student internships lack structure. Candidates are given informal favors, isolated tasks without review, and emerge with generic certificates that hold zero credibility with recruiters or university evaluators.
              </p>
            </div>

            <div className="pt-4 border-t border-red-200/60 space-y-2 text-xs text-red-900/80">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-red-500" />
                <span>No recorded hours or sprint briefs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-red-500" />
                <span>Zero supervisor evaluations on file</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-red-500" />
                <span>Certificates cannot be checked online</span>
              </div>
            </div>
          </div>

          {/* Right: The Iconic Career Solution (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl border-2 border-[#d4af37]/50 bg-[#0e1f33] text-white p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-3.5 relative z-10">
              <div className="flex items-center gap-2 text-[#f5d77f]">
                <ShieldCheckIcon className="size-5 shrink-0 text-[#d4af37]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  The Iconic Career Standard
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Intentional Curriculums, Weekly Logs & Public Verification
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                We established The Iconic Career to set a clear, audited standard. Every participant enrolls in an industry-calibrated curriculum, receives weekly task briefs, works through scheduled checkpoints, and graduates with an institutional credential third parties can independently verify.
              </p>
            </div>

            {/* 3 Large Institutional Metric Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15 relative z-10">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 flex flex-col">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-[#f5d77f]">
                  100%
                </span>
                <span className="text-xs text-slate-300 mt-0.5 font-medium">
                  Verifiable Credentials
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Public QR & ID Registry
                </span>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 flex flex-col">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  4–12 Wks
                </span>
                <span className="text-xs text-slate-300 mt-0.5 font-medium">
                  Supervised Duration
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Recorded on student profile
                </span>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 flex flex-col">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-[#f5d77f]">
                  6 Disciplines
                </span>
                <span className="text-xs text-slate-300 mt-0.5 font-medium">
                  Production Tracks
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Tech, Ops, Design & More
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
