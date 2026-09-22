import * as React from "react"
import {
  GraduationCapIcon,
  Building2Icon,
  BookOpenIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRegistrationStore } from "@/lib/stores/registration-store"

const POPULAR_DEPARTMENTS = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Electronics & Communication (ECE)",
  "Mechanical Engineering",
  "Civil Engineering",
  "Commerce & Finance (B.Com / M.Com)",
  "Computer Applications (BCA / MCA)",
  "Business Administration (BBA / MBA)",
  "Science & Physics/Chemistry (B.Sc / M.Sc)",
  "Arts & Social Sciences (B.A / M.A)",
  "Law & Legal Studies",
  "Other / Multidisciplinary",
]

const DEGREE_LEVELS = [
  { value: "UG", label: "UG (Bachelor's)" },
  { value: "PG", label: "PG (Master's)" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "DOCTORATE", label: "Doctorate" },
  { value: "OTHER", label: "Other" },
]

interface StepAcademicDetailsProps {
  onBack: () => void
  onNext: () => void
}

export function StepAcademicDetails({ onBack, onNext }: StepAcademicDetailsProps) {
  const formData = useRegistrationStore((s) => s.formData)
  const setField = useRegistrationStore((s) => s.setField)
  const errors = useRegistrationStore((s) => s.errors)
  const setErrors = useRegistrationStore((s) => s.setErrors)
  const isLoading = useRegistrationStore((s) => s.isLoading)
  const generateRegistrationNumber = useRegistrationStore((s) => s.generateRegistrationNumber)

  const handleGenerateReg = () => {
    const generated = generateRegistrationNumber()
    toast.success(`Generated candidate registration number: ${generated}`)
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    const step2Errors: Record<string, string> = {}

    if (!formData.college || formData.college.trim().length < 2) {
      step2Errors.college = "College / Institute name is required."
    }
    if (!formData.course || formData.course.trim().length < 2) {
      step2Errors.course = "Course / Degree of study is required."
    }

    setErrors(step2Errors)
    if (Object.keys(step2Errors).length > 0) {
      const firstErr = Object.values(step2Errors)[0]
      toast.error(firstErr)
      return
    }

    onNext()
  }

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 pb-1 border-b border-[#ede7de]">
          <GraduationCapIcon className="size-3.5 text-[#a07142]" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#14233c]">
            Institutional & Academic Credentials
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* College / Institute Name */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="reg-college" className="text-[11px] font-semibold text-[#14233c]">
              College / Institute Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Building2Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-college"
                type="text"
                placeholder="e.g. Indian Institute of Information Technology"
                value={formData.college}
                onChange={(e) => setField("college", e.target.value)}
                disabled={isLoading}
                className={`pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.college ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
            </div>
            {errors.college && <span className="text-[10.5px] text-destructive font-medium">{errors.college}</span>}
          </div>

          {/* University / Affiliating Board */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="reg-university" className="text-[11px] font-semibold text-[#14233c]">
              University / Affiliating Board
            </Label>
            <div className="relative">
              <GraduationCapIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-university"
                type="text"
                placeholder="e.g. Visvesvaraya Technological University (VTU) / State Board"
                value={formData.university || ""}
                onChange={(e) => setField("university", e.target.value)}
                disabled={isLoading}
                className="pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
              />
            </div>
          </div>

          {/* Degree Level */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label className="text-[11px] font-semibold text-[#14233c]">Degree Level</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {DEGREE_LEVELS.map((dl) => (
                <button
                  key={dl.value}
                  type="button"
                  onClick={() => setField("degreeLevel", dl.value as any)}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all text-center truncate cursor-pointer ${
                    formData.degreeLevel === dl.value
                      ? "border-[#14233c] bg-[#14233c] text-white shadow-2xs font-semibold"
                      : "border-[#e2dcce] bg-[#faf8f5] text-[#596579] hover:bg-[#f6eee3] hover:text-[#14233c]"
                  }`}
                >
                  {dl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="reg-department" className="text-[11px] font-semibold text-[#14233c]">
              Department / Stream
            </Label>
            <div className="flex flex-col gap-1.5">
              <select
                id="reg-department-select"
                value={
                  POPULAR_DEPARTMENTS.includes(formData.department || "")
                    ? formData.department || ""
                    : formData.department
                    ? "CUSTOM"
                    : ""
                }
                onChange={(e) => {
                  const val = e.target.value
                  if (val === "CUSTOM") {
                    setField("department", "")
                  } else {
                    setField("department", val)
                  }
                }}
                className="h-9.5 rounded-xl bg-[#faf8f5] border border-[#e2dcce] text-xs text-[#14233c] px-3 focus-visible:ring-[#14233c]"
              >
                <option value="">-- Select Academic Department --</option>
                {POPULAR_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
                <option value="CUSTOM">Custom / Enter Manually...</option>
              </select>

              {(!POPULAR_DEPARTMENTS.includes(formData.department || "") ||
                formData.department === "") && (
                <Input
                  id="reg-department"
                  type="text"
                  placeholder="Or type department name..."
                  value={formData.department || ""}
                  onChange={(e) => setField("department", e.target.value)}
                  disabled={isLoading}
                  className="h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
                />
              )}
            </div>
          </div>

          {/* Course / Degree Name */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="reg-course" className="text-[11px] font-semibold text-[#14233c]">
              Course / Degree Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <BookOpenIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-course"
                type="text"
                placeholder="e.g. B.Tech Computer Science & Engineering"
                value={formData.course}
                onChange={(e) => setField("course", e.target.value)}
                disabled={isLoading}
                className={`pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.course ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
            </div>
            {errors.course && <span className="text-[10.5px] text-destructive font-medium">{errors.course}</span>}
          </div>

          {/* Subject / Specialization */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-subject" className="text-[11px] font-semibold text-[#14233c]">
              Subject / Specialization
            </Label>
            <Input
              id="reg-subject"
              type="text"
              placeholder="e.g. AI & Cloud Systems"
              value={formData.subject || ""}
              onChange={(e) => setField("subject", e.target.value)}
              disabled={isLoading}
              className="h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
            />
          </div>

          {/* Academic Session */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-session" className="text-[11px] font-semibold text-[#14233c]">
              Academic Session
            </Label>
            <Input
              id="reg-session"
              type="text"
              placeholder="e.g. 2024 - 2028"
              value={formData.session || ""}
              onChange={(e) => setField("session", e.target.value)}
              disabled={isLoading}
              className="h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
            />
          </div>

          {/* Registration Number with Auto-Generate */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reg-regNo" className="text-[11px] font-semibold text-[#14233c]">
                College Registration / Roll Number
              </Label>
              <button
                type="button"
                onClick={handleGenerateReg}
                className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#a07142] hover:text-[#14233c] hover:underline cursor-pointer"
              >
                <RefreshCwIcon className="size-2.5" />
                <span>Auto-Generate</span>
              </button>
            </div>
            <Input
              id="reg-regNo"
              type="text"
              placeholder="e.g. 1RV22CS045 or click Auto-Generate"
              value={formData.registrationNumber || ""}
              onChange={(e) => setField("registrationNumber", e.target.value)}
              disabled={isLoading}
              className="h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs font-mono text-[#14233c] focus-visible:ring-[#14233c]"
            />
          </div>
        </div>
      </div>

      {/* Step 2 Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto h-10 rounded-xl border-[#e2dcce] text-xs font-semibold text-[#14233c] hover:bg-[#f6eee3] gap-1.5 cursor-pointer"
        >
          <ArrowLeftIcon className="size-3.5" />
          <span>Back to Personal</span>
        </Button>
        <Button
          type="submit"
          className="w-full sm:flex-1 h-10 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white text-xs sm:text-sm font-semibold shadow-xs gap-1.5 transition-all cursor-pointer"
        >
          <span>Continue to Consent Letter (Step 3)</span>
          <ArrowRightIcon className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}
