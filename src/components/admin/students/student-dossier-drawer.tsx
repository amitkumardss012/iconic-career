import * as React from "react"
import {
  X,
  GraduationCap,
  Mail,
  Phone,
  Building,
  MapPin,
  ShieldCheck,
  Edit,
  Power,
  Trash2,
  Users,
  Briefcase,
  FileCheck2,
  FileText,
  ExternalLink,
  Award,
  Hash,
  Calendar,
  BookOpen,
} from "lucide-react"
import type { StudentRecordItem } from "@/lib/services/students"
import { resolveDocumentUrl } from "@/lib/types/programs"

interface StudentDossierDrawerProps {
  student: StudentRecordItem | null
  onClose: () => void
  onEdit: (student: StudentRecordItem) => void
  onToggleStatus: (student: StudentRecordItem) => void
  onDelete: (studentId: number) => void
}

export function StudentDossierDrawer({
  student,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}: StudentDossierDrawerProps) {
  if (!student) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "INACTIVE":
        return "bg-slate-100 text-slate-600 border-slate-200"
      case "COMPLETED":
        return "bg-amber-50 text-[#8e653e] border-[#b8864d]/30"
      case "SUSPENDED":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 bg-[#101d33] text-white border-b border-[#22385c]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#d4af7a] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> Complete Candidate Dossier
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#b8864d] to-[#e4b574] text-[#14233c] text-lg font-bold shadow-md">
                {initials}
              </div>
              <div className="flex flex-col truncate">
                <h2 className="font-heading text-xl font-bold truncate">{student.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-medium border ${getStatusBadge(student.status)}`}>
                    {student.status}
                  </span>
                  {student.degreeLevel && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {student.degreeLevel}
                    </span>
                  )}
                  {student.department && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-medium bg-[#f5ecdf] text-[#8e653e] border border-[#b8864d]/30 font-mono">
                      {student.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Academic Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-[#b8864d]" /> Academic Credentials
              </h3>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3 text-xs">
                {student.university && (
                  <div className="flex items-start gap-2.5 text-slate-700">
                    <Building className="size-4 text-[#b8864d] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900">{student.university}</span>
                      <span className="text-[0.68rem] text-slate-400">Affiliated University / Board</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5 text-slate-700">
                  <Building className="size-4 text-[#b8864d] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900">{student.college}</span>
                    <span className="text-[0.68rem] text-slate-400">College / Institute</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-700 pt-2 border-t border-slate-200/60">
                  <BookOpen className="size-4 text-[#b8864d] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-900">{student.course}</span>
                    <span className="text-[0.68rem] text-slate-400">Course / Degree Program</span>
                  </div>
                </div>

                {student.subject && (
                  <div className="flex items-start gap-2.5 text-slate-700 pt-2 border-t border-slate-200/60">
                    <Award className="size-4 text-[#b8864d] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-900">{student.subject}</span>
                      <span className="text-[0.68rem] text-slate-400">Specialization / Core Subject</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  {student.session && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="size-3.5 text-[#b8864d] shrink-0" />
                      <div>
                        <span className="font-semibold block text-slate-900 text-[0.72rem]">{student.session}</span>
                        <span className="text-[0.65rem] text-slate-400">Session</span>
                      </div>
                    </div>
                  )}

                  {student.registrationNumber && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Hash className="size-3.5 text-[#b8864d] shrink-0" />
                      <div>
                        <span className="font-semibold block text-slate-900 font-mono text-[0.72rem]">{student.registrationNumber}</span>
                        <span className="text-[0.65rem] text-slate-400">Registration #</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Candidate & Contact Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <Mail className="size-3.5 text-[#b8864d]" /> Candidate Contact & Bio
              </h3>
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Mail className="size-4 text-[#b8864d] shrink-0" />
                    <a href={`mailto:${student.email}`} className="hover:underline truncate text-slate-900 font-medium">
                      {student.email}
                    </a>
                  </div>
                  {student.gender && (
                    <span className="text-[0.68rem] font-medium bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md">
                      {student.gender.replace("_", " ")}
                    </span>
                  )}
                </div>

                {student.phone && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Phone className="size-4 text-[#b8864d] shrink-0" />
                    <a href={`tel:${student.phone}`} className="hover:underline font-mono">
                      {student.phone}
                    </a>
                  </div>
                )}

                {(student.city || student.state) && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <MapPin className="size-4 text-[#b8864d] shrink-0" />
                    <span>{[student.city, student.state].filter(Boolean).join(", ")}</span>
                  </div>
                )}

                {student.emergencyContact && (
                  <div className="flex items-center gap-2.5 text-slate-700 pt-2 border-t border-slate-200/60">
                    <span className="font-semibold text-slate-500 text-[0.7rem]">Emergency:</span>
                    <span>{student.emergencyContact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Parent / Guardian Information */}
            {(student.parentName || student.parentPhone || student.parentEmail) && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                  <Users className="size-3.5 text-[#b8864d]" /> Parent / Guardian Information
                </h3>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2.5 text-xs">
                  {student.parentName && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{student.parentName}</span>
                      {student.relationship && (
                        <span className="text-[0.68rem] font-medium bg-amber-50 text-[#8e653e] border border-[#b8864d]/20 px-2 py-0.5 rounded-md">
                          {student.relationship}
                        </span>
                      )}
                    </div>
                  )}

                  {student.parentPhone && (
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Phone className="size-3.5 text-[#b8864d] shrink-0" />
                      <a href={`tel:${student.parentPhone}`} className="hover:underline font-mono">
                        {student.parentPhone}
                      </a>
                    </div>
                  )}

                  {student.parentEmail && (
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Mail className="size-3.5 text-[#b8864d] shrink-0" />
                      <a href={`mailto:${student.parentEmail}`} className="hover:underline">
                        {student.parentEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compliance & Parental Consent Letter */}
            {student.consentLetter && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                  <FileCheck2 className="size-3.5 text-[#b8864d]" /> Parental Consent Letter
                </h3>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                        <FileText className="size-4.5" />
                      </div>
                      <div className="flex flex-col truncate max-w-[200px] sm:max-w-xs">
                        <span className="font-semibold text-slate-900 truncate">
                          {typeof student.consentLetter === "object" && student.consentLetter?.fileName
                            ? student.consentLetter.fileName
                            : "Parental_Consent_Letter.pdf"}
                        </span>
                        <span className="text-[0.68rem] text-slate-400">Signed Undertaking (Cloud Stored)</span>
                      </div>
                    </div>

                    <a
                      href={resolveDocumentUrl(student.consentLetter)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#8e653e] hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Open PDF</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Section */}
            {student.notes && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Administrative Notes
                </h3>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-700 leading-relaxed">
                  {student.notes}
                </div>
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                onEdit(student)
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              <Edit className="size-3.5 text-[#8e653e]" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleStatus(student)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
                student.status === "ACTIVE"
                  ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <Power className="size-3.5" />
              <span>{student.status === "ACTIVE" ? "Deactivate" : "Activate"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${student.name}'s record?`)) {
                  onDelete(student.id)
                  onClose()
                }
              }}
              className="inline-flex items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Delete student"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
