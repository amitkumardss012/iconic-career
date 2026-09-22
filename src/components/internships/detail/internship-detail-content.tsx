import React from "react"
import { Link } from "@tanstack/react-router"
import type { Internship } from "@/lib/types"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  BriefcaseIcon,
  CheckCircle2Icon,
  RotateCwIcon,
  ShieldCheckIcon,
  AwardIcon,
  CalendarIcon,
  GitBranchIcon,
  FileCheckIcon,
  ExternalLinkIcon,
  SparklesIcon,
  ClockIcon,
} from "lucide-react"

interface InternshipDetailContentProps {
  internship: Internship
}

export function InternshipDetailContent({ internship }: InternshipDetailContentProps) {
  return (
    <div className="flex flex-col gap-16 md:gap-24 py-16 md:py-24 bg-white">
      {/* 01. SUPERVISED WORK METHODOLOGY & ROLE CONTEXT */}
      <section className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8cbb8] bg-[#faf8f5] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c]">
              <BriefcaseIcon className="size-3.5 text-[#a07142]" />
              <span>Practice Framework</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c] tracking-tight">
              Supervised Work <span className="italic text-[#a07142]">Methodology</span>
            </h2>

            <div className="text-base text-[#556477] leading-relaxed space-y-4 font-light mt-2">
              <p>{internship.overview}</p>
            </div>

            {/* Extension Framework Callout Box */}
            <div className="mt-4 rounded-2xl border border-[#e8dfd1] bg-[#faf8f5] p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-white border border-[#e8dfd1] text-[#a07142]">
                  <RotateCwIcon className="size-4" />
                </div>
                <h3 className="font-heading text-lg font-medium text-[#14233c]">
                  Internship Extension Framework
                </h3>
              </div>
              <p className="text-sm text-[#556477] leading-relaxed font-light">
                {internship.extensionNote}
              </p>
            </div>
          </div>

          {/* Right Column: Eligibility Requirements */}
          <div className="lg:col-span-5 rounded-2xl border border-[#e8dfd1] bg-[#faf8f5] p-6 sm:p-8 shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-white px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#a07142] mb-4">
              <span>Candidate Criteria</span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-normal text-[#14233c]">
              Eligibility & Readiness
            </h3>

            <p className="text-xs text-[#64748b] mt-1 mb-6">
              Applicants must meet these foundational prerequisites prior to cohort onboarding:
            </p>

            <ul className="flex flex-col gap-4">
              {internship.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#334155]">
                  <div className="flex size-5 items-center justify-center rounded-full bg-white border border-[#d8cbb8] text-[#a07142] shrink-0 mt-0.5 shadow-2xs">
                    <CheckCircle2Icon className="size-3 text-[#a07142]" />
                  </div>
                  <span className="leading-relaxed font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 02. INTERNSHIP WORKFLOW & MILESTONES (4 PHASES) */}
      <section className="bg-[#faf8f5] py-16 md:py-24 border-y border-[#e8dfd1] relative">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-white px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] mb-3">
              <GitBranchIcon className="size-3.5 text-[#a07142]" />
              <span>Workflow Breakdown</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c]">
              Four-Stage <span className="italic text-[#a07142]">Internship Progression</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#556477] leading-relaxed">
              Every intern executes a transparent, mentor-evaluated sequence from initial onboarding to graduation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {internship.structure.map((phase, idx) => (
              <div
                key={phase.title}
                className="rounded-2xl border border-[#e8dfd1] bg-white p-6 sm:p-7 flex flex-col justify-between hover:shadow-md hover:border-[#a07142]/60 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#64748b] mb-4">
                    <span className="font-bold text-[#a07142]">Phase 0{idx + 1}</span>
                    <span className="text-[10px] uppercase bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e8dfd1]">
                      Checkpoint
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-medium text-[#14233c] mb-2">
                    {phase.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#556477] leading-relaxed font-light">
                    {phase.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f0e8dc] text-[11px] font-mono text-[#a07142] flex items-center gap-1">
                  <CheckCircle2Icon className="size-3" />
                  <span>Documented In Student Dossier</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03. COMPLETION PROTOCOL & CERTIFICATION PROCESS */}
      <section className="container-site">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-[#faf8f5] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] mb-3">
            <FileCheckIcon className="size-3.5 text-[#a07142]" />
            <span>Graduation Standards</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c]">
            Completion Recording & <span className="italic text-[#a07142]">Certificate Issuance</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#556477] leading-relaxed">
            Our strict verification governance ensures your certificate carries real weight with hiring teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: How Completion Is Recorded */}
          <div className="rounded-2xl border border-[#e8dfd1] bg-[#faf8f5] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-white border border-[#e8dfd1] text-[#a07142] shadow-2xs">
                  <FileCheckIcon className="size-5" />
                </div>
                <h3 className="font-heading text-xl font-medium text-[#14233c]">
                  How Completion Is Recorded
                </h3>
              </div>

              <ul className="flex flex-col gap-3.5 mt-2">
                {internship.completionProcess.map((step, idx) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-[#334155]">
                    <span className="font-mono text-xs font-bold text-[#a07142] mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="leading-relaxed font-light">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#e8dfd1] flex items-center gap-2 text-xs text-[#64748b]">
              <ClockIcon className="size-3.5 text-[#a07142]" />
              <span>Evaluated upon final week check-in</span>
            </div>
          </div>

          {/* Card 2: Certificate Issuance & Verification */}
          <div className="rounded-2xl border border-[#d6cbba] bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#14233c] text-white shadow-2xs">
                  <AwardIcon className="size-5 text-[#c5a880]" />
                </div>
                <h3 className="font-heading text-xl font-medium text-[#14233c]">
                  Certificate Issuance & Verification
                </h3>
              </div>

              <ul className="flex flex-col gap-3.5 mt-2">
                {internship.certificateProcess.map((step, idx) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-[#334155]">
                    <div className="flex size-4 items-center justify-center rounded-full bg-[#faf8f5] border border-[#d8cbb8] text-[#a07142] shrink-0 mt-1">
                      <CheckCircle2Icon className="size-2.5" />
                    </div>
                    <span className="leading-relaxed font-light">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f0e8dc] flex items-center justify-between">
              <span className="text-xs text-[#64748b] font-mono">
                Permanent Ledger Record
              </span>
              <Link
                to="/verify"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#a07142] hover:text-[#14233c] underline"
              >
                <span>Check Registry</span>
                <ExternalLinkIcon className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 04. INTERNSHIP FAQS */}
      {internship.faqs.length > 0 && (
        <section className="bg-[#faf8f5] py-16 md:py-24 border-t border-[#e8dfd1]">
          <div className="container-site max-w-3xl mx-auto flex flex-col gap-6">
            <div className="text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-[#a07142] font-semibold">
                Operational Inquiries
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-normal text-[#14233c] mt-1">
                Frequently Asked Questions
              </h3>
              <p className="text-xs sm:text-sm text-[#556477] mt-1 font-light">
                Common questions regarding schedule format, mentor feedback, and duration flexibility for {internship.name}.
              </p>
            </div>

            <Accordion className="w-full flex flex-col gap-3 mt-4">
              {internship.faqs.map((faq, idx) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${idx}`}
                  className="rounded-xl border border-[#e8dfd1] bg-white px-5 shadow-2xs overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-heading text-base font-medium text-[#14233c] hover:text-[#a07142] py-4 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#556477] leading-relaxed pb-4 font-light">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  )
}
