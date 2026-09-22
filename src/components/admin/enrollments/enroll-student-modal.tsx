import * as React from "react"
import { toast } from "sonner"
import {
  X,
  GraduationCap,
  Briefcase,
  Calendar,
  Clock,
  User,
  CreditCard,
  UserCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  FileText,
} from "lucide-react"
import { createEnrollmentFn } from "@/lib/server/enrollments"
import { getStudentsListFn } from "@/lib/server/students"
import { getProgramsListFn } from "@/lib/server/programs"

interface EnrollStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface StudentOption {
  id: number
  name: string
  email: string
  college?: string | null
}

interface ProgramOption {
  id: number
  title: string
  slug: string
  type: "COURSE" | "INTERNSHIP"
  duration: string | null
  price: number
}

const DURATION_PRESETS = [
  { label: "4 Weeks (1 Mo)", weeks: 4, months: 1 },
  { label: "8 Weeks (2 Mos)", weeks: 8, months: 2, popular: true },
  { label: "12 Weeks (3 Mos)", weeks: 12, months: 3 },
  { label: "16 Weeks (4 Mos)", weeks: 16, months: 4 },
  { label: "24 Weeks (6 Mos)", weeks: 24, months: 6 },
]

export const generateFrontendEnrollmentNumber = () => {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(10000 + Math.random() * 90000)
  return `ENR-${year}-${randomSuffix}`
}

export function EnrollStudentModal({ isOpen, onClose, onSuccess }: EnrollStudentModalProps) {
  const [students, setStudents] = React.useState<StudentOption[]>([])
  const [programs, setPrograms] = React.useState<ProgramOption[]>([])
  const [loadingOptions, setLoadingOptions] = React.useState(false)

  // Form states
  const [enrollmentNumber, setEnrollmentNumber] = React.useState<string>(() => generateFrontendEnrollmentNumber())
  const [selectedUserId, setSelectedUserId] = React.useState<number | "">("")
  const [selectedProgramId, setSelectedProgramId] = React.useState<number | "">("")
  const [startDate, setStartDate] = React.useState<string>(() => new Date().toISOString().split("T")[0])
  const [durationWeeks, setDurationWeeks] = React.useState<number>(8)
  const [durationMonths, setDurationMonths] = React.useState<number>(2)
  const [isCustomDuration, setIsCustomDuration] = React.useState(false)
  const [paymentStatus, setPaymentStatus] = React.useState<"FREE" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "PENDING">("PAID")
  const [amountPaid, setAmountPaid] = React.useState<string>("")
  const [mentorName, setMentorName] = React.useState<string>("")
  const [mentorEmail, setMentorEmail] = React.useState<string>("")
  const [adminNotes, setAdminNotes] = React.useState<string>("")

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Fetch student and program list when modal opens
  React.useEffect(() => {
    if (!isOpen) return

    setEnrollmentNumber(generateFrontendEnrollmentNumber())
    let isMounted = true
    setLoadingOptions(true)
    setErrorMessage(null)

    Promise.all([
      getStudentsListFn({ data: { limit: 100, page: 1 } }),
      getProgramsListFn({ data: { limit: 100, page: 1 } }),
    ])
      .then(([studentsRes, programsRes]) => {
        if (!isMounted) return
        const studentItems = (studentsRes as any)?.data || []
        const programItems = (programsRes as any)?.data || []

        setStudents(
          studentItems.map((s: any) => ({
            id: s.userId || s.id,
            name: s.name,
            email: s.email,
            college: s.college,
          }))
        )

        setPrograms(
          programItems.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            type: p.type,
            duration: p.duration,
            price: Number(p.price || 0),
          }))
        )
      })
      .catch((err) => {
        if (!isMounted) return
        console.error("Error loading options for enrollment:", err)
      })
      .finally(() => {
        if (isMounted) setLoadingOptions(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen])

  // Find currently selected program
  const selectedProgram = React.useMemo(() => {
    if (!selectedProgramId) return null
    return programs.find((p) => p.id === Number(selectedProgramId)) || null
  }, [selectedProgramId, programs])

  // Automatically update amount when program changes
  React.useEffect(() => {
    if (selectedProgram) {
      setAmountPaid(String(selectedProgram.price || 0))
    }
  }, [selectedProgram])

  // Live calculate expected end date
  const calculatedEndDate = React.useMemo(() => {
    if (!startDate) return null
    const start = new Date(startDate)
    if (isNaN(start.getTime())) return null

    const end = new Date(start.getTime())
    if (selectedProgram?.type === "INTERNSHIP") {
      end.setDate(end.getDate() + durationWeeks * 7)
    } else {
      // For general courses, default to 8 weeks or parsed duration
      end.setDate(end.getDate() + 8 * 7)
    }
    return end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }, [startDate, durationWeeks, selectedProgram])

  if (!isOpen) return null

  const handleSelectPreset = (preset: typeof DURATION_PRESETS[0]) => {
    setIsCustomDuration(false)
    setDurationWeeks(preset.weeks)
    setDurationMonths(preset.months)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedUserId) {
      setErrorMessage("Please select a student to enroll.")
      return
    }
    if (!selectedProgramId) {
      setErrorMessage("Please select a program/internship.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createEnrollmentFn({
        data: {
          enrollmentNumber: enrollmentNumber.trim() || undefined,
          userId: Number(selectedUserId),
          programId: Number(selectedProgramId),
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          durationWeeks: selectedProgram?.type === "INTERNSHIP" ? durationWeeks : undefined,
          durationMonths: selectedProgram?.type === "INTERNSHIP" ? durationMonths : undefined,
          paymentStatus,
          amountPaid: amountPaid ? Number(amountPaid) : undefined,
          mentorName: mentorName.trim() || undefined,
          mentorEmail: mentorEmail.trim() || undefined,
          adminNotes: adminNotes.trim() || undefined,
          source: "ADMIN_MANUAL",
        },
      })

      toast.success(
        `Enrolled ${res.user?.name || "Student"} into ${res.program?.title}! (${res.enrollmentNumber})`
      )
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Enrollment error:", err)
      setErrorMessage(err.message || "Failed to create enrollment. Please check the inputs and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1726]/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="relative bg-[#14233c] text-white px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b8864d] to-[#e4b574] text-white flex items-center justify-center shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                Enroll Student in Program
              </h2>
              <p className="text-xs text-white/70">
                Grant program access, configure internship duration, and assign mentorship
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Enrollment ID / Serial Number */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-accent/30 border border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#b8864d]" />
                Enrollment Number / ID
              </label>
              <button
                type="button"
                onClick={() => setEnrollmentNumber(generateFrontendEnrollmentNumber())}
                className="text-xs font-semibold text-[#b8864d] hover:text-[#966432] flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-[#b8864d]/10"
                title="Auto-generate a new unique enrollment number"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Generate
              </button>
            </div>
            <input
              type="text"
              value={enrollmentNumber}
              onChange={(e) => setEnrollmentNumber(e.target.value)}
              placeholder="e.g. ENR-2026-00892"
              className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
            />
            <p className="text-[11px] text-muted-foreground">
              Auto-generated unique tracking ID. You can manually edit or regenerate anytime.
            </p>
          </div>
          {/* Section 1: Candidate & Program Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#b8864d]" />
                Select Student <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
                disabled={loadingOptions || isSubmitting}
                required
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              >
                <option value="">-- Choose Candidate --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email}) {student.college ? `- ${student.college}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Program Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#b8864d]" />
                Select Program / Track <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value ? Number(e.target.value) : "")}
                disabled={loadingOptions || isSubmitting}
                required
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              >
                <option value="">-- Choose Program or Internship --</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    [{program.type}] {program.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Program Type Badge & Details */}
          {selectedProgram && (
            <div className="p-4 rounded-xl bg-accent/40 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    selectedProgram.type === "INTERNSHIP"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                      : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                  }`}
                >
                  {selectedProgram.type === "INTERNSHIP" ? (
                    <Briefcase className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{selectedProgram.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Slug: <span className="font-mono text-foreground/80">{selectedProgram.slug}</span> • Standard Duration:{" "}
                    {selectedProgram.duration || "N/A"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">List Price</span>
                <span className="text-sm font-bold text-foreground">₹{selectedProgram.price.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Section 3: Internship Duration Configurator (Only when INTERNSHIP is chosen) */}
          {selectedProgram?.type === "INTERNSHIP" && (
            <div className="space-y-3 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Internship Duration Period <span className="text-destructive">*</span>
                </label>
                <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  {durationWeeks} Weeks ({durationMonths} {durationMonths === 1 ? "Month" : "Months"})
                </span>
              </div>

              {/* Preset Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {DURATION_PRESETS.map((preset) => {
                  const isSelected = !isCustomDuration && durationWeeks === preset.weeks
                  return (
                    <button
                      key={preset.weeks}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? "bg-[#14233c] text-white border-[#14233c] shadow-sm ring-1 ring-[#b8864d]"
                          : "bg-background text-foreground border-border hover:border-amber-400"
                      }`}
                    >
                      <span>{preset.label}</span>
                      {preset.popular && (
                        <span className="text-[10px] text-[#b8864d] font-semibold flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Popular
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Custom Duration Toggle & Inputs */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(!isCustomDuration)}
                  className="text-xs font-medium text-[#b8864d] hover:underline"
                >
                  {isCustomDuration ? "← Use standard presets" : "+ Specify custom weeks / months"}
                </button>
              </div>

              {isCustomDuration && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Duration in Weeks
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={104}
                      value={durationWeeks}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 1
                        setDurationWeeks(val)
                        setDurationMonths(Math.max(1, Math.round(val / 4.33)))
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Duration in Months
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={durationMonths}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 1
                        setDurationMonths(val)
                        setDurationWeeks(val * 4)
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Schedule & Timeline Calculation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#b8864d]" />
                Commencement / Start Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live Expected End Date
              </label>
              <div className="w-full h-10 px-3.5 rounded-xl border border-border bg-accent/30 text-sm font-semibold text-foreground flex items-center">
                {calculatedEndDate || "Select a valid start date"}
              </div>
            </div>
          </div>

          {/* Section 5: Financials & Payment Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#b8864d]" />
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e: any) => setPaymentStatus(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              >
                <option value="PAID">PAID (Full Cleared)</option>
                <option value="PARTIALLY_PAID">PARTIALLY_PAID (Installment)</option>
                <option value="PENDING">PENDING (Unpaid)</option>
                <option value="WAIVED">WAIVED (Scholarship/Complimentary)</option>
                <option value="FREE">FREE (No Charge)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount Paid (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              />
            </div>
          </div>

          {/* Section 6: Assigned Mentor Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mentor Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Aryan Mehta"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mentor Email (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. aryan.m@iconiccareer.com"
                value={mentorEmail}
                onChange={(e) => setMentorEmail(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              />
            </div>
          </div>

          {/* Section 7: Administrative Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Internal Admin Notes / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Enrolled under Special Academic Batch 2026. Prior coursework verified."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-accent text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loadingOptions || !selectedUserId || !selectedProgramId}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#14233c] to-[#20365c] hover:from-[#1c3052] hover:to-[#2b487b] text-white text-sm font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enrolling Student...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-[#e4b574]" />
                  Confirm Enrollment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
