import * as React from "react"
import {
  Briefcase,
  GraduationCap,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Award,
  UserCheck,
  CreditCard,
} from "lucide-react"
import type { EnrollmentRecordItem } from "@/lib/services/enrollments"

interface EnrollmentsDataTableProps {
  items: EnrollmentRecordItem[]
  isLoading?: boolean
  onExtend: (enrollment: EnrollmentRecordItem) => void
  onEdit: (enrollment: EnrollmentRecordItem) => void
  onDelete: (enrollment: EnrollmentRecordItem) => void
  onRecordPayment: (enrollment: EnrollmentRecordItem) => void
}

export function EnrollmentsDataTable({
  items,
  isLoading,
  onExtend,
  onEdit,
  onDelete,
  onRecordPayment,
}: EnrollmentsDataTableProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<number | null>(null)

  // Close menus on outside click
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null)
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full bg-card rounded-2xl border border-border/80 p-12 text-center">
        <div className="w-8 h-8 border-2 border-[#b8864d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-medium">Loading enrollments registry...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="w-full bg-card rounded-2xl border border-dashed border-border/80 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-accent/50 text-muted-foreground flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No enrollments found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          No student enrollments match your current filters. Enroll a student using the button above.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-accent/20 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <th className="py-3.5 px-4 pl-6">Student Candidate</th>
              <th className="py-3.5 px-4">Program Track</th>
              <th className="py-3.5 px-4">Duration & Timeline</th>
              <th className="py-3.5 px-4">Internship Extension</th>
              <th className="py-3.5 px-4">Progress & Grade</th>
              <th className="py-3.5 px-4">Status & Payment</th>
              <th className="py-3.5 px-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {items.map((item) => {
              const isInternship = item.program?.type === "INTERNSHIP"
              const effectiveEndDate = item.extendedUntil
                ? new Date(item.extendedUntil)
                : item.expectedEndDate
                ? new Date(item.expectedEndDate)
                : null

              return (
                <tr
                  key={item.id}
                  className="hover:bg-accent/30 transition-colors group"
                >
                  {/* Column 1: Candidate */}
                  <td className="py-4 px-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14233c] to-[#20365c] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                        {item.user?.name ? item.user.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          {item.user?.name || "Student"}
                        </div>
                        <div className="text-muted-foreground text-[11px]">
                          {item.user?.email || "No email"}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                          {item.enrollmentNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Program Track */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            isInternship
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {isInternship ? (
                            <Briefcase className="w-3 h-3" />
                          ) : (
                            <GraduationCap className="w-3 h-3" />
                          )}
                          {item.program?.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {item.program?.slug}
                        </span>
                      </div>
                      <div className="font-medium text-foreground line-clamp-1 max-w-[200px]">
                        {item.program?.title}
                      </div>
                      {item.mentorName && (
                        <div className="text-[10px] text-muted-foreground">
                          Mentor: <span className="font-medium text-foreground/80">{item.mentorName}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Column 3: Duration & Timeline */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="text-foreground font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {item.startDate
                          ? new Date(item.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Immediate"}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <span>End:</span>
                        <span className="font-semibold text-foreground">
                          {effectiveEndDate
                            ? effectiveEndDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Self-paced"}
                        </span>
                      </div>
                      {item.durationWeeks && (
                        <div className="text-[10px] text-muted-foreground">
                          Base: {item.durationWeeks} Weeks ({item.durationMonths || Math.round(item.durationWeeks / 4)} Mos)
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Column 4: Extension Status */}
                  <td className="py-4 px-4">
                    {item.isExtended ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          +{item.extendedWeeks} Wks Extended
                        </span>
                        {item.lastExtensionReason && (
                          <p className="text-[10px] text-muted-foreground italic line-clamp-1 max-w-[170px]" title={item.lastExtensionReason}>
                            "{item.lastExtensionReason}"
                          </p>
                        )}
                      </div>
                    ) : isInternship ? (
                      <button
                        type="button"
                        onClick={() => onExtend(item)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-[#b8864d] hover:bg-[#b8864d]/10 border border-[#b8864d]/30 transition-colors"
                      >
                        <Clock className="w-3 h-3" />
                        Extend Duration
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Standard</span>
                    )}
                  </td>

                  {/* Column 5: Progress & Grade */}
                  <td className="py-4 px-4">
                    <div className="space-y-1.5 min-w-[110px]">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-semibold text-foreground">{item.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-accent rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#b8864d] to-[#e4b574] h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, item.progressPercent))}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {item.grade ? (
                          <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <Award className="w-2.5 h-2.5" /> Grade: {item.grade}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No grade yet</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 6: Status & Payment */}
                  <td className="py-4 px-4">
                    <div className="space-y-1.5">
                      <div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : item.status === "EXTENDED"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                              : item.status === "COMPLETED"
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-[10px]">
                        <span
                          className={`font-semibold ${
                            item.paymentStatus === "PAID"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : item.paymentStatus === "PARTIALLY_PAID"
                              ? "text-amber-600 dark:text-amber-400"
                              : item.paymentStatus === "WAIVED" || item.paymentStatus === "FREE"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                        {item.amountPaid !== null && item.amountPaid !== undefined && (
                          <span className="text-muted-foreground ml-1">
                            (₹{Number(item.amountPaid).toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 7: Actions Dropdown & Quick Trigger */}
                  <td className="py-4 px-4 pr-6 text-right">
                    <div className="relative inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {/* Primary Quick Button: Extend for Internship */}
                      {isInternship && (
                        <button
                          type="button"
                          onClick={() => onExtend(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium text-xs flex items-center gap-1 border border-amber-500/20 transition-colors"
                          title="Extend Internship Duration"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Extend</span>
                        </button>
                      )}

                      {/* Dropdown Menu Trigger */}
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="w-8 h-8 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-xl py-1.5 z-20 text-left animate-in fade-in-50 zoom-in-95">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null)
                              onRecordPayment(item)
                            }}
                            className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors font-medium text-emerald-600 dark:text-emerald-400"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Record Fee Payment
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null)
                              onEdit(item)
                            }}
                            className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#b8864d]" />
                            Edit Progress & Grade
                          </button>

                          {isInternship && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null)
                                onExtend(item)
                              }}
                              className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors"
                            >
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              Extend Internship Period
                            </button>
                          )}

                          <a
                            href="/admin/certificates"
                            className="w-full px-3 py-2 text-xs text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors font-medium text-amber-700 dark:text-amber-400"
                          >
                            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                            {item.certificateIssued ? "View Certificate" : "Issue Certificate"}
                          </a>

                          <div className="my-1 border-t border-border" />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null)
                              onDelete(item)
                            }}
                            className="w-full px-3 py-2 text-xs text-destructive hover:bg-destructive/10 flex items-center gap-2.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Unenroll / Delete Record
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
