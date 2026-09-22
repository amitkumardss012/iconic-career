import * as React from "react"
import { programs } from "@/lib/data/programs"
import { internships } from "@/lib/data/internships"
import {
  personalSchema,
  academicSchema,
  selectionSchema,
} from "@/lib/validation/enrollment"
import type { EnrollmentDraft } from "@/lib/types"
import { prepareEnrollmentPayment } from "@/lib/services/payment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  UserIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  CheckSquareIcon,
  CreditCardIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
  InfoIcon,
  CheckCircle2Icon,
  SparklesIcon,
  ShieldCheckIcon,
} from "lucide-react"

const STEPS = [
  { id: 1, label: "Personal", icon: UserIcon },
  { id: 2, label: "Academic", icon: GraduationCapIcon },
  { id: 3, label: "Selection", icon: BriefcaseIcon },
  { id: 4, label: "Review", icon: CheckSquareIcon },
  { id: 5, label: "Enrollment & Fee", icon: CreditCardIcon },
]

const PROGRAM_PRICING: Record<string, string> = {
  "digital-practice": "₹2,999",
  "business-operations": "₹1,999",
  "design-studio": "₹2,499",
  "communications-practice": "₹1,999",
  "workplace-practice": "₹1,499",
  "research-support": "₹2,199",
}

export function EnrollmentStepper() {
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const initialProgram = searchParams.get("program") || programs[0].slug
  const initialInternship =
    searchParams.get("internship") || internships[0].slug

  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState<EnrollmentDraft>({
    fullName: "",
    mobile: "",
    email: "",
    college: "",
    academicProgram: "",
    yearOfStudy: "3rd Year",
    programSlug: initialProgram,
    internshipSlug: initialInternship,
    duration: "8 weeks",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [paymentStatus, setPaymentStatus] = React.useState<
    "idle" | "loading" | "unavailable" | "cancelled" | "failed" | "error"
  >("idle")
  const [paymentMessage, setPaymentMessage] = React.useState("")

  const handleProgramChange = (progSlug: string) => {
    const selectedProg = programs.find((p) => p.slug === progSlug)
    const relatedInt =
      selectedProg?.relatedInternshipSlugs[0] || internships[0].slug
    setFormData((prev: EnrollmentDraft) => ({
      ...prev,
      programSlug: progSlug,
      internshipSlug: relatedInt,
      duration: selectedProg?.defaultDuration || "8 weeks",
    }))
  }

  const validateCurrentStep = () => {
    setErrors({})
    if (step === 1) {
      const res = personalSchema.safeParse({
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
      })
      if (!res.success) {
        const fieldErrors: Record<string, string> = {}
        res.error.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message
        })
        setErrors(fieldErrors)
        return false
      }
    } else if (step === 2) {
      const res = academicSchema.safeParse({
        college: formData.college,
        academicProgram: formData.academicProgram,
        yearOfStudy: formData.yearOfStudy,
      })
      if (!res.success) {
        const fieldErrors: Record<string, string> = {}
        res.error.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message
        })
        setErrors(fieldErrors)
        return false
      }
    } else if (step === 3) {
      const res = selectionSchema.safeParse({
        programSlug: formData.programSlug,
        internshipSlug: formData.internshipSlug,
        duration: formData.duration,
      })
      if (!res.success) {
        const fieldErrors: Record<string, string> = {}
        res.error.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message
        })
        setErrors(fieldErrors)
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(prev + 1, 5))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleInitiateEnrollment = async () => {
    setPaymentStatus("loading")
    try {
      const res = await prepareEnrollmentPayment(formData)
      setPaymentStatus(res.status)
      setPaymentMessage(res.message)
      toast.info("Payment Gateway Notice", {
        description: res.message,
      })
    } catch {
      setPaymentStatus("error")
      setPaymentMessage("An unexpected error occurred while preparing enrollment.")
    }
  }

  const selectedProgramObj = programs.find((p) => p.slug === formData.programSlug)
  const selectedInternshipObj = internships.find(
    (i) => i.slug === formData.internshipSlug
  )

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[#e4dccf] bg-white p-6 sm:p-10 shadow-[0_12px_40px_rgba(20,35,60,0.06)]">
      {/* 5-Step Connected Progress Header */}
      <div className="mb-8 border-b border-[#ede7de] pb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, idx) => {
            const isCompleted = step > s.id
            const isCurrent = step === s.id
            const StepIcon = s.icon

            return (
              <div key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5 mx-auto">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl text-xs font-mono font-bold transition-all ${
                      isCompleted
                        ? "bg-[#14233c] text-white shadow-2xs"
                        : isCurrent
                        ? "border-2 border-[#14233c] bg-[#faf8f5] text-[#14233c] shadow-xs"
                        : "border border-[#e2dcce] bg-[#faf8f5] text-[#94a3b8]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2Icon className="size-4 text-emerald-400" />
                    ) : (
                      <StepIcon className="size-4" />
                    )}
                  </div>
                  <span
                    className={`hidden sm:inline-block text-[11px] font-medium tracking-tight ${
                      isCurrent
                        ? "text-[#14233c] font-bold"
                        : "text-[#7388a1]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block h-[2px] flex-1 mx-2 transition-colors ${
                      step > s.id ? "bg-[#14233c]" : "bg-[#e2dcce]"
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf6ee] border border-[#d4af37]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8e653e] mb-2">
              <span>Step 01 of 05</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#14233c]">
              Candidate Information
            </h3>
            <p className="text-xs sm:text-sm text-[#596579] mt-1 leading-relaxed">
              Provide your legal contact details to establish your student file and supervisor link.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold text-[#14233c]">
                Full Legal Name
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.fullName ? "border-destructive" : ""
                }`}
              />
              {errors.fullName && (
                <span className="text-xs text-destructive font-medium">{errors.fullName}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-[#14233c]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-destructive font-medium">{errors.email}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mobile" className="text-xs font-semibold text-[#14233c]">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
                    errors.mobile ? "border-destructive" : ""
                  }`}
                />
                {errors.mobile && (
                  <span className="text-xs text-destructive font-medium">{errors.mobile}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Academic Details */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf6ee] border border-[#d4af37]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8e653e] mb-2">
              <span>Step 02 of 05</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#14233c]">
              Academic Background
            </h3>
            <p className="text-xs sm:text-sm text-[#596579] mt-1 leading-relaxed">
              Record your educational institution, degree program, and current year of study.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="college" className="text-xs font-semibold text-[#14233c]">
                College / University Name
              </Label>
              <Input
                id="college"
                placeholder="e.g. National Institute of Technology"
                value={formData.college}
                onChange={(e) =>
                  setFormData({ ...formData, college: e.target.value })
                }
                className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.college ? "border-destructive" : ""
                }`}
              />
              {errors.college && (
                <span className="text-xs text-destructive font-medium">{errors.college}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="academicProgram" className="text-xs font-semibold text-[#14233c]">
                  Degree / Course of Study
                </Label>
                <Input
                  id="academicProgram"
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.academicProgram}
                  onChange={(e) =>
                    setFormData({ ...formData, academicProgram: e.target.value })
                  }
                  className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
                    errors.academicProgram ? "border-destructive" : ""
                  }`}
                />
                {errors.academicProgram && (
                  <span className="text-xs text-destructive font-medium">
                    {errors.academicProgram}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="yearOfStudy" className="text-xs font-semibold text-[#14233c]">
                  Year of Study
                </Label>
                <select
                  id="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={(e) =>
                    setFormData({ ...formData, yearOfStudy: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-[#e2dcce] bg-[#faf8f5] px-3 py-2 text-sm text-[#14233c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14233c]"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Graduate / Post-Graduate">
                    Graduate / Post-Graduate
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Program & Internship Selection */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf6ee] border border-[#d4af37]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8e653e] mb-2">
              <span>Step 03 of 05</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#14233c]">
              Select Program & Internship Track
            </h3>
            <p className="text-xs sm:text-sm text-[#596579] mt-1 leading-relaxed">
              Choose your curriculum direction and planned internship duration commitment.
            </p>
          </div>

          <div className="flex flex-col gap-5 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="programSelect" className="text-xs font-semibold text-[#14233c]">
                Academic Program Track
              </Label>
              <select
                id="programSelect"
                value={formData.programSlug}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#e2dcce] bg-[#faf8f5] px-3.5 py-2 text-sm text-[#14233c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14233c]"
              >
                {programs.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} — {p.categoryLabel} ({PROGRAM_PRICING[p.slug] || "₹1,999"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="internshipSelect" className="text-xs font-semibold text-[#14233c]">
                Paired Supervised Internship Track
              </Label>
              <select
                id="internshipSelect"
                value={formData.internshipSlug}
                onChange={(e) =>
                  setFormData({ ...formData, internshipSlug: e.target.value })
                }
                className="h-11 w-full rounded-xl border border-[#e2dcce] bg-[#faf8f5] px-3.5 py-2 text-sm text-[#14233c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14233c]"
              >
                {internships.map((intn) => (
                  <option key={intn.slug} value={intn.slug}>
                    {intn.name} — {intn.categoryLabel}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Label className="text-xs font-semibold text-[#14233c]">
                Committed Duration
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {["4 weeks", "8 weeks", "12 weeks"].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: dur })}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                      formData.duration === dur
                        ? "border-[#14233c] bg-[#14233c] text-white shadow-xs"
                        : "border-[#e2dcce] bg-[#faf8f5] hover:border-[#14233c] text-[#596579]"
                    }`}
                  >
                    <span>{dur}</span>
                    <span
                      className={`text-[10px] font-mono mt-0.5 ${
                        formData.duration === dur ? "text-[#d4af37]" : "text-[#7388a1]"
                      }`}
                    >
                      {dur === "4 weeks"
                        ? "Foundation"
                        : dur === "8 weeks"
                        ? "Recommended"
                        : "Comprehensive"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review Summary */}
      {step === 4 && (
        <div className="flex flex-col gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf6ee] border border-[#d4af37]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8e653e] mb-2">
              <span>Step 04 of 05</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#14233c]">
              Review Registration Dossier
            </h3>
            <p className="text-xs sm:text-sm text-[#596579] mt-1 leading-relaxed">
              Verify all entered information before proceeding to final enrollment confirmation.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2dcce] bg-[#faf8f5] p-6 divide-y divide-[#ede7de] text-sm">
            <div className="pb-4">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8e653e] font-mono block mb-3">
                01. Candidate Identity
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#14233c]">
                <div>
                  <span className="text-[#64748b] text-xs block">Full Name:</span>
                  <span className="font-bold">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-[#64748b] text-xs block">Email Address:</span>
                  <span className="font-bold">{formData.email}</span>
                </div>
                <div>
                  <span className="text-[#64748b] text-xs block">Mobile Number:</span>
                  <span className="font-bold">{formData.mobile}</span>
                </div>
              </div>
            </div>

            <div className="py-4">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8e653e] font-mono block mb-3">
                02. Academic Institution
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#14233c]">
                <div>
                  <span className="text-[#64748b] text-xs block">Institution:</span>
                  <span className="font-bold">{formData.college}</span>
                </div>
                <div>
                  <span className="text-[#64748b] text-xs block">Degree & Year:</span>
                  <span className="font-bold">
                    {formData.academicProgram} ({formData.yearOfStudy})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8e653e] font-mono block mb-3">
                03. Selected Tracks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#14233c]">
                <div>
                  <span className="text-[#64748b] text-xs block">Program:</span>
                  <span className="font-bold">{selectedProgramObj?.name}</span>
                </div>
                <div>
                  <span className="text-[#64748b] text-xs block">Internship:</span>
                  <span className="font-bold">{selectedInternshipObj?.name}</span>
                </div>
                <div>
                  <span className="text-[#64748b] text-xs block">Duration:</span>
                  <span className="font-bold text-[#a07142] font-mono">
                    {formData.duration}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748b] text-xs block">Credential Standing:</span>
                  <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
                    <CheckCircle2Icon className="size-3.5" />
                    <span>Included with QR verification</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Enrollment Gateway & Server-side Verification Notice */}
      {step === 5 && (
        <div className="flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf6ee] border border-[#d4af37]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8e653e] mb-2">
              <span>Step 05 of 05</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-[#14233c]">
              Enrollment & Fee Processing
            </h3>
            <p className="text-xs sm:text-sm text-[#596579] mt-1 leading-relaxed">
              Finalize enrollment processing and connect with the authenticated gateway service.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2dcce] bg-[#faf8f5] p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <InfoIcon className="size-5 text-[#8e653e] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-bold text-[#14233c]">
                  Architecture & Gateway Notice
                </span>
                <p className="text-[#596579] leading-relaxed text-xs">
                  In accordance with product security standards, payment processing requires server-side Razorpay order generation and cryptographic signature verification. No falsified success states are presented prior to live gateway verification.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#e2dcce] bg-white p-4 text-xs font-mono space-y-2 text-[#334155]">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Enrollment Track:</span>
                <span className="font-bold text-[#14233c]">
                  {selectedInternshipObj?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Candidate:</span>
                <span>{formData.fullName} ({formData.email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Committed Duration:</span>
                <span>{formData.duration}</span>
              </div>
              <div className="flex justify-between border-t border-[#ede7de] pt-2">
                <span className="text-[#64748b]">Total Program Fee:</span>
                <span className="font-bold text-base text-[#14233c] font-sans">
                  {PROGRAM_PRICING[formData.programSlug] || "₹2,999"}
                </span>
              </div>
            </div>

            {paymentStatus === "idle" && (
              <Button
                onClick={handleInitiateEnrollment}
                className="w-full gap-2 h-12 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white font-semibold text-sm shadow-xs transition-all"
              >
                <CreditCardIcon className="size-4 text-[#d4af37]" />
                Proceed to Payment Gateway
              </Button>
            )}

            {paymentStatus === "loading" && (
              <div className="flex items-center justify-center gap-2 py-3 text-sm text-[#64748b]">
                <span className="size-4 animate-spin rounded-full border-2 border-[#14233c] border-t-transparent" />
                <span>Connecting with order preparation service...</span>
              </div>
            )}

            {paymentStatus === "unavailable" && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-950 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#14233c]">
                  <AlertCircleIcon className="size-4 text-amber-600" />
                  <span>Payment Gateway Standby</span>
                </div>
                <p className="leading-relaxed text-[#596579]">{paymentMessage}</p>
                <p className="text-[#7388a1]">
                  Your enrollment draft has been constructed and validated. You can edit selections or proceed to explore programs while gateway keys are provisioned.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-[#ede7de] pt-6">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-1.5 text-xs rounded-xl border-[#e2dcce] text-[#14233c] hover:bg-[#faf8f5] font-semibold"
          >
            <ArrowLeftIcon className="size-3.5" />
            Previous
          </Button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <Button
            type="button"
            size="sm"
            onClick={handleNext}
            className="gap-1.5 text-xs rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white font-semibold shadow-xs"
          >
            Continue
            <ArrowRightIcon className="size-3.5" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            className="text-xs text-[#64748b] hover:text-[#14233c] font-semibold"
          >
            Start Over
          </Button>
        )}
      </div>
    </div>
  )
}
