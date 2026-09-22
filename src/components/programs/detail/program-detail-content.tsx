import React from "react"
import { Link } from "@tanstack/react-router"
import type { Program } from "@/lib/types"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  BookOpenIcon,
  CheckCircle2Icon,
  BriefcaseIcon,
  ShieldCheckIcon,
  AwardIcon,
  LayersIcon,
  CompassIcon,
  ExternalLinkIcon,
  SparklesIcon,
} from "lucide-react"

interface ProgramDetailContentProps {
  program: Program
}

export function ProgramDetailContent({ program }: ProgramDetailContentProps) {
  return (
    <div className="flex flex-col gap-16 md:gap-24 py-16 md:py-24 bg-white">
      {/* 01. PROGRAM OVERVIEW & INTERNSHIP LINK */}
      <section className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8cbb8] bg-[#faf8f5] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c]">
              <CompassIcon className="size-3.5 text-[#a07142]" />
              <span>Syllabus Architecture</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c] tracking-tight">
              About the <span className="italic text-[#a07142]">{program.name}</span> Track
            </h2>

            <div className="text-base text-[#556477] leading-relaxed space-y-4 font-light mt-2">
              <p>{program.description}</p>
            </div>

            {/* Paired Internship Callout Box */}
            <div className="mt-4 rounded-2xl border border-[#e8dfd1] bg-[#faf8f5] p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-white border border-[#e8dfd1] text-[#a07142]">
                  <BriefcaseIcon className="size-4" />
                </div>
                <h3 className="font-heading text-lg font-medium text-[#14233c]">
                  Internship Integration & Applied Practice
                </h3>
              </div>
              <p className="text-sm text-[#556477] leading-relaxed font-light">
                {program.internshipRelationship}
              </p>
            </div>
          </div>

          {/* Right Column: Candidate Profile ("Who This Program Is Designed For") */}
          <div className="lg:col-span-5 rounded-2xl border border-[#e8dfd1] bg-[#faf8f5] p-6 sm:p-8 shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-white px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#a07142] mb-4">
              <span>Candidate Suitability</span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-normal text-[#14233c]">
              Who This Program Is Designed For
            </h3>

            <p className="text-xs text-[#64748b] mt-1 mb-6">
              Our curriculum is calibrated for focused learners who thrive under structured milestones:
            </p>

            <ul className="flex flex-col gap-4">
              {program.whoItsFor.map((item, idx) => (
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

      {/* 02. WHAT STUDENTS LEARN (EXPECTED COMPETENCIES) */}
      <section className="bg-[#faf8f5] py-16 md:py-24 border-y border-[#e8dfd1] relative">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-white px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] mb-3">
              <SparklesIcon className="size-3.5 text-[#a07142]" />
              <span>Competency Benchmarks</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c]">
              What You Will <span className="italic text-[#a07142]">Learn & Deliver</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#556477] leading-relaxed">
              Every participant graduates with demonstrable, portfolio-ready artifacts evaluated against industry standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {program.learningOutcomes.map((outcome, idx) => (
              <div
                key={outcome}
                className="rounded-2xl border border-[#e8dfd1] bg-white p-6 flex flex-col justify-between hover:shadow-md hover:border-[#a07142]/60 transition-all group"
              >
                <div>
                  <span className="font-mono text-2xl font-bold text-[#d8cbb8] group-hover:text-[#a07142] transition-colors block mb-4">
                    0{idx + 1}
                  </span>
                  <h4 className="font-heading text-base font-medium text-[#14233c] leading-snug mb-2">
                    {outcome}
                  </h4>
                </div>
                <div className="pt-4 border-t border-[#f0e8dc] flex items-center gap-1 text-[11px] font-mono text-[#a07142]">
                  <CheckCircle2Icon className="size-3" />
                  <span>Evaluated Milestone</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03. PROGRAM STRUCTURE (CURRICULUM PHASES) */}
      <section className="container-site">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-[#faf8f5] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] mb-3">
            <LayersIcon className="size-3.5 text-[#a07142]" />
            <span>Phased Progression</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c]">
            Curriculum <span className="italic text-[#a07142]">Module Breakdown</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#556477] leading-relaxed">
            A calibrated sequence of modules synchronized with your chosen duration (4, 8, or 12 weeks).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {program.structure.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#e8dfd1] bg-[#faf8f5] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#64748b] mb-4">
                  <span className="font-bold text-[#a07142]">Module 0{idx + 1}</span>
                  <span className="text-[10px] uppercase bg-white px-2 py-0.5 rounded border border-[#e8dfd1]">
                    Evaluated Unit
                  </span>
                </div>

                <h3 className="font-heading text-lg font-medium text-[#14233c] mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#556477] leading-relaxed font-light">
                  {item.detail}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#e8dfd1] text-[11px] font-mono text-[#64748b]">
                Progress Checkpoint Included
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04. CERTIFICATION & FAQS */}
      <section className="bg-[#faf8f5] py-16 md:py-24 border-t border-[#e8dfd1]">
        <div className="container-site grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Official Verification Callout */}
          <div className="lg:col-span-5 rounded-2xl border border-[#d6cbba] bg-white p-7 sm:p-9 shadow-sm flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#14233c] text-white shadow-xs">
                  <AwardIcon className="size-5 text-[#c5a880]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#a07142] font-semibold block">
                    Institutional Standing
                  </span>
                  <h3 className="font-heading text-xl font-medium text-[#14233c]">
                    Certificate & Public Verification
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#556477] leading-relaxed font-light mt-3">
                {program.certificateNote}
              </p>

              <div className="mt-6 rounded-xl border border-[#e8dfd1] bg-[#faf8f5] p-4 text-xs text-[#64748b] space-y-2">
                <div className="flex items-center gap-2 font-mono text-[#14233c] font-semibold">
                  <ShieldCheckIcon className="size-4 text-[#a07142]" />
                  <span>Tamper-Evident SHA-256 Checksum</span>
                </div>
                <p>
                  Every certificate includes candidate name, recorded track, supervised hours, and an immutable serial number verified at our public registry.
                </p>
              </div>
            </div>

            <Link
              to="/verify"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#a07142] hover:text-[#14233c] transition-colors border-t border-[#f0e8dc] pt-4"
            >
              <span>Explore the Public Certificate Verification Portal</span>
              <ExternalLinkIcon className="size-3.5" />
            </Link>
          </div>

          {/* Right Column: Program FAQ Accordion */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#a07142] font-semibold">
                Clarifications & Advisement
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-normal text-[#14233c] mt-1">
                Frequently Asked Questions
              </h3>
              <p className="text-xs sm:text-sm text-[#556477] mt-1 font-light">
                Answers to essential operational and curriculum inquiries regarding {program.name}.
              </p>
            </div>

            <Accordion className="w-full flex flex-col gap-3">
              {program.faqs.map((faq, idx) => (
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
        </div>
      </section>
    </div>
  )
}
