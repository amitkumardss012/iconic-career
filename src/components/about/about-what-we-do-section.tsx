import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  SparklesIcon,
  BookOpenIcon,
  FileCheckIcon,
  UserCheck2Icon,
  AwardIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
} from "lucide-react"

const supportPillars = [
  {
    icon: BookOpenIcon,
    title: "Production-Grade Curriculum Tracks",
    badge: "LEARNING RIGOR",
    description:
      "Every track pairs deep conceptual modules with live briefs covering digital product work, business operations, visual design systems, and corporate communications.",
    features: ["Industry-calibrated syllabus", "Weekly applied briefs", "No passive video lectures"],
  },
  {
    icon: FileCheckIcon,
    title: "Logged Deliverables & Hours",
    badge: "EVIDENCE OF WORK",
    description:
      "Work is not left to memory. Participants log hours, submit task notes, and maintain a documented completion dossier recorded directly in their student account.",
    features: ["Attendance tracking", "Structured task logs", "Permanent dossier archive"],
  },
  {
    icon: UserCheck2Icon,
    title: "Weekly Practitioner Checkpoints",
    badge: "1:1 MENTORSHIP",
    description:
      "Supervisors provide scheduled evaluation sessions, reviewing submissions against workplace briefs, offering critique, and confirming milestone advancement.",
    features: ["Actionable review notes", "Mid-term checkpoint", "Final supervisor evaluation"],
  },
  {
    icon: AwardIcon,
    title: "Cryptographically Referenceable Credential",
    badge: "PUBLIC STANDING",
    description:
      "Graduates receive an institutional Certificate of Completion containing an immutable Certificate ID and direct QR code verifiable by employers and colleges online.",
    features: ["Unique registry ID", "Instant QR optical scan", "Zero-login verification"],
  },
]

export function AboutWhatWeDoSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28 border-b border-[#ede7de]">
      {/* Mesh */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#e2dcce]/90">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>WHAT WE PROVIDE • STUDENT SUPPORT</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
              How We Support Every Student. <br />
              <span className="italic text-[#a07142]">From Registration to Public Standing.</span>
            </h2>

            <p className="text-sm text-[#596579] leading-relaxed max-w-xl mt-3.5 font-normal">
              Four fundamental operational pillars ensure your internship experience is structured, mentored, documented, and universally recognized.
            </p>
          </div>

          <Link
            to="/programs"
            className="inline-flex items-center gap-2 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-2xs transition-all shrink-0 group"
          >
            <span>Explore All 6 Disciplines</span>
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {supportPillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-[#e2dcce] bg-white p-6 sm:p-8 flex flex-col justify-between shadow-[0_2px_16px_rgba(20,35,60,0.04)] hover:shadow-[0_16px_36px_rgba(20,35,60,0.09)] hover:border-[#a07142]/60 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="size-10 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 group-hover:bg-[#8e653e] group-hover:text-white transition-colors">
                      <Icon className="size-5" />
                    </div>

                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8e653e] bg-[#faf6f0] border border-[#eee3d5] px-2.5 py-1 rounded-md">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#14233c] group-hover:text-[#a07142] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#596579] leading-relaxed mt-2.5">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f0eae1] flex flex-wrap gap-2">
                  {pillar.features.map((feat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#14233c] bg-[#faf8f5] border border-[#ede7de] px-2.5 py-1 rounded-md"
                    >
                      <CheckCircle2Icon className="size-3 text-[#a07142]" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
