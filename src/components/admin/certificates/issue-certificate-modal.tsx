import * as React from "react"
import { toast } from "sonner"
import {
  X,
  Award,
  Calendar,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  Loader2,
  Sparkles,
  UserCheck,
  Search,
  BookOpen,
  FileText,
  Building,
  GraduationCap,
} from "lucide-react"
import {
  issueCertificateFn,
  getEligibleEnrollmentsFn,
} from "@/lib/server/certificates"
import type { CertificateSnapshotInput } from "@/lib/validation/certificate"

interface IssueCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  preselectedEnrollmentId?: number | null
}

interface EligibleEnrollmentOption {
  id: number
  enrollmentNumber: string
  userId: number
  userName: string
  userEmail: string
  userPhone?: string | null
  college: string
  department?: string
  degree?: string
  programId: number
  programTitle: string
  programType: "COURSE" | "INTERNSHIP"
  programDuration?: string | null
  status: string
  grade?: string | null
  mentorName?: string | null
  mentorEmail?: string | null
  startDate: Date | string
  expectedEndDate: Date | string
  existingCertificateNumber?: string | null
}

export function IssueCertificateModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedEnrollmentId,
}: IssueCertificateModalProps) {
  // Enrollments list & search
  const [enrollments, setEnrollments] = React.useState<EligibleEnrollmentOption[]>([])
  const [loadingEnrollments, setLoadingEnrollments] = React.useState(false)
  const [enrollmentSearch, setEnrollmentSearch] = React.useState("")
  const [selectedEnrollmentId, setSelectedEnrollmentId] = React.useState<number | "">("")

  // Form Fields - ALL Editable
  const [certificateNumber, setCertificateNumber] = React.useState("")
  const [status, setStatus] = React.useState<"ISSUED" | "REVOKED" | "SUSPENDED">("ISSUED")
  const [isDownloadAllowed, setIsDownloadAllowed] = React.useState(true)
  const [issueDate, setIssueDate] = React.useState(new Date().toISOString().split("T")[0])
  const [validUntil, setValidUntil] = React.useState("")
  const [grade, setGrade] = React.useState("")
  const [percentage, setPercentage] = React.useState<string>("")
  const [durationText, setDurationText] = React.useState("")
  const [fileUrl, setFileUrl] = React.useState("")
  const [adminNotes, setAdminNotes] = React.useState("")

  // Snapshot Fields - ALL Editable
  const [snapshotData, setSnapshotData] = React.useState<CertificateSnapshotInput>({
    recipientName: "",
    recipientEmail: "",
    college: "",
    degree: "",
    department: "",
    programTitle: "",
    programType: "COURSE",
    durationText: "",
    mentorName: "",
    mentorEmail: "",
  })

  const [activeTab, setActiveTab] = React.useState<"general" | "snapshot" | "assets">("general")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Generate a random preview certificate number
  const generatePreviewNumber = () => {
    const year = new Date().getFullYear()
    const rand = Math.floor(10000 + Math.random() * 90000)
    return `IC-${year}-${rand}`
  }

  // Load eligible enrollments on open
  React.useEffect(() => {
    if (!isOpen) return
    let isMounted = true
    setLoadingEnrollments(true)

    getEligibleEnrollmentsFn({ data: { search: enrollmentSearch } })
      .then((res: any) => {
        if (isMounted) {
          setEnrollments(res || [])
          setLoadingEnrollments(false)
        }
      })
      .catch((err) => {
        console.error("Failed to load eligible enrollments:", err)
        if (isMounted) setLoadingEnrollments(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, enrollmentSearch])

  // Initialize defaults on open
  React.useEffect(() => {
    if (isOpen) {
      setCertificateNumber(generatePreviewNumber())
      setStatus("ISSUED")
      setIsDownloadAllowed(true)
      setIssueDate(new Date().toISOString().split("T")[0])
      setValidUntil("")
      setGrade("A+")
      setPercentage("92.5")
      setDurationText("8 Weeks")
      setFileUrl("")
      setAdminNotes("")
      setErrorMessage(null)
      setActiveTab("general")

      if (preselectedEnrollmentId) {
        setSelectedEnrollmentId(preselectedEnrollmentId)
      } else {
        setSelectedEnrollmentId("")
      }
    }
  }, [isOpen, preselectedEnrollmentId])

  // Auto populate snapshot when an enrollment is selected
  React.useEffect(() => {
    if (!selectedEnrollmentId) return

    const match = enrollments.find((e) => e.id === Number(selectedEnrollmentId))
    if (match) {
      if (match.existingCertificateNumber) {
        setCertificateNumber(match.existingCertificateNumber)
      }
      setGrade(match.grade || "A+")
      setDurationText(match.programDuration || "8 Weeks")
      setSnapshotData({
        recipientName: match.userName || "",
        recipientEmail: match.userEmail || "",
        college: match.college || "",
        degree: match.degree || "UG",
        department: match.department || "",
        programTitle: match.programTitle || "",
        programType: match.programType || "COURSE",
        durationText: match.programDuration || "8 Weeks",
        mentorName: match.mentorName || "",
        mentorEmail: match.mentorEmail || "",
      })
    }
  }, [selectedEnrollmentId, enrollments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedEnrollmentId) {
      setErrorMessage("Please select an enrollment.")
      return
    }

    if (!snapshotData.recipientName.trim()) {
      setErrorMessage("Recipient Name is required in the snapshot.")
      return
    }

    if (!snapshotData.college.trim()) {
      setErrorMessage("College or University name is required.")
      return
    }

    if (!snapshotData.programTitle.trim()) {
      setErrorMessage("Program Title is required.")
      return
    }

    try {
      setIsSubmitting(true)

      await issueCertificateFn({
        data: {
          enrollmentId: Number(selectedEnrollmentId),
          certificateNumber: certificateNumber.trim() || undefined,
          status,
          isDownloadAllowed,
          issueDate,
          validUntil: validUntil || null,
          grade: grade || null,
          percentage: percentage ? parseFloat(percentage) : null,
          durationText: durationText || snapshotData.durationText || null,
          snapshotData,
          fileUrl: fileUrl || null,
          adminNotes: adminNotes || null,
        },
      })

      toast.success("Certificate issued successfully!", {
        description: `Certificate ${certificateNumber} is now registered and verifiable.`,
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Failed to issue certificate:", err)
      setErrorMessage(err?.message || "An unexpected error occurred while issuing the certificate.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-[#e2dcce] flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2dcce] px-6 py-4.5 bg-gradient-to-r from-[#14233c]/5 via-transparent to-[#b8864d]/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#14233c] text-[#d4af37] flex items-center justify-center shadow-xs">
              <Award className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-[#14233c]">Issue New Certificate</h2>
              <p className="text-xs text-[#64748b]">
                Grant verifiable graduation credential with full snapshot & download access control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#64748b] hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex border-b border-[#e2dcce] px-6 pt-3 gap-6 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${
              activeTab === "general"
                ? "border-[#b8864d] text-[#14233c]"
                : "border-transparent text-[#64748b] hover:text-[#14233c]"
            }`}
          >
            <Award className="size-3.5" />
            1. Core & Permissions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("snapshot")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${
              activeTab === "snapshot"
                ? "border-[#b8864d] text-[#14233c]"
                : "border-transparent text-[#64748b] hover:text-[#14233c]"
            }`}
          >
            <GraduationCap className="size-3.5" />
            2. Recipient Snapshot (All Editable)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("assets")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 ${
              activeTab === "assets"
                ? "border-[#b8864d] text-[#14233c]"
                : "border-transparent text-[#64748b] hover:text-[#14233c]"
            }`}
          >
            <FileText className="size-3.5" />
            3. Asset URL & Notes
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* ======================================================== */}
            {/* TAB 1: CORE & PERMISSIONS */}
            {/* ======================================================== */}
            {activeTab === "general" && (
              <div className="space-y-5">
                {/* 1. Select Enrollment */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                    Select Program Enrollment <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedEnrollmentId}
                    onChange={(e) => setSelectedEnrollmentId(e.target.value ? Number(e.target.value) : "")}
                    className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2.5 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none focus:ring-1 focus:ring-[#b8864d]"
                    required
                  >
                    <option value="">-- Choose any program enrollment --</option>
                    {enrollments.map((enr) => (
                      <option key={enr.id} value={enr.id}>
                        {enr.enrollmentNumber} — {enr.userName} ({enr.programTitle}) - {enr.status}{" "}
                        {enr.existingCertificateNumber ? `[Existing Cert: ${enr.existingCertificateNumber}]` : ""}
                      </option>
                    ))}
                  </select>
                  {enrollments.length === 0 && !loadingEnrollments && (
                    <p className="text-[11px] text-[#64748b] mt-1">
                      No student enrollments found in database.
                    </p>
                  )}
                </div>

                {/* 2. Certificate Number & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Certificate Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={certificateNumber}
                        onChange={(e) => setCertificateNumber(e.target.value)}
                        placeholder="e.g. IC-2026-08912"
                        className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm font-mono font-bold text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setCertificateNumber(generatePreviewNumber())}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#b8864d] bg-[#b8864d]/10 px-2 py-1 rounded-md hover:bg-[#b8864d]/20"
                      >
                        Regenerate
                      </button>
                    </div>
                    <span className="text-[11px] text-[#64748b] block mt-1">
                      Unique alphanumeric verification code mapped to /verify/[number]
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Certificate Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    >
                      <option value="ISSUED">ISSUED (Active & Verifiable)</option>
                      <option value="SUSPENDED">SUSPENDED (Temporarily On Hold)</option>
                      <option value="REVOKED">REVOKED (Invalidated)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Download Permission (isDownloadAllowed) */}
                <div className="rounded-xl border border-[#e2dcce] bg-amber-50/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-xl flex items-center justify-center ${
                          isDownloadAllowed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isDownloadAllowed ? <Unlock className="size-4.5" /> : <Lock className="size-4.5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#14233c]">
                          Allow Public & Student Download / Generation
                        </h4>
                        <p className="text-[11px] text-[#64748b]">
                          {isDownloadAllowed
                            ? "Student or verifier can generate and download this certificate on the public page."
                            : "Download is locked. Student will see a verification badge but cannot download the certificate."}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDownloadAllowed}
                        onChange={(e) => setIsDownloadAllowed(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

                {/* 4. Dates & Grade */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Valid Until (Optional)
                    </label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      placeholder="Lifetime if empty"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Grade / Standing
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. A+, Distinction"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="e.g. 94.5"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: RECIPIENT SNAPSHOT (ALL EDITABLE) */}
            {/* ======================================================== */}
            {activeTab === "snapshot" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="size-4 shrink-0 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-bold">Immutable Credential Snapshot</p>
                    <p className="text-[11px] text-blue-700">
                      These values freeze the student's legal details at issuance time. You can edit every single field
                      below to format name, college, degree, or program titles perfectly.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Recipient Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={snapshotData.recipientName}
                      onChange={(e) => setSnapshotData({ ...snapshotData, recipientName: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={snapshotData.recipientEmail || ""}
                      onChange={(e) => setSnapshotData({ ...snapshotData, recipientEmail: e.target.value })}
                      placeholder="e.g. alex@example.com"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      College / University Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={snapshotData.college}
                      onChange={(e) => setSnapshotData({ ...snapshotData, college: e.target.value })}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Degree & Department
                    </label>
                    <input
                      type="text"
                      value={snapshotData.department || snapshotData.degree || ""}
                      onChange={(e) =>
                        setSnapshotData({
                          ...snapshotData,
                          department: e.target.value,
                          degree: e.target.value,
                        })
                      }
                      placeholder="e.g. B.Tech Computer Science & Engineering"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Program / Internship Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={snapshotData.programTitle}
                      onChange={(e) => setSnapshotData({ ...snapshotData, programTitle: e.target.value })}
                      placeholder="e.g. Advanced Full Stack Engineering Internship"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Track Type
                    </label>
                    <select
                      value={snapshotData.programType}
                      onChange={(e) =>
                        setSnapshotData({
                          ...snapshotData,
                          programType: e.target.value as "COURSE" | "INTERNSHIP",
                        })
                      }
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    >
                      <option value="COURSE">Course Certificate</option>
                      <option value="INTERNSHIP">Internship Certificate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Duration Text
                    </label>
                    <input
                      type="text"
                      value={durationText}
                      onChange={(e) => {
                        setDurationText(e.target.value)
                        setSnapshotData({ ...snapshotData, durationText: e.target.value })
                      }}
                      placeholder="e.g. 6 Months (Jan - Jun 2026)"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Mentor Name
                    </label>
                    <input
                      type="text"
                      value={snapshotData.mentorName || ""}
                      onChange={(e) => setSnapshotData({ ...snapshotData, mentorName: e.target.value })}
                      placeholder="e.g. Dr. Robert Chen"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                      Mentor Email
                    </label>
                    <input
                      type="email"
                      value={snapshotData.mentorEmail || ""}
                      onChange={(e) => setSnapshotData({ ...snapshotData, mentorEmail: e.target.value })}
                      placeholder="e.g. mentor@iconic.com"
                      className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: ASSETS & NOTES */}
            {/* ======================================================== */}
            {activeTab === "assets" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                    Pre-rendered File / PDF URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://cdn.iconiccareer.com/certificates/sample.pdf"
                    className="w-full rounded-xl border border-[#e2dcce] bg-white px-3.5 py-2 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                  />
                  <span className="text-[11px] text-[#64748b] block mt-1">
                    If stored in external S3/Cloudflare R2 bucket. If blank, certificate renders dynamically on
                    frontend.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#14233c] block mb-1.5">
                    Internal Administrative Notes
                  </label>
                  <textarea
                    rows={4}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal audit notes (e.g. Verified by Academic Committee on 23rd Sept)..."
                    className="w-full rounded-xl border border-[#e2dcce] bg-white p-3 text-sm text-[#14233c] focus:border-[#b8864d] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-[#e2dcce] bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748b]">
                Status: <strong className="text-[#14233c]">{status}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-[#64748b]">
                Download:{" "}
                <strong className={isDownloadAllowed ? "text-emerald-700" : "text-amber-700"}>
                  {isDownloadAllowed ? "Allowed" : "Locked"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-[#e2dcce] bg-white px-4 py-2 text-sm font-semibold text-[#14233c] hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedEnrollmentId}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#14233c] to-[#1e3458] px-5 py-2 text-sm font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Issuing Credential...
                  </>
                ) : (
                  <>
                    <Award className="size-4 text-[#d4af37]" />
                    Issue Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
