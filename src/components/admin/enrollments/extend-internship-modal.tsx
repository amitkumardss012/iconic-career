import * as React from "react"
import { toast } from "sonner"
import {
  X,
  Calendar,
  Clock,
  ArrowRight,
  History,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  ShieldCheck,
} from "lucide-react"
import { extendInternshipFn } from "@/lib/server/enrollments"
import type { EnrollmentRecordItem, ExtensionHistoryItem } from "@/lib/services/enrollments"

interface ExtendInternshipModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  enrollment: EnrollmentRecordItem | null
}

const EXTENSION_PRESETS = [
  { label: "+2 Weeks", weeks: 2 },
  { label: "+4 Weeks (1 Mo)", weeks: 4, popular: true },
  { label: "+8 Weeks (2 Mos)", weeks: 8 },
  { label: "+12 Weeks (3 Mos)", weeks: 12 },
]

export function ExtendInternshipModal({
  isOpen,
  onClose,
  onSuccess,
  enrollment,
}: ExtendInternshipModalProps) {
  const [addedWeeks, setAddedWeeks] = React.useState<number>(4)
  const [isCustom, setIsCustom] = React.useState(false)
  const [reason, setReason] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      setAddedWeeks(4)
      setIsCustom(false)
      setReason("")
      setErrorMessage(null)
    }
  }, [isOpen])

  if (!isOpen || !enrollment) return null

  // Current effective end date
  const currentEffectiveEndDate = enrollment.extendedUntil
    ? new Date(enrollment.extendedUntil)
    : enrollment.expectedEndDate
    ? new Date(enrollment.expectedEndDate)
    : new Date()

  // Calculate live new end date after adding weeks
  const liveNewEndDate = new Date(currentEffectiveEndDate.getTime())
  liveNewEndDate.setDate(liveNewEndDate.getDate() + (addedWeeks || 0) * 7)

  // Parse extension history
  let historyList: ExtensionHistoryItem[] = []
  if (Array.isArray(enrollment.extensionHistory)) {
    historyList = enrollment.extensionHistory as any as ExtensionHistoryItem[]
  }

  const handleSelectPreset = (weeks: number) => {
    setIsCustom(false)
    setAddedWeeks(weeks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!addedWeeks || addedWeeks <= 0) {
      setErrorMessage("Please select or enter a valid number of weeks to extend.")
      return
    }

    if (!reason.trim() || reason.trim().length < 5) {
      setErrorMessage("Please provide a meaningful reason for extending the internship (min 5 characters).")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await extendInternshipFn({
        data: {
          enrollmentId: enrollment.id,
          addedWeeks: Number(addedWeeks),
          reason: reason.trim(),
        },
      })

      const newEndStr = res.extendedUntil
        ? new Date(res.extendedUntil).toLocaleDateString()
        : liveNewEndDate.toLocaleDateString()

      toast.success(
        `Internship extended by +${addedWeeks} weeks! New end date: ${newEndStr}`
      )
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Extension error:", err)
      setErrorMessage(err.message || "Failed to extend internship period. Please try again.")
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                Extend Internship Period
              </h2>
              <p className="text-xs text-white/70">
                Grant additional duration, update milestone deadlines & record audit trail
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
          {/* Section 1: Candidate & Current Internship Summary */}
          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-muted-foreground">
                  {enrollment.enrollmentNumber}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {enrollment.user?.name || "Student"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {enrollment.program?.title} ({enrollment.program?.slug})
                </p>
              </div>

              {enrollment.isExtended && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5" />
                  Previously Extended +{enrollment.extendedWeeks} Wks
                </div>
              )}
            </div>

            {/* Timeline comparison banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-background/80 border border-border/60">
                <span className="text-muted-foreground block mb-0.5">Commenced On</span>
                <span className="font-medium text-foreground">
                  {enrollment.startDate
                    ? new Date(enrollment.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not set"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-background/80 border border-border/60">
                <span className="text-muted-foreground block mb-0.5">Current Deadline</span>
                <span className="font-semibold text-foreground">
                  {currentEffectiveEndDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Quick Duration Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-[#b8864d]" />
                Select Additional Duration Period <span className="text-destructive">*</span>
              </label>
              <span className="text-xs font-semibold text-[#b8864d]">
                +{addedWeeks} Weeks Added
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXTENSION_PRESETS.map((preset) => {
                const isSelected = !isCustom && addedWeeks === preset.weeks
                return (
                  <button
                    key={preset.weeks}
                    type="button"
                    onClick={() => handleSelectPreset(preset.weeks)}
                    className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "bg-[#14233c] text-white border-[#14233c] shadow-md ring-1 ring-[#b8864d]"
                        : "bg-background text-foreground border-border hover:border-[#b8864d]/60"
                    }`}
                  >
                    <span className="font-semibold">{preset.label}</span>
                    {preset.popular && (
                      <span className="text-[10px] text-[#b8864d] font-medium flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> Recommended
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Custom weeks toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-xs font-medium text-[#b8864d] hover:underline"
              >
                {isCustom ? "← Use preset intervals" : "+ Specify custom number of weeks"}
              </button>

              {isCustom && (
                <div className="mt-2 w-48">
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Extension Weeks
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={addedWeeks}
                    onChange={(e) => setAddedWeeks(parseInt(e.target.value, 10) || 1)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Live Date Transition Visualizer */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-background to-emerald-500/10 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                Current End Date
              </span>
              <span className="text-sm font-semibold text-foreground">
                {currentEffectiveEndDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="px-2.5 py-1 rounded-full bg-accent text-[11px] font-bold text-[#b8864d] border border-border">
                +{addedWeeks} Weeks
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold block flex items-center justify-center sm:justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" /> Revised Deadline
              </span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {liveNewEndDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Section 4: Mandatory Reason for Audit Log */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b8864d]" />
              Reason for Extension (Audit Log) <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Student requested an additional month for industry project deployment & mentor sign-off."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all resize-none"
            />
          </div>

          {/* Section 5: Previous Extension History Viewer (if any) */}
          {historyList.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <History className="w-3.5 h-3.5" />
                <span>Extension History & Audit Log ({historyList.length})</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {historyList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-2.5 rounded-lg bg-accent/30 border border-border/50 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        +{item.addedWeeks} Weeks Added
                      </span>
                      <span>
                        {item.extendedAt
                          ? new Date(item.extendedAt).toLocaleDateString()
                          : "Unknown date"}
                      </span>
                    </div>
                    <p className="text-foreground/90 italic">"{item.reason}"</p>
                    {item.extendedByAdminName && (
                      <span className="text-[10px] text-muted-foreground block">
                        Logged by: {item.extendedByAdminName}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={isSubmitting || !addedWeeks || !reason.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Extension...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Confirm +{addedWeeks} Wks Extension
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
