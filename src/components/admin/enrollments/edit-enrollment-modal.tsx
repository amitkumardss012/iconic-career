import * as React from "react"
import { toast } from "sonner"
import {
  X,
  Edit,
  Award,
  BarChart2,
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  UserCheck,
  FileText,
} from "lucide-react"
import { updateEnrollmentFn } from "@/lib/server/enrollments"
import { getProgramsListFn } from "@/lib/server/programs"
import type { EnrollmentRecordItem } from "@/lib/services/enrollments"

interface EditEnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  enrollment: EnrollmentRecordItem | null
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
  { label: "8 Weeks (2 Mos)", weeks: 8, months: 2 },
  { label: "12 Weeks (3 Mos)", weeks: 12, months: 3 },
  { label: "16 Weeks (4 Mos)", weeks: 16, months: 4 },
  { label: "24 Weeks (6 Mos)", weeks: 24, months: 6 },
]

const generateFrontendEnrollmentNumber = () => {
  const year = new Date().getFullYear()
  const randomSuffix = Math.floor(10000 + Math.random() * 90000)
  return `ENR-${year}-${randomSuffix}`
}

export function EditEnrollmentModal({
  isOpen,
  onClose,
  onSuccess,
  enrollment,
}: EditEnrollmentModalProps) {
  // Programs options
  const [programs, setPrograms] = React.useState<ProgramOption[]>([])
  const [loadingPrograms, setLoadingPrograms] = React.useState(false)

  // Form states
  const [enrollmentNumber, setEnrollmentNumber] = React.useState<string>("")
  const [selectedProgramId, setSelectedProgramId] = React.useState<number | "">("")
  const [status, setStatus] = React.useState<
    "ACTIVE" | "COMPLETED" | "EXTENDED" | "PAUSED" | "CANCELLED" | "PENDING" | "EXPIRED"
  >("ACTIVE")
  const [startDate, setStartDate] = React.useState<string>("")
  const [expectedEndDate, setExpectedEndDate] = React.useState<string>("")
  const [actualEndDate, setActualEndDate] = React.useState<string>("")
  const [durationWeeks, setDurationWeeks] = React.useState<number>(8)
  const [durationMonths, setDurationMonths] = React.useState<number>(2)
  const [isCustomDuration, setIsCustomDuration] = React.useState(false)

  const [progressPercent, setProgressPercent] = React.useState<number>(0)
  const [grade, setGrade] = React.useState<string>("")
  const [mentorName, setMentorName] = React.useState<string>("")
  const [mentorEmail, setMentorEmail] = React.useState<string>("")
  const [paymentStatus, setPaymentStatus] = React.useState<
    "FREE" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "PENDING"
  >("PAID")
  const [amountPaid, setAmountPaid] = React.useState<string>("")
  const [paymentReference, setPaymentReference] = React.useState<string>("")
  const [certificateIssued, setCertificateIssued] = React.useState<boolean>(false)
  const [certificateId, setCertificateId] = React.useState<string>("")
  const [adminNotes, setAdminNotes] = React.useState<string>("")

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Fetch programs list on modal open
  React.useEffect(() => {
    if (!isOpen) return
    let isMounted = true
    setLoadingPrograms(true)

    getProgramsListFn({ data: { limit: 100, page: 1 } })
      .then((res: any) => {
        if (!isMounted) return
        const programItems = res?.data || []
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
        if (isMounted) console.error("Error loading programs for edit modal:", err)
      })
      .finally(() => {
        if (isMounted) setLoadingPrograms(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen])

  // Populate state when enrollment changes
  React.useEffect(() => {
    if (enrollment && isOpen) {
      setEnrollmentNumber(enrollment.enrollmentNumber || "")
      setSelectedProgramId(enrollment.programId || "")
      setStatus(enrollment.status as any)

      const start = enrollment.startDate ? new Date(enrollment.startDate).toISOString().split("T")[0] : ""
      setStartDate(start)

      const expEnd = enrollment.expectedEndDate
        ? new Date(enrollment.expectedEndDate).toISOString().split("T")[0]
        : ""
      setExpectedEndDate(expEnd)

      const actEnd = enrollment.actualEndDate
        ? new Date(enrollment.actualEndDate).toISOString().split("T")[0]
        : ""
      setActualEndDate(actEnd)

      const weeks = enrollment.durationWeeks || 8
      const months = enrollment.durationMonths || Math.round(weeks / 4) || 2
      setDurationWeeks(weeks)
      setDurationMonths(months)

      const isPreset = DURATION_PRESETS.some((p) => p.weeks === weeks)
      setIsCustomDuration(!isPreset)

      setProgressPercent(enrollment.progressPercent || 0)
      setGrade(enrollment.grade || "")
      setMentorName(enrollment.mentorName || "")
      setMentorEmail(enrollment.mentorEmail || "")
      setPaymentStatus(enrollment.paymentStatus as any)
      setAmountPaid(enrollment.amountPaid !== undefined && enrollment.amountPaid !== null ? String(enrollment.amountPaid) : "")
      setPaymentReference(enrollment.paymentReference || "")
      setCertificateIssued(enrollment.certificateIssued || false)
      setCertificateId(enrollment.certificateId || "")
      setAdminNotes(enrollment.adminNotes || "")
      setErrorMessage(null)
    }
  }, [enrollment, isOpen])

  const selectedProgram = React.useMemo(() => {
    if (!selectedProgramId) return null
    return programs.find((p) => p.id === Number(selectedProgramId)) || enrollment?.program || null
  }, [selectedProgramId, programs, enrollment])

  // Duration preset handler
  const handleSelectPreset = (preset: typeof DURATION_PRESETS[0]) => {
    setIsCustomDuration(false)
    setDurationWeeks(preset.weeks)
    setDurationMonths(preset.months)

    if (startDate) {
      const start = new Date(startDate)
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime())
        end.setDate(end.getDate() + preset.weeks * 7)
        setExpectedEndDate(end.toISOString().split("T")[0])
      }
    }
  }

  // Handle custom weeks change
  const handleWeeksChange = (weeks: number) => {
    setDurationWeeks(weeks)
    const months = Math.round(weeks / 4) || 1
    setDurationMonths(months)

    if (startDate) {
      const start = new Date(startDate)
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime())
        end.setDate(end.getDate() + weeks * 7)
        setExpectedEndDate(end.toISOString().split("T")[0])
      }
    }
  }

  if (!isOpen || !enrollment) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await updateEnrollmentFn({
        data: {
          id: enrollment.id,
          data: {
            enrollmentNumber: enrollmentNumber.trim() || undefined,
            programId: selectedProgramId ? Number(selectedProgramId) : undefined,
            status,
            startDate: startDate ? new Date(startDate).toISOString() : undefined,
            expectedEndDate: expectedEndDate ? new Date(expectedEndDate).toISOString() : undefined,
            actualEndDate: actualEndDate ? new Date(actualEndDate).toISOString() : null,
            durationWeeks: Number(durationWeeks) || undefined,
            durationMonths: Number(durationMonths) || undefined,
            progressPercent: Number(progressPercent),
            grade: grade.trim() || null,
            mentorName: mentorName.trim() || null,
            mentorEmail: mentorEmail.trim() || null,
            paymentStatus,
            amountPaid: amountPaid ? Number(amountPaid) : 0,
            paymentReference: paymentReference.trim() || null,
            certificateIssued,
            certificateId: certificateId.trim() || null,
            adminNotes: adminNotes.trim() || null,
          },
        },
      })

      toast.success(`Enrollment ${enrollmentNumber || enrollment.enrollmentNumber} updated successfully.`)
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Update error:", err)
      setErrorMessage(err.message || "Failed to update enrollment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1726]/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-[#14233c] text-white px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b8864d] to-[#e4b574] text-white flex items-center justify-center shadow-md">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                Edit Enrollment Details
              </h2>
              <p className="text-xs text-white/70">
                Update cohort schedule, duration, program track, payment, and milestones
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
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive text-sm shrink-0">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Candidate Overview & Program Track */}
          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-foreground">
                  {enrollment.user?.name || "Student"}
                </div>
                <div className="text-xs text-muted-foreground">{enrollment.user?.email}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                  Assigned Track Type
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-background border border-border">
                  {selectedProgram?.type === "INTERNSHIP" ? (
                    <Briefcase className="w-3 h-3 text-amber-500" />
                  ) : (
                    <GraduationCap className="w-3 h-3 text-blue-500" />
                  )}
                  {selectedProgram?.type || "COURSE"}
                </span>
              </div>
            </div>

            {/* Editable Enrollment Number Input with Auto-Generate */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#b8864d]" />
                  Enrollment Number / Tracking ID
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
            </div>

            {/* Change Program Track Dropdown */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#b8864d]" />
                Enrolled Program / Internship Track
              </label>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(Number(e.target.value))}
                disabled={loadingPrograms}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.type}] {p.title} ({p.duration || "Self-Paced"}) - ₹{p.price.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Timeline Schedule & Duration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#b8864d]" />
              Schedule & Internship Duration
            </h4>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#b8864d]" />
                Select Duration Period
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {DURATION_PRESETS.map((preset) => {
                  const isSelected = !isCustomDuration && durationWeeks === preset.weeks
                  return (
                    <button
                      key={preset.weeks}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                        isSelected
                          ? "bg-[#14233c] text-white border-[#14233c] shadow-sm"
                          : "bg-background border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      <div className="font-bold">{preset.weeks} Wks</div>
                      <div className="text-[10px] opacity-75 font-normal">{preset.months} Mo</div>
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(true)}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    isCustomDuration
                      ? "bg-[#14233c] text-white border-[#14233c] shadow-sm"
                      : "bg-background border-border text-foreground hover:bg-accent"
                  }`}
                >
                  <div className="font-bold">Custom</div>
                  <div className="text-[10px] opacity-75 font-normal">Weeks</div>
                </button>
              </div>
            </div>

            {/* Custom duration inputs */}
            {isCustomDuration && (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-accent/30 border border-border">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Duration (Weeks)</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={durationWeeks}
                    onChange={(e) => handleWeeksChange(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#b8864d]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Duration (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#b8864d]"
                  />
                </div>
              </div>
            )}

            {/* Start Date & Expected End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Cohort Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    if (e.target.value) {
                      const start = new Date(e.target.value)
                      if (!isNaN(start.getTime())) {
                        const end = new Date(start.getTime())
                        end.setDate(end.getDate() + durationWeeks * 7)
                        setExpectedEndDate(end.toISOString().split("T")[0])
                      }
                    }
                  }}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Expected Completion Date</label>
                <input
                  type="date"
                  value={expectedEndDate}
                  onChange={(e) => setExpectedEndDate(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                />
              </div>
            </div>

            {/* Actual End Date (if completed) */}
            {status === "COMPLETED" && (
              <div className="space-y-1.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Actual Graduation / Completion Date
                </label>
                <input
                  type="date"
                  value={actualEndDate}
                  onChange={(e) => setActualEndDate(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-emerald-500/30 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            )}
          </div>

          {/* Section 3: Status & Curriculum Progress */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#b8864d]" />
              Lifecycle & Academic Progress
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Enrollment Status</label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                >
                  <option value="ACTIVE">ACTIVE (In Progress)</option>
                  <option value="EXTENDED">EXTENDED (Internship Extension Active)</option>
                  <option value="COMPLETED">COMPLETED (Graduated / Passed)</option>
                  <option value="PAUSED">PAUSED (On Leave)</option>
                  <option value="CANCELLED">CANCELLED (Withdrawn)</option>
                  <option value="PENDING">PENDING (Awaiting Confirmation)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Curriculum Progress ({progressPercent}%)
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercent}
                  onChange={(e) => setProgressPercent(Number(e.target.value))}
                  className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-[#b8864d] mt-3"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Evaluation Grade & Certificate */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#b8864d]" />
              Evaluation & Certification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Evaluation Grade</label>
                <input
                  type="text"
                  placeholder="e.g. A+, A, Distinction"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Certificate Serial Number / ID</label>
                <input
                  type="text"
                  placeholder="e.g. CERT-2026-ICONIC-941"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                />
              </div>
            </div>

            {/* Certificate Checkbox */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/30 border border-border">
              <input
                type="checkbox"
                id="certIssued"
                checked={certificateIssued}
                onChange={(e) => setCertificateIssued(e.target.checked)}
                className="w-4 h-4 rounded border-border text-[#b8864d] focus:ring-[#b8864d]"
              />
              <label htmlFor="certIssued" className="text-xs font-medium text-foreground cursor-pointer">
                Mark Certificate as Formally Issued to Candidate
              </label>
            </div>
          </div>

          {/* Section 5: Assigned Mentor */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#b8864d]" />
              Mentorship Assignment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Assigned Mentor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Aryan Mehta"
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Mentor Email</label>
                <input
                  type="email"
                  placeholder="e.g. aryan@iconiccareer.com"
                  value={mentorEmail}
                  onChange={(e) => setMentorEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Payment Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#b8864d]" />
              Payment & Billing Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e: any) => setPaymentStatus(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                >
                  <option value="PAID">PAID</option>
                  <option value="PARTIALLY_PAID">PARTIALLY_PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="WAIVED">WAIVED</option>
                  <option value="FREE">FREE</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Amount Paid (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Payment Reference / Txn ID</label>
                <input
                  type="text"
                  placeholder="e.g. TXN_2026_9410"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 7: Administrative Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Internal Admin Notes / Remarks</label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal tracking notes, special cohort arrangements..."
              className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#14233c] to-[#20365c] hover:from-[#1c3052] hover:to-[#2b487b] text-white text-sm font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#e4b574]" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
