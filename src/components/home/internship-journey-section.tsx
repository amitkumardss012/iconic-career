import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserCheckIcon,
  AwardIcon,
  FileCheckIcon,
  ChevronRightIcon,
} from "lucide-react"
import { internshipJourney } from "@/lib/data/journey"

const stepEnhancements = [
  {
    phase: "Phase 01",
    duration: "Day 1",
    milestone: "Student Identity Created",
    checkpoint: "Identity & Academic Verification",
    deliverable: "Official Student ID & Account",
    tag: "START HERE",
  },
  {
    phase: "Phase 02",
    duration: "Day 1–2",
    milestone: "Track Alignment",
    checkpoint: "Syllabus & Prerequisites Review",
    deliverable: "Curriculum Blueprint Assigned",
    tag: "ORIENTATION",
  },
  {
    phase: "Phase 03",
    duration: "Day 2–3",
    milestone: "Enrollment Verified",
    checkpoint: "Server Record Confirmation",
    deliverable: "Official Placement Confirmation",
    tag: "ONBOARDING",
  },
  {
    phase: "Phase 04",
    duration: "Weeks 1–4",
    milestone: "Supervised Execution",
    checkpoint: "Weekly 1:1 Supervisor Logs",
    deliverable: "Production Task Submissions",
    tag: "CORE PRACTICE",
  },
  {
    phase: "Phase 05",
    duration: "Weeks 5–8+",
    milestone: "Dossier Evaluation",
    checkpoint: "Final Supervisor Sign-off",
    deliverable: "Completion File Recorded",
    tag: "EVALUATION",
  },
  {
    phase: "Phase 06",
    duration: "Graduation",
    milestone: "Tamper-Evident Issuance",
    checkpoint: "Public Registry Ledger Entry",
    deliverable: "Verifiable Certificate & QR",
    tag: "CREDENTIAL",
  },
]

export function InternshipJourneySection() {
  const [activeStepIndex, setActiveStepIndex] = React.useState<number>(0)

  const activeStep = internshipJourney[activeStepIndex]
  const activeMeta = stepEnhancements[activeStepIndex]

  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28 border-y border-[#ede7de]">
      {/* Background Lighting & Architectural Mesh */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -bottom-32 left-1/3 w-[800px] h-[350px] bg-gradient-to-t from-[#f5ebd8]/40 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10 sm:gap-14">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#e2dcce]/90">
          <div className="max-w-2xl">
            {/* Illuminated Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>PROGRESSION PIPELINE</span>
              <span className="h-2 w-px bg-[#d6cbba]" />
              <span className="text-[10px] text-[#64748b] tracking-normal font-medium">
                6 Verified Phases
              </span>
            </div>

            {/* Display Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
              How the Journey Works. <br />
              <span className="italic text-[#a07142]">From Registration to Public Credential.</span>
            </h2>

            {/* Subparagraph */}
            <p className="text-sm text-[#596579] leading-relaxed max-w-xl mt-3.5 font-normal">
              A transparent, organized progression from student identity registration through supervised weekly checkpoints and verified certificate publication.
            </p>
          </div>

          {/* Right Pillar CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="hidden lg:block text-right">
              <div className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-[#7388a1]">
                TRANSPARENT SCHEDULE • SUPERVISED LOGS • ZERO SECRETS
              </div>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-all group"
            >
              <span>Begin Your Registration</span>
              <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Connected Milestone Pipeline Rail (Interactive Progress Track) */}
        <div className="relative">
          {/* Connecting Track Line behind cards on desktop */}
          <div className="hidden lg:block absolute top-[28px] inset-x-8 h-0.5 bg-[#e2dcce] z-0" />

          {/* 6 Connected Phase Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
            {internshipJourney.map((step, idx) => {
              const isCurrent = idx === activeStepIndex
              const meta = stepEnhancements[idx]

              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`group relative text-left rounded-xl p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer border ${
                    isCurrent
                      ? "bg-[#0e1f33] text-white border-[#d4af37] shadow-xl ring-2 ring-[#d4af37]/30 -translate-y-1"
                      : "bg-white text-[#14233c] border-[#e2dcce] hover:border-[#a07142]/60 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {/* Top Node Indicator & Phase */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`size-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                        isCurrent
                          ? "bg-[#d4af37] text-[#0e1f33]"
                          : "bg-[#f5eee3] text-[#8e653e] group-hover:bg-[#8e653e] group-hover:text-white"
                      }`}
                    >
                      {step.step}
                    </span>

                    <span
                      className={`text-[9.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? "bg-white/15 text-[#f5d77f]"
                          : "bg-[#f5efe5] text-[#8e653e]"
                      }`}
                    >
                      {meta.tag}
                    </span>
                  </div>

                  {/* Title & Timing */}
                  <div>
                    <span
                      className={`text-[10.5px] font-mono block ${
                        isCurrent ? "text-slate-300" : "text-[#7388a1]"
                      }`}
                    >
                      {meta.duration}
                    </span>
                    <h4
                      className={`font-heading text-[16px] font-bold mt-0.5 leading-snug line-clamp-1 ${
                        isCurrent ? "text-white" : "text-[#14233c] group-hover:text-[#a07142]"
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>

                  {/* Checkpoint Status Marker */}
                  <div
                    className={`mt-3 pt-2.5 border-t text-[11px] leading-tight ${
                      isCurrent
                        ? "border-white/15 text-slate-300"
                        : "border-[#f0eae1] text-[#64748b]"
                    }`}
                  >
                    <span className="font-semibold block">{meta.milestone}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Phase Deep-Dive Stage Banner */}
        <div className="rounded-2xl border border-[#d6cbba] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_12px_32px_rgba(20,35,60,0.06)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8e653e]">
                ACTIVE INSPECTION • {activeMeta.phase} OF 06
              </span>
              <span className="text-xs text-[#7388a1]">• {activeMeta.duration}</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#14233c] leading-tight">
              {activeStep.title}: <span className="text-[#a07142]">{activeMeta.milestone}</span>
            </h3>

            <p className="text-sm text-[#596579] leading-relaxed">
              {activeStep.detail}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="rounded-xl border border-[#ede3d5] bg-[#faf8f5] p-3 flex items-center gap-3">
                <UserCheckIcon className="size-4 text-[#8e653e] shrink-0" />
                <div className="text-xs">
                  <span className="text-[10px] text-[#7388a1] block uppercase font-mono">Supervisor Checkpoint</span>
                  <span className="font-semibold text-[#14233c]">{activeMeta.checkpoint}</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#ede3d5] bg-[#faf8f5] p-3 flex items-center gap-3">
                <FileCheckIcon className="size-4 text-[#8e653e] shrink-0" />
                <div className="text-xs">
                  <span className="text-[10px] text-[#7388a1] block uppercase font-mono">Tangible Outcome</span>
                  <span className="font-semibold text-[#14233c]">{activeMeta.deliverable}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Registration Card */}
          <div className="w-full lg:w-80 rounded-xl bg-[#0e1f33] text-white p-6 flex flex-col justify-between gap-4 shrink-0 shadow-lg border border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#f5d77f]">
                APPLICATIONS OPEN
              </span>
              <h4 className="font-heading text-lg font-bold text-white mt-1">
                Start at Phase 01 Today
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Registration takes under 2 minutes. Open your student account and select your internship domain.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-[#d4af37] hover:bg-[#c59b63] text-[#0e1f33] font-bold px-4 py-2.5 text-xs transition-all shadow-sm gap-2"
            >
              <span>Register Now</span>
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
