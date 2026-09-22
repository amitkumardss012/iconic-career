import * as React from "react"
import {
  UsersIcon,
  ShieldCheckIcon,
  AwardIcon,
  CheckCircle2Icon,
} from "lucide-react"

export function RegisterAssuranceStrip() {
  return (
    <section className="relative w-full bg-[#f4ede2]/60 py-16 sm:py-20 border-t border-b border-[#e2dcce]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-3">
              <ShieldCheckIcon className="size-3.5 text-[#d4af37]" />
              <span>CANDIDATE ADMISSIONS GUARANTEE</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-[#14233c]">
              Institutional Protections & <br />
              <span className="italic text-[#a07142]">Supervised Completion</span>
            </h2>
          </div>
          <p className="text-sm text-[#596579] max-w-md font-normal leading-relaxed">
            Every candidate registration connects you to an authenticated internship cohort with documented supervisor reviews and guaranteed QR credentialing.
          </p>
        </div>

        {/* 3 Confidence Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <UsersIcon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  PILLAR 01
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                Assigned Industry Reviewer
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                You are paired with a designated domain mentor who oversees your submissions and provides written feedback against weekly briefs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de] text-[11px] font-mono text-[#8e653e]">
              1:1 Checkpoints & Evaluation
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <CheckCircle2Icon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  PILLAR 02
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                Documented Proof of Work
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Build an archived dossier of code repositories, trackers, and design artifacts that prove practical competence to hiring teams.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de] text-[11px] font-mono text-[#8e653e]">
              Recruiter-Ready Deliverables
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <AwardIcon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  PILLAR 03
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                Public QR Credential
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Graduates receive an immutable digital certificate with a unique Certificate ID auditable by employers on the public /verify portal.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de] text-[11px] font-mono text-[#8e653e]">
              Instant Verification Record
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
