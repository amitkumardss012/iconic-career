import * as React from "react"
import { toast } from "sonner"
import {
  X,
  Sparkles,
  Key,
  Check,
  AlertCircle,
  Loader2,
  User as UserIcon,
  GraduationCap,
  Sliders,
  FileText,
} from "lucide-react"
import { createStudentFn, updateStudentFn } from "@/lib/server/students"
import type { StudentRecordItem } from "@/lib/services/students"
import type { DocumentType } from "@/lib/types/programs"
import { PdfUploadPicker } from "@/components/common/pdf-upload-picker"

interface StudentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: StudentRecordItem | null
}

const POPULAR_DEPARTMENTS = [
  "BTECH",
  "BCOM",
  "BSC",
  "BA",
  "BCA",
  "BBA",
  "MCA",
  "MBA",
  "MCOM",
  "MSC",
  "MA",
  "DIPLOMA",
  "OTHER",
]

export function StudentFormModal({ isOpen, onClose, onSuccess, initialData }: StudentFormModalProps) {
  const isEditing = !!initialData
  const [activeTab, setActiveTab] = React.useState<"personal" | "academic" | "consent" | "settings">("personal")

  const [formData, setFormData] = React.useState({
    // User & Personal
    name: "",
    email: "",
    phone: "",
    gender: "PREFER_NOT_TO_SAY" as "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY",
    password: "",

    // Guardian
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    relationship: "Father",

    // Academic
    university: "",
    college: "",
    degreeLevel: "UG" as "UG" | "PG" | "DIPLOMA" | "DOCTORATE" | "OTHER",
    department: "BTECH",
    customDepartment: "",
    course: "",
    subject: "",
    session: "",
    registrationNumber: "",

    // Compliance & Consent
    consentLetter: null as DocumentType | string | null,

    // Status & Location
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "COMPLETED" | "SUSPENDED",
    city: "",
    state: "",
    emergencyContact: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (initialData) {
      const isKnownDept = POPULAR_DEPARTMENTS.includes(initialData.department || "")
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        gender: initialData.gender || "PREFER_NOT_TO_SAY",
        password: "",

        parentName: initialData.parentName || "",
        parentPhone: initialData.parentPhone || "",
        parentEmail: initialData.parentEmail || "",
        relationship: initialData.relationship || "Father",

        university: initialData.university || "",
        college: initialData.college || "",
        degreeLevel: initialData.degreeLevel || "UG",
        department: isKnownDept ? (initialData.department || "BTECH") : "OTHER",
        customDepartment: isKnownDept ? "" : (initialData.department || ""),
        course: initialData.course || "",
        subject: initialData.subject || "",
        session: initialData.session || "",
        registrationNumber: initialData.registrationNumber || "",

        consentLetter: initialData.consentLetter || null,

        status: initialData.status || "ACTIVE",
        city: initialData.city || "",
        state: initialData.state || "",
        emergencyContact: initialData.emergencyContact || "",
        notes: initialData.notes || "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "PREFER_NOT_TO_SAY",
        password: "Student@" + Math.floor(10000 + Math.random() * 90000),

        parentName: "",
        parentPhone: "",
        parentEmail: "",
        relationship: "Father",

        university: "",
        college: "",
        degreeLevel: "UG",
        department: "BTECH",
        customDepartment: "",
        course: "",
        subject: "",
        session: `${new Date().getFullYear()}-${new Date().getFullYear() + 4}`,
        registrationNumber: "",

        consentLetter: null,

        status: "ACTIVE",
        city: "",
        state: "",
        emergencyContact: "",
        notes: "",
      })
    }
    setErrorMessage(null)
    setActiveTab("personal")
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleGeneratePassword = () => {
    const randomPwd = "Student@" + Math.floor(10000 + Math.random() * 90000)
    setFormData((prev) => ({ ...prev, password: randomPwd }))
    toast.info(`Generated password: ${randomPwd}`)
  }

  const handleGenerateRegNumber = () => {
    const year = new Date().getFullYear()
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const generated = `REG-${year}-${randomSuffix}`
    setFormData((prev) => ({ ...prev, registrationNumber: generated }))
    toast.info(`Generated registration number: ${generated}`)
  }

  const resolvedDepartment =
    formData.department === "OTHER"
      ? formData.customDepartment || null
      : formData.department || null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      if (isEditing && initialData) {
        await updateStudentFn({
          data: {
            id: initialData.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            password: formData.password || undefined,

            parentName: formData.parentName || null,
            parentPhone: formData.parentPhone || null,
            parentEmail: formData.parentEmail || null,
            relationship: formData.relationship || null,

            university: formData.university || null,
            college: formData.college,
            degreeLevel: formData.degreeLevel,
            department: resolvedDepartment,
            course: formData.course,
            subject: formData.subject || null,
            session: formData.session || null,
            registrationNumber: formData.registrationNumber || null,

            consentLetter: formData.consentLetter || null,

            status: formData.status,
            city: formData.city || null,
            state: formData.state || null,
            emergencyContact: formData.emergencyContact || null,
            notes: formData.notes || null,
          },
        })
        toast.success("Student profile updated successfully.")
      } else {
        await createStudentFn({
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            password: formData.password || "Student@12345",

            parentName: formData.parentName || null,
            parentPhone: formData.parentPhone || null,
            parentEmail: formData.parentEmail || null,
            relationship: formData.relationship || null,

            university: formData.university || null,
            college: formData.college,
            degreeLevel: formData.degreeLevel,
            department: resolvedDepartment,
            course: formData.course,
            subject: formData.subject || null,
            session: formData.session || null,
            registrationNumber: formData.registrationNumber || null,

            consentLetter: formData.consentLetter || null,

            status: formData.status,
            city: formData.city || null,
            state: formData.state || null,
            emergencyContact: formData.emergencyContact || null,
            notes: formData.notes || null,
          },
        })
        toast.success("Student profile created successfully.")
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save student record."
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#101d33] text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#b8864d] to-[#e4b574] text-[#14233c] font-bold shadow-xs">
              <Sparkles className="size-4.5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold">
                {isEditing ? `Edit Student: ${initialData?.name}` : "Create Student Profile"}
              </h2>
              <p className="text-[0.68rem] text-slate-300">
                {isEditing ? "Update student personal, guardian, academic, and agency details" : "Enroll candidate with comprehensive profile details"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "personal"
                ? "border-[#b8864d] text-[#14233c] font-bold bg-white -mb-px rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <UserIcon className="size-3.5 text-[#b8864d]" />
            <span>Personal & Guardian</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("academic")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "academic"
                ? "border-[#b8864d] text-[#14233c] font-bold bg-white -mb-px rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="size-3.5 text-[#b8864d]" />
            <span>Academic Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("consent")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "consent"
                ? "border-[#b8864d] text-[#14233c] font-bold bg-white -mb-px rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText className="size-3.5 text-[#b8864d]" />
            <span>Consent Letter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "settings"
                ? "border-[#b8864d] text-[#14233c] font-bold bg-white -mb-px rounded-t-lg"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sliders className="size-3.5 text-[#b8864d]" />
            <span>Location & Notes</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <AlertCircle className="size-4.5 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: Personal & Guardian Details */}
          {activeTab === "personal" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#b8864d] border-b border-slate-100 pb-1.5 mb-3">
                  Student Identity & Authentication
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="priya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none bg-white font-medium"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        {isEditing ? "Password (leave blank to keep current)" : "Account Password"}
                      </label>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={handleGeneratePassword}
                          className="text-[0.65rem] font-semibold text-[#8e653e] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Key className="size-3" /> Auto-Generate
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder={isEditing ? "••••••••" : "Min 8 characters"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 font-mono focus:border-[#14233c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#b8864d] border-b border-slate-100 pb-1.5 mb-3">
                  Parent / Guardian Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Father, Mother, Guardian"
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Parent's Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Parent's Email Address</label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Academic Credentials */}
          {activeTab === "academic" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#b8864d] border-b border-slate-100 pb-1.5 mb-3">
                Institution & Academic Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University / Board</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi University / AKTU"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College / Institute <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Indian Institute of Technology, Delhi"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Level</label>
                  <select
                    value={formData.degreeLevel}
                    onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value as any })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none bg-white font-medium"
                  >
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="DOCTORATE">Doctorate / Ph.D</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none bg-white font-medium"
                  >
                    {POPULAR_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.department === "OTHER" && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Department</label>
                    <input
                      type="text"
                      placeholder="e.g. LLB, B.Pharm, BDS, etc."
                      value={formData.customDepartment}
                      onChange={(e) => setFormData({ ...formData, customDepartment: e.target.value })}
                      className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course / Program Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Artificial Intelligence & Data Science"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Session</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024-2028 or 2025-2026"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Registration / Roll Number</label>
                    <button
                      type="button"
                      onClick={handleGenerateRegNumber}
                      className="text-[0.65rem] font-semibold text-[#8e653e] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Key className="size-3" /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. REG-2026-4891 or AKTU/24/091"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 font-mono focus:border-[#14233c] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Compliance & Parental Consent Letter */}
          {activeTab === "consent" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#b8864d] border-b border-slate-100 pb-1.5 mb-3">
                Parental Consent Letter & Undertaking
              </h3>

              <div className="space-y-4">
                <PdfUploadPicker
                  value={formData.consentLetter}
                  onChange={(doc) => setFormData((prev) => ({ ...prev, consentLetter: doc }))}
                  label="Parental Consent Letter (PDF)"
                  helperText="Upload signed PDF undertaking or parental consent letter (stored in cloud)"
                />

                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="size-3.5 text-amber-600" /> Compliance Document Note
                  </span>
                  <p className="text-[0.68rem] text-amber-700 leading-relaxed">
                    Uploading a signed parental/guardian consent letter verifies candidate eligibility for enterprise cohorts, internship deployments, and campus projects. Documents are encrypted and hosted via secure cloud storage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Location, Status & Notes */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#b8864d] border-b border-slate-100 pb-1.5 mb-3">
                Status, Location & Administrative Notes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none bg-white font-medium"
                  >
                    <option value="ACTIVE">ACTIVE (In Session)</option>
                    <option value="INACTIVE">INACTIVE (On Hold)</option>
                    <option value="COMPLETED">COMPLETED (Alumni)</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 00000"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    placeholder="e.g. Karnataka"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Remarks</label>
                  <textarea
                    rows={3}
                    placeholder="Optional remarks or candidate dossier notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#14233c] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[0.72rem] text-slate-400">
              <span>Section:</span>
              <span className="font-semibold text-slate-700 capitalize">{activeTab}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#14233c] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="size-3.5 text-[#e4b574]" />
                    <span>{isEditing ? "Save Changes" : "Create Student Record"}</span>
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
