import * as React from "react"
import {
  MoreVertical,
  Eye,
  Edit,
  Power,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react"
import type { StudentRecordItem } from "@/lib/services/students"

interface StudentsDataTableProps {
  students: StudentRecordItem[]
  isLoading: boolean
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onView: (student: StudentRecordItem) => void
  onEdit: (student: StudentRecordItem) => void
  onToggleStatus: (student: StudentRecordItem) => void
  onDelete: (studentId: number) => void
  onAddNew: () => void
}

export function StudentsDataTable({
  students,
  isLoading,
  pagination,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  onAddNew,
}: StudentsDataTableProps) {
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null)

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleDocumentClick = () => setOpenDropdownId(null)
    window.addEventListener("click", handleDocumentClick)
    return () => window.removeEventListener("click", handleDocumentClick)
  }, [])

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

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Candidate</th>
              <th className="px-5 py-3.5">Contact</th>
              <th className="px-5 py-3.5">College / Institution</th>
              <th className="px-5 py-3.5">Course / Degree</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="size-6 animate-spin rounded-full border-2 border-[#14233c] border-t-transparent" />
                    <span className="text-xs font-medium text-slate-500">Loading student records...</span>
                  </div>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="mx-auto max-w-sm flex flex-col items-center justify-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <GraduationCap className="size-6" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-heading text-base font-bold text-slate-900">No Student Records Located</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search criteria, or enroll a new student to initialize the roster.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onAddNew}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#14233c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="size-3.5 text-[#e4b574]" />
                      <span>Enroll Student</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const initials = student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                const isMenuOpen = openDropdownId === student.id

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onView(student)}
                  >
                    {/* Candidate Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#14233c] to-[#22385c] font-semibold text-white text-[0.7rem] shadow-2xs">
                          {initials}
                        </div>
                        <div className="flex flex-col truncate max-w-[190px]">
                          <span className="font-semibold text-slate-900 group-hover:text-[#14233c] transition-colors truncate">
                            {student.name}
                          </span>
                          <div className="flex items-center gap-1.5 text-[0.68rem] text-slate-400 truncate">
                            {student.registrationNumber ? (
                              <span className="font-mono text-slate-500 font-medium">#{student.registrationNumber}</span>
                            ) : (
                              <span>ID: #{student.id}</span>
                            )}
                            {student.city && <span>• {student.city}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col text-[0.72rem] text-slate-600 truncate max-w-[180px]">
                        <span className="truncate">{student.email}</span>
                        {student.phone && <span className="text-slate-400 font-mono text-[0.68rem]">{student.phone}</span>}
                      </div>
                    </td>

                    {/* College & University */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col truncate max-w-[200px]">
                        <span className="font-medium text-slate-900 truncate">{student.college}</span>
                        {student.university && (
                          <span className="text-[0.68rem] text-slate-400 truncate">{student.university}</span>
                        )}
                      </div>
                    </td>

                    {/* Course, Degree & Dept */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1 truncate max-w-[220px]">
                        <span className="font-medium text-slate-800 truncate">{student.course}</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {student.degreeLevel && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[0.62rem] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              {student.degreeLevel}
                            </span>
                          )}
                          {student.department && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[0.62rem] font-semibold bg-[#f5ecdf] text-[#8e653e] border border-[#b8864d]/30 font-mono">
                              {student.department}
                            </span>
                          )}
                          {student.session && (
                            <span className="text-[0.62rem] text-slate-400">({student.session})</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-medium border ${getStatusBadge(student.status)}`}>
                        {student.status}
                      </span>
                    </td>

                    {/* Row Actions Menu */}
                    <td
                      className="px-5 py-3.5 text-right whitespace-nowrap relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(isMenuOpen ? null : student.id)
                        }}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-5 top-10 z-30 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              onView(student)
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Eye className="size-3.5 text-slate-400" />
                            <span>View Dossier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              onEdit(student)
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Edit className="size-3.5 text-[#8e653e]" />
                            <span>Edit Record</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              onToggleStatus(student)
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Power className="size-3.5 text-amber-600" />
                            <span>{student.status === "ACTIVE" ? "Deactivate" : "Activate"}</span>
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              if (window.confirm(`Delete record for ${student.name}?`)) {
                                onDelete(student.id)
                              }
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-slate-200 bg-slate-50/50 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="font-semibold text-slate-900">{students.length}</strong> of{" "}
            <strong className="font-semibold text-slate-900">{pagination.total}</strong> candidates
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Rows:</span>
            <select
              value={pagination.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 focus:outline-none focus:border-[#14233c]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.7rem] text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.page - 1)}
              className="inline-flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="size-4" />
            </button>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.page + 1)}
              className="inline-flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
