import * as React from "react"
import {
  CompassIcon,
  ShieldCheckIcon,
  AwardIcon,
  FileCheckIcon,
  UserCheck2Icon,
} from "lucide-react"

export function ProgramsAssuranceStrip() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-14 sm:py-16 border-y border-[#ede7de]">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-[#d6cbba] bg-white p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#ede7de]">
            {/* Pillar 01 */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:pr-6">
              <div className="size-10 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 shadow-2xs">
                <CompassIcon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-heading text-base font-bold text-[#14233c]">
                  Production-Grade Briefs
                </h4>
                <p className="text-xs text-[#596579] leading-relaxed">
                  Co-developed to mirror real agency and product workflows, replacing abstract textbook exercises with structured deliverables.
                </p>
              </div>
            </div>

            {/* Pillar 02 */}
            <div className="flex items-start gap-4 pt-6 md:pt-0 md:px-6">
              <div className="size-10 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 shadow-2xs">
                <UserCheck2Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-heading text-base font-bold text-[#14233c]">
                  Weekly 1:1 Checkpoints
                </h4>
                <p className="text-xs text-[#596579] leading-relaxed">
                  Weekly supervisor review notes, written task logs, and milestone evaluations verify active participation from start to finish.
                </p>
              </div>
            </div>

            {/* Pillar 03 */}
            <div className="flex items-start gap-4 pt-6 md:pt-0 md:pl-6">
              <div className="size-10 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 shadow-2xs">
                <AwardIcon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-heading text-base font-bold text-[#14233c]">
                  Tamper-Evident Credentials
                </h4>
                <p className="text-xs text-[#596579] leading-relaxed">
                  Each certificate features an immutable Certificate ID and direct QR link verifiable by employers and universities globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
