import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  SparklesIcon,
  CheckIcon,
  FolderGit2Icon,
  ShieldCheckIcon,
  AwardIcon,
  ArrowRightIcon,
} from "lucide-react"
import { useRegistrationStore } from "@/lib/stores/registration-store"

interface RegistrationStepperSidebarProps {
  onStepClick: (step: number) => void
}

export function RegistrationStepperSidebar({ onStepClick }: RegistrationStepperSidebarProps) {
  const currentStep = useRegistrationStore((s) => s.currentStep)
  const consentLetter = useRegistrationStore((s) => s.formData.consentLetter)

  return (
    <div className="lg:col-span-4 bg-[#0e1726] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#22334f]">
      {/* Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-radial from-[#d4af37]/20 via-transparent to-transparent blur-2xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative flex flex-col gap-4.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#1a253a] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8c56c] shadow-xs w-fit">
          <SparklesIcon className="size-2.5 text-[#d4af37]" />
          <span>ADMISSIONS 2026</span>
        </div>

        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-normal tracking-tight text-white leading-tight">
            Student <span className="italic text-[#e8c56c]">Dossier Setup.</span>
          </h2>
          <p className="text-xs text-[#94a3b8] leading-relaxed mt-1.5">
            Complete your profile in 3 simple steps to access industry projects and track credentials.
          </p>
        </div>

        {/* Stepper Status Indicators */}
        <div className="flex flex-col gap-2 pt-1">
          {/* Step 1 */}
          <div
            onClick={() => onStepClick(1)}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
              currentStep === 1
                ? "bg-[#1a273f] border-[#d4af37]/60 text-white shadow-xs"
                : currentStep > 1
                ? "bg-white/5 border-emerald-500/40 text-emerald-300"
                : "bg-white/5 border-white/10 text-[#94a3b8]"
            }`}
          >
            <div
              className={`size-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentStep === 1
                  ? "bg-[#d4af37] text-[#0e1726]"
                  : currentStep > 1
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {currentStep > 1 ? <CheckIcon className="size-3 stroke-[3]" /> : "1"}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11.5px] font-semibold">Personal & Guardian</span>
              <span className="text-[10px] opacity-70">Identity & Password</span>
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onStepClick(2)}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
              currentStep === 2
                ? "bg-[#1a273f] border-[#d4af37]/60 text-white shadow-xs"
                : currentStep > 2
                ? "bg-white/5 border-emerald-500/40 text-emerald-300"
                : "bg-white/5 border-white/10 text-[#94a3b8]"
            }`}
          >
            <div
              className={`size-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentStep === 2
                  ? "bg-[#d4af37] text-[#0e1726]"
                  : currentStep > 2
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {currentStep > 2 ? <CheckIcon className="size-3 stroke-[3]" /> : "2"}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11.5px] font-semibold">Academic Profile</span>
              <span className="text-[10px] opacity-70">College & Degree</span>
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onStepClick(3)}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
              currentStep === 3
                ? "bg-[#1a273f] border-[#d4af37]/60 text-white shadow-xs"
                : consentLetter
                ? "bg-white/5 border-emerald-500/40 text-emerald-300"
                : "bg-white/5 border-white/10 text-[#94a3b8]"
            }`}
          >
            <div
              className={`size-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentStep === 3
                  ? "bg-[#d4af37] text-[#0e1726]"
                  : consentLetter
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/70"
              }`}
            >
              3
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11.5px] font-semibold">Consent Letter (Optional)</span>
              <span className="text-[10px] opacity-70">Cloud PDF or Skip</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-[11px] text-[#cbd5e1]">
            <div className="size-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#e8c56c]">
              <FolderGit2Icon className="size-3" />
            </div>
            <span>Industry Problem Statements</span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-[#cbd5e1]">
            <div className="size-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#e8c56c]">
              <ShieldCheckIcon className="size-3" />
            </div>
            <span>State Persisted on Reload</span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-[#cbd5e1]">
            <div className="size-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#e8c56c]">
              <AwardIcon className="size-3" />
            </div>
            <span>Verifiable QR Credentials</span>
          </div>
        </div>
      </div>

      {/* Login Navigation Link */}
      <div className="relative pt-4 mt-4 border-t border-white/10 flex flex-col gap-1 text-[11px] text-[#94a3b8]">
        <span className="text-[10.5px] text-[#cbd5e1]">Already registered?</span>
        <Link
          to="/login"
          className="inline-flex items-center gap-1 font-semibold text-[#e8c56c] hover:underline"
        >
          <span>Sign in to candidate portal</span>
          <ArrowRightIcon className="size-3" />
        </Link>
      </div>
    </div>
  )
}
