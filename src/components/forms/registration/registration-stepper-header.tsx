import * as React from "react"
import { useRegistrationStore } from "@/lib/stores/registration-store"

interface RegistrationStepperHeaderProps {
  onStepClick: (step: number) => void
}

export function RegistrationStepperHeader({ onStepClick }: RegistrationStepperHeaderProps) {
  const currentStep = useRegistrationStore((s) => s.currentStep)

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#8e653e] shadow-2xs">
          <span>STEP {currentStep} OF 3</span>
        </div>
        <span className="text-[11px] font-bold text-[#8e653e]">
          {currentStep === 1 && "Personal & Guardian"}
          {currentStep === 2 && "Academic Details"}
          {currentStep === 3 && "Consent Letter (Optional)"}
        </span>
      </div>

      {/* Visual Stepper Progress Bar */}
      <div className="w-full grid grid-cols-3 gap-1.5">
        <div
          onClick={() => onStepClick(1)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            currentStep >= 1 ? "bg-[#14233c]" : "bg-slate-200"
          }`}
        />
        <div
          onClick={() => onStepClick(2)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            currentStep >= 2 ? "bg-[#14233c]" : "bg-slate-200"
          }`}
        />
        <div
          onClick={() => onStepClick(3)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            currentStep >= 3 ? "bg-[#14233c]" : "bg-slate-200"
          }`}
        />
      </div>

      <div>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#14233c] tracking-tight">
          {currentStep === 1 && "Personal & Guardian Information"}
          {currentStep === 2 && "Academic Credentials & Institution"}
          {currentStep === 3 && "Parental Consent Letter"}
        </h1>
        <p className="text-[11.5px] sm:text-xs text-[#596579] mt-0.5 leading-relaxed">
          {currentStep === 1 &&
            "Enter your legal identity, contact details, and set up your secure password."}
          {currentStep === 2 &&
            "Enter your college, course, department, session, and registration credentials."}
          {currentStep === 3 &&
            "Upload a signed parental consent letter in PDF format, or skip to finish."}
        </p>
      </div>
    </div>
  )
}
