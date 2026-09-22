import * as React from "react"
import {
  UsersIcon,
  FolderGit2Icon,
  QrCodeIcon,
  ShieldCheckIcon,
} from "lucide-react"

export function InternshipsAssuranceStrip() {
  return (
    <section className="relative w-full bg-[#f4ede2]/60 py-16 sm:py-20 border-t border-b border-[#e2dcce]">
      <div className="container-site flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-3">
              <ShieldCheckIcon className="size-3.5 text-[#d4af37]" />
              <span>SUPERVISED INTERNSHIP INTEGRITY</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-[#14233c]">
              How Our Internships Guarantee <br />
              <span className="italic text-[#a07142]">Real-World Competency</span>
            </h2>
          </div>
          <p className="text-sm text-[#596579] max-w-md font-normal leading-relaxed">
            Every internship is paired with supervisor checkpoints, ensuring students produce demonstrable artifacts ready for hiring team evaluation.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <UsersIcon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  STAGE 01
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                Weekly Supervised Reviews
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Work through structured sequences: onboarding, assigned briefs, revision notes, and supervisor close-out reviews.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de] text-[11px] font-mono text-[#8e653e]">
              Documented Feedback Loops
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <FolderGit2Icon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  STAGE 02
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                Proof of Work Dossier
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Every code submission, operational tracker, and design presentation is logged into a completion file for recruiter verification.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de] text-[11px] font-mono text-[#8e653e]">
              Archived Project Deliverables
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl border border-[#e2dcce] bg-white p-7 shadow-xs hover:border-[#14233c] transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-11 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center group-hover:bg-[#14233c] group-hover:text-white transition-colors">
                  <QrCodeIcon className="size-5" />
                </div>
                <span className="font-mono text-xs font-bold text-[#a07142]">
                  STAGE 03
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#14233c] mb-2">
                Public QR Credential
              </h3>
              <p className="text-xs sm:text-sm text-[#596579] leading-relaxed">
                Successful completion unlocks an official, tamper-proof certificate featuring a unique Certificate ID audit record.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#ede7de] text-[11px] font-mono text-[#8e653e]">
              Instant Third-Party Audit
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
