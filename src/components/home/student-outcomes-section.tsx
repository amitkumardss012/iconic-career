import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  AwardIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  SparklesIcon,
  FileCheck2Icon,
  QrCodeIcon,
  ArrowRightIcon,
  UserCheckIcon,
  FingerprintIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { studentOutcomes } from "@/lib/data/journey"

export function StudentOutcomesSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28">
      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10 sm:gap-14">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#e2dcce]/90">
          <div className="max-w-2xl">
            {/* Illuminated Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>DELIVERABLES & STANDING</span>
              <span className="h-2 w-px bg-[#d6cbba]" />
              <span className="text-[10px] text-[#64748b] tracking-normal font-medium">
                Official Graduate Artifacts
              </span>
            </div>

            {/* Display Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
              What You Graduate With. <br />
              <span className="italic text-[#a07142]">A Portfolio Built for Scrutiny.</span>
            </h2>

            {/* Subparagraph */}
            <p className="text-sm text-[#596579] leading-relaxed max-w-xl mt-3.5 font-normal">
              A comprehensive dossier of tangible outcomes designed to document real workplace competencies, verify supervision, and provide unquestioned standing.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
            <span className="text-xs font-mono font-semibold text-[#8e653e] uppercase">
              IMMUTABLE ARTEFACTS • PUBLIC REGISTRY
            </span>
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#14233c] hover:text-[#a07142] transition-colors group"
            >
              <span>Learn About Verification Standards</span>
              <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Executive Deliverables Vault: Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Bento Item 1: Large Flagship Card - Verifiable Dual Certificate (7 Cols) */}
          <div className="md:col-span-7 rounded-2xl border-2 border-[#d4af37]/40 bg-[#0e1f33] text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            {/* Ambient Gold Radial Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f]">
                    <AwardIcon className="size-5" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#f5d77f]">
                    PRIMARY DELIVERABLE
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  QR VERIFIED
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {studentOutcomes.primary.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mt-3 max-w-xl">
                {studentOutcomes.primary.detail}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <QrCodeIcon className="size-5 text-[#d4af37]" />
                <span>Includes Unique Certificate ID & Anti-Tamper Checksum</span>
              </div>

              <Link
                to="/verify"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f5d77f] hover:underline"
              >
                <span>Verify Credential Live</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          </div>

          {/* Bento Item 2: Official Student Profile & Registry Account (5 Cols) */}
          <div className="md:col-span-5 rounded-2xl border border-[#e2dcce] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-[#a07142]/60 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-9 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center">
                  <FingerprintIcon className="size-5" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#8e653e]">
                  OFFICIAL IDENTITY
                </span>
              </div>

              <h4 className="font-heading text-xl font-bold text-[#14233c]">
                Permanent Student Record
              </h4>

              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed mt-2">
                A permanent account housing your enrollment dates, supervisor checkpoint logs, and verified completion credentials accessible anytime.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0eae1] flex items-center justify-between text-xs text-[#8e653e] font-semibold">
              <span>Unique Student ID Assigned</span>
              <CheckCircle2Icon className="size-4" />
            </div>
          </div>

          {/* Bento Item 3: Supervised Task Dossier (4 Cols) */}
          <div className="md:col-span-4 rounded-2xl border border-[#e2dcce] bg-white p-6 flex flex-col justify-between shadow-sm hover:border-[#a07142]/60 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center">
                  <FileCheck2Icon className="size-4" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#8e653e]">
                  DOCUMENTATION
                </span>
              </div>

              <h4 className="font-heading text-lg font-bold text-[#14233c]">
                Supervised Task Dossier
              </h4>

              <p className="text-xs text-[#596579] leading-relaxed mt-1.5">
                Weekly brief records, supervisor feedback notes, and task trackers kept on permanent record.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#f0eae1] text-[11px] text-[#64748b] font-mono">
              Written proof of active work
            </div>
          </div>

          {/* Bento Item 4: Verified Completion Status & Extension (4 Cols) */}
          <div className="md:col-span-4 rounded-2xl border border-[#e2dcce] bg-white p-6 flex flex-col justify-between shadow-sm hover:border-[#a07142]/60 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center">
                  <UserCheckIcon className="size-4" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#8e653e]">
                  STATUS VERIFICATION
                </span>
              </div>

              <h4 className="font-heading text-lg font-bold text-[#14233c]">
                Verified Completion State
              </h4>

              <p className="text-xs text-[#596579] leading-relaxed mt-1.5">
                Official recording of fulfilled duration (4, 8, or 12 weeks) with extension standing if approved.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#f0eae1] text-[11px] text-[#64748b] font-mono">
              Recorded on student registry
            </div>
          </div>

          {/* Bento Item 5: Third-Party Public Inspection (4 Cols) */}
          <div className="md:col-span-4 rounded-2xl border border-[#e2dcce] bg-white p-6 flex flex-col justify-between shadow-sm hover:border-[#a07142]/60 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#8e653e]">
                  PUBLIC AUDIT
                </span>
              </div>

              <h4 className="font-heading text-lg font-bold text-[#14233c]">
                Zero-Login Inspection
              </h4>

              <p className="text-xs text-[#596579] leading-relaxed mt-1.5">
                Employers and colleges verify documents directly on the public registry using ID or QR scan.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#f0eae1] flex items-center justify-between text-[11px] text-[#14233c] font-semibold">
              <Link to="/verify" className="hover:underline flex items-center gap-1">
                <span>Check Registry</span>
                <ExternalLinkIcon className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
