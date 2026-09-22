import * as React from "react"
import {
  FileTextIcon,
  SparklesIcon,
  UserCheckIcon,
  ArrowLeftIcon,
  SkipForwardIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PdfUploadPicker } from "@/components/common/pdf-upload-picker"
import type { DocumentType } from "@/lib/types/programs"
import { useRegistrationStore } from "@/lib/stores/registration-store"

interface StepConsentLetterProps {
  onBack: () => void
  onSubmit: (consentDoc?: DocumentType | null) => void
}

export function StepConsentLetter({ onBack, onSubmit }: StepConsentLetterProps) {
  const formData = useRegistrationStore((s) => s.formData)
  const setField = useRegistrationStore((s) => s.setField)
  const isLoading = useRegistrationStore((s) => s.isLoading)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 pb-1 border-b border-[#ede7de]">
          <FileTextIcon className="size-3.5 text-[#a07142]" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#14233c]">
            Parental Consent Document
          </h3>
        </div>

        {/* Explanatory Callout */}
        <div className="rounded-xl border border-[#d4af37]/30 bg-[#fbf6ee] p-3.5 text-xs text-[#8e653e] flex items-start gap-2.5">
          <SparklesIcon className="size-3.5 shrink-0 text-[#d4af37] mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[#14233c] text-xs">Optional Consent Letter Submission</span>
            <p className="text-[11px] text-[#596579] leading-relaxed">
              Uploading a signed parental consent letter is optional during registration. You may attach a PDF document now or skip this step to finish immediately.
            </p>
          </div>
        </div>

        {/* Cloud PDF Upload Picker Component */}
        <PdfUploadPicker
          value={formData.consentLetter as DocumentType}
          onChange={(doc) => setField("consentLetter", doc)}
          label="Parental Consent Letter (PDF)"
          folder="student_consent_letters"
          helperText="Optional: PDF document up to 10 MB"
          disabled={isLoading}
        />
      </div>

      {/* Step 3 Actions */}
      <div className="pt-2 flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
            className="w-full sm:w-auto h-10 rounded-xl border-[#e2dcce] text-xs font-semibold text-[#14233c] hover:bg-[#f6eee3] gap-1.5 cursor-pointer"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to Academic</span>
          </Button>

          <Button
            type="button"
            onClick={() => onSubmit()}
            disabled={isLoading}
            className="w-full sm:flex-1 h-10 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white text-xs sm:text-sm font-semibold shadow-xs gap-1.5 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Creating Student Account...</span>
              </>
            ) : (
              <>
                <UserCheckIcon className="size-3.5" />
                <span>
                  {formData.consentLetter
                    ? "Submit & Complete Registration"
                    : "Complete Student Registration"}
                </span>
              </>
            )}
          </Button>
        </div>

        {/* Skip Option Button */}
        {!formData.consentLetter && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onSubmit(null)}
            disabled={isLoading}
            className="h-9 text-[11px] font-semibold text-[#596579] hover:text-[#14233c] hover:bg-slate-100 gap-1 cursor-pointer self-center"
          >
            <SkipForwardIcon className="size-3 text-[#a07142]" />
            <span>Skip this step and complete registration without consent letter</span>
          </Button>
        )}

        <p className="text-[10px] text-center text-[#94a3b8] leading-relaxed">
          By completing registration, you agree to our Candidate Code of Conduct and Verified Proof-of-Work Evaluation Policy.
        </p>
      </div>
    </div>
  )
}
