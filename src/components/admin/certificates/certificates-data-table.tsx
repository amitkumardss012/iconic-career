import * as React from "react"
import { toast } from "sonner"
import {
  Award,
  Calendar,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  BookOpen,
} from "lucide-react"
import type { CertificateRecordItem } from "@/lib/services/certificates"
import {
  toggleCertificateDownloadFn,
  revokeCertificateFn,
  deleteCertificateFn,
} from "@/lib/server/certificates"

interface CertificatesDataTableProps {
  items: CertificateRecordItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onEdit: (cert: CertificateRecordItem) => void
  onRefresh: () => void
  isLoading?: boolean
}

export function CertificatesDataTable({
  items,
  pagination,
  onPageChange,
  onEdit,
  onRefresh,
  isLoading,
}: CertificatesDataTableProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<number | null>(null)
  const [revokingCert, setRevokingCert] = React.useState<CertificateRecordItem | null>(null)
  const [revokeReason, setRevokeReason] = React.useState("")
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [togglingId, setTogglingId] = React.useState<number | null>(null)

  // Copy certificate ID to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard", {
      description: `Certificate number ${text} copied.`,
    })
  }

  // Quick 1-click download permission toggle
  const handleToggleDownload = async (cert: CertificateRecordItem) => {
    try {
      setTogglingId(cert.id)
      const nextState = !cert.isDownloadAllowed
      await toggleCertificateDownloadFn({
        data: {
          certificateId: cert.id,
          isDownloadAllowed: nextState,
        },
      })

      toast.success(
        nextState ? "Download access granted" : "Download access locked",
        {
          description: `Certificate #${cert.certificateNumber} download permission updated.`,
        }
      )
      onRefresh()
    } catch (err: any) {
      toast.error("Failed to update download access", {
        description: err?.message || "An error occurred.",
      })
    } finally {
      setTogglingId(null)
    }
  }

  // Revoke certificate submit
  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!revokingCert) return

    try {
      await revokeCertificateFn({
        data: {
          certificateId: revokingCert.id,
          reason: revokeReason.trim() || "Revoked by administrative officer.",
        },
      })

      toast.success("Certificate revoked", {
        description: `Certificate #${revokingCert.certificateNumber} is now marked as REVOKED.`,
      })

      setRevokingCert(null)
      setRevokeReason("")
      onRefresh()
    } catch (err: any) {
      toast.error("Failed to revoke certificate", {
        description: err?.message || "An error occurred.",
      })
    }
  }

  // Delete certificate submit
  const handleDelete = async (cert: CertificateRecordItem) => {
    if (!window.confirm(`Are you sure you want to permanently delete certificate #${cert.certificateNumber}? This will unmark the enrollment as certified.`)) {
      return
    }

    try {
      setDeletingId(cert.id)
      await deleteCertificateFn({ data: { id: cert.id } })
      toast.success("Certificate deleted", {
        description: `Certificate #${cert.certificateNumber} has been removed.`,
      })
      onRefresh()
    } catch (err: any) {
      toast.error("Failed to delete certificate", {
        description: err?.message || "An error occurred.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="rounded-2xl border border-[#e2dcce] bg-white shadow-xs overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-[#e2dcce] bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              <th className="py-3.5 px-4">Certificate Number</th>
              <th className="py-3.5 px-4">Recipient Student</th>
              <th className="py-3.5 px-4">Program & Track</th>
              <th className="py-3.5 px-4">Issue Date</th>
              <th className="py-3.5 px-4">Standing / Grade</th>
              <th className="py-3.5 px-4 text-center">Download Access</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2dcce]/70 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#64748b]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-4 rounded-full border-2 border-[#b8864d] border-t-transparent animate-spin" />
                    <span>Loading certificate records...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#64748b]">
                  <Award className="size-8 text-[#b8864d]/40 mx-auto mb-2" />
                  <p className="font-semibold text-[#14233c]">No certificates issued yet</p>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Click "Issue Certificate" above to create verifiable credentials for enrolled students.
                  </p>
                </td>
              </tr>
            ) : (
              items.map((cert) => {
                const snapshot = cert.snapshotData as any
                const recipientName = snapshot?.recipientName || cert.user?.name || "Student"
                const college = snapshot?.college || cert.user?.studentProfile?.college || "College Not Listed"
                const programTitle = snapshot?.programTitle || cert.program?.title || "Program"
                const programType = snapshot?.programType || cert.program?.type || "COURSE"

                return (
                  <tr key={cert.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* 1. Certificate # */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#14233c] bg-slate-100 px-2 py-1 rounded-md border border-[#e2dcce]">
                          {cert.certificateNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(cert.certificateNumber)}
                          title="Copy Certificate Number"
                          className="text-[#64748b] hover:text-[#14233c] p-1 rounded-md transition-colors"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#64748b] block mt-0.5">
                        Enrollment: {cert.enrollment?.enrollmentNumber || `#${cert.enrollmentId}`}
                      </span>
                    </td>

                    {/* 2. Recipient Student */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#14233c]">{recipientName}</div>
                      <div className="text-xs text-[#64748b] truncate max-w-[200px]" title={college}>
                        {college}
                      </div>
                    </td>

                    {/* 3. Program & Track */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#14233c] text-xs max-w-[220px] truncate" title={programTitle}>
                        {programTitle}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                          programType === "INTERNSHIP"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {programType === "INTERNSHIP" ? (
                          <Briefcase className="size-2.5" />
                        ) : (
                          <BookOpen className="size-2.5" />
                        )}
                        {programType}
                      </span>
                    </td>

                    {/* 4. Issue Date */}
                    <td className="py-3.5 px-4 text-xs text-[#14233c]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-[#64748b]" />
                        <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                      </div>
                      {cert.validUntil && (
                        <span className="text-[10px] text-[#64748b] block mt-0.5">
                          Exp: {new Date(cert.validUntil).toLocaleDateString()}
                        </span>
                      )}
                    </td>

                    {/* 5. Grade & Percentage */}
                    <td className="py-3.5 px-4 text-xs">
                      {cert.grade || cert.percentage !== null ? (
                        <div>
                          {cert.grade && (
                            <span className="font-bold text-[#14233c] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px] mr-1">
                              {cert.grade}
                            </span>
                          )}
                          {cert.percentage !== null && cert.percentage !== undefined && (
                            <span className="text-[#64748b] font-medium">{cert.percentage}%</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">N/A</span>
                      )}
                    </td>

                    {/* 6. Download Permission (isDownloadAllowed) */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleDownload(cert)}
                        disabled={togglingId === cert.id}
                        title={cert.isDownloadAllowed ? "Click to lock download" : "Click to allow download"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                          cert.isDownloadAllowed
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                        }`}
                      >
                        {cert.isDownloadAllowed ? (
                          <>
                            <Unlock className="size-3 text-emerald-600" />
                            Allowed
                          </>
                        ) : (
                          <>
                            <Lock className="size-3 text-amber-600" />
                            Locked
                          </>
                        )}
                      </button>
                    </td>

                    {/* 7. Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          cert.status === "ISSUED"
                            ? "bg-emerald-100 text-emerald-800"
                            : cert.status === "REVOKED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>

                    {/* 8. Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(cert)}
                          className="flex items-center gap-1 rounded-lg border border-[#e2dcce] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#14233c] hover:border-[#b8864d] hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                          <Edit className="size-3.5 text-[#b8864d]" />
                          <span>Edit</span>
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === cert.id ? null : cert.id)}
                            className="rounded-lg p-1.5 text-[#64748b] hover:bg-slate-100 hover:text-[#14233c] transition-colors"
                          >
                            <MoreVertical className="size-4" />
                          </button>

                          {activeMenuId === cert.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-[#e2dcce] bg-white py-1.5 shadow-lg">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    onEdit(cert)
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#14233c] hover:bg-slate-50"
                                >
                                  <Edit className="size-3.5 text-[#b8864d]" />
                                  Edit All Fields
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    handleToggleDownload(cert)
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-[#14233c] hover:bg-slate-50"
                                >
                                  {cert.isDownloadAllowed ? (
                                    <>
                                      <Lock className="size-3.5 text-amber-600" />
                                      Lock Download
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="size-3.5 text-emerald-600" />
                                      Allow Download
                                    </>
                                  )}
                                </button>
                                {cert.status !== "REVOKED" && (
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null)
                                      setRevokingCert(cert)
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"
                                  >
                                    <AlertTriangle className="size-3.5" />
                                    Revoke Certificate
                                  </button>
                                )}
                                <div className="my-1 border-t border-[#e2dcce]/70" />
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null)
                                    handleDelete(cert)
                                  }}
                                  disabled={deletingId === cert.id}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="size-3.5" />
                                  Delete Credential
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-[#e2dcce] px-4 py-3 bg-slate-50/50 text-xs text-[#64748b]">
        <div>
          Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> (
          {pagination.total} total certificates)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 rounded-lg border border-[#e2dcce] bg-white px-2.5 py-1.5 font-medium text-[#14233c] hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
            Previous
          </button>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1 rounded-lg border border-[#e2dcce] bg-white px-2.5 py-1.5 font-medium text-[#14233c] hover:bg-slate-50 disabled:opacity-40"
          >
            Next
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Revocation Prompt Modal */}
      {revokingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#e2dcce] space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="size-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-bold font-heading text-base text-[#14233c]">Revoke Certificate</h3>
                <p className="text-xs text-[#64748b]">#{revokingCert.certificateNumber}</p>
              </div>
            </div>

            <p className="text-xs text-[#64748b]">
              Revoking will mark this credential as INVALID on the public verification portal. Please record an official
              reason for the audit ledger.
            </p>

            <form onSubmit={handleRevokeSubmit} className="space-y-4">
              <textarea
                rows={3}
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Reason for revocation (e.g. Non-completion of required deliverables)..."
                className="w-full rounded-xl border border-[#e2dcce] p-3 text-xs text-[#14233c] focus:border-rose-500 focus:outline-none"
                required
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRevokingCert(null)}
                  className="rounded-xl border border-[#e2dcce] px-4 py-2 text-xs font-semibold text-[#14233c] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs"
                >
                  Confirm Revocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
