import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import {
  getStudentsListFn,
  toggleStudentStatusFn,
  deleteStudentFn,
} from "@/lib/server/students"
import type { StudentRecordItem, StudentStatsSummary } from "@/lib/services/students"
import { StudentStatsBar } from "@/components/admin/students/student-stats-bar"
import { StudentsDataTable } from "@/components/admin/students/students-data-table"
import { StudentFormModal } from "@/components/admin/students/student-form-modal"
import { StudentDossierDrawer } from "@/components/admin/students/student-dossier-drawer"
import { toast } from "sonner"
import {
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react"

export const Route = createFileRoute("/admin/students")({
  head: () => ({
    meta: createMetaTags({
      title: "Students Management | Admin Console",
      description: "Manage candidate registrations, academic profiles, internship tracks, and student dossiers.",
      path: "/admin/students",
    }),
  }),
  loader: async () => {
    return await getStudentsListFn({ data: { page: 1, limit: 10, status: "ALL" } })
  },
  component: AdminStudentsPage,
})

function AdminStudentsPage() {
  const initialData = Route.useLoaderData()

  const [students, setStudents] = React.useState<StudentRecordItem[]>(initialData?.data || [])
  const [stats, setStats] = React.useState<StudentStatsSummary>(
    initialData?.stats || { total: 0, active: 0, inactive: 0, completed: 0, suspended: 0 }
  )
  const [pagination, setPagination] = React.useState(
    initialData?.pagination || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    }
  )

  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("ALL")
  const [sortBy, setSortBy] = React.useState<any>("createdAt")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = React.useState(false)

  // Modals and Drawers
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
  const [editingStudent, setEditingStudent] = React.useState<StudentRecordItem | null>(null)
  const [viewingStudent, setViewingStudent] = React.useState<StudentRecordItem | null>(null)

  // Fetch / Query data function
  const fetchStudents = React.useCallback(
    async (pageToLoad = pagination.page, limitToLoad = pagination.limit) => {
      setIsLoading(true)
      try {
        const res = await getStudentsListFn({
          data: {
            page: pageToLoad,
            limit: limitToLoad,
            search: searchTerm || undefined,
            status: statusFilter as any,
            department: departmentFilter !== "ALL" ? departmentFilter : undefined,
            sortBy,
            sortOrder,
          },
        })

        if (res?.success) {
          setStudents(res.data)
          setStats(res.stats)
          setPagination(res.pagination)
        }
      } catch (err) {
        console.error("Failed to load students:", err)
        toast.error("Failed to fetch student records.")
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.page, pagination.limit, searchTerm, statusFilter, departmentFilter, sortBy, sortOrder]
  )

  // Trigger search with slight debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(1, pagination.limit)
    }, 250)
    return () => clearTimeout(timer)
  }, [searchTerm, statusFilter, departmentFilter, sortBy, sortOrder])

  // Status toggle handler
  const handleToggleStatus = async (student: StudentRecordItem) => {
    const newStatus = student.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    const newIsActive = newStatus === "ACTIVE"

    try {
      await toggleStudentStatusFn({
        data: {
          studentId: student.id,
          isActive: newIsActive,
          status: newStatus as any,
        },
      })
      toast.success(`${student.name} marked as ${newStatus}`)
      fetchStudents()
      if (viewingStudent?.id === student.id) {
        setViewingStudent((prev) => (prev ? { ...prev, status: newStatus as any, isActive: newIsActive } : null))
      }
    } catch (err) {
      toast.error("Failed to update status.")
    }
  }

  // Delete handler
  const handleDeleteStudent = async (studentId: number) => {
    try {
      await deleteStudentFn({ data: { id: studentId } })
      toast.success("Student record deleted.")
      fetchStudents()
    } catch {
      toast.error("Failed to delete student record.")
    }
  }

  // Export CSV handler
  const handleExportCSV = () => {
    if (students.length === 0) {
      toast.info("No records to export.")
      return
    }

    const headers = [
      "ID",
      "Registration No",
      "Name",
      "Gender",
      "Email",
      "Phone",
      "Parent Name",
      "Parent Phone",
      "Relationship",
      "University",
      "College",
      "Degree Level",
      "Department",
      "Course",
      "Subject",
      "Session",
      "Consent Letter",
      "Status",
      "Created At",
    ]
    const rows = students.map((s) => [
      s.id,
      `"${s.registrationNumber || ""}"`,
      `"${s.name}"`,
      s.gender || "",
      s.email,
      s.phone || "",
      `"${s.parentName || ""}"`,
      s.parentPhone || "",
      `"${s.relationship || ""}"`,
      `"${s.university || ""}"`,
      `"${s.college}"`,
      s.degreeLevel || "",
      `"${s.department || ""}"`,
      `"${s.course}"`,
      `"${s.subject || ""}"`,
      `"${s.session || ""}"`,
      `"${typeof s.consentLetter === "object" && s.consentLetter?.url ? s.consentLetter.url : (s.consentLetter || "")}"`,
      s.status,
      s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "",
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Iconic_Career_Students_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Exported student dataset to CSV.")
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#b8864d]/30 bg-[#b8864d]/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-[#8e653e] uppercase tracking-wider">
            <Sparkles className="size-3 text-[#b8864d]" />
            <span>Candidate Dossier Registry</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Students Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Manage student candidate records, college affiliations, internship tracks, and cohort progression dossiers.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchStudents()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`size-3.5 text-slate-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="size-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingStudent(null)
              setIsFormModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14233c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5 text-[#e4b574]" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <StudentStatsBar
        stats={stats}
        currentFilter={statusFilter}
        onFilterSelect={(status) => setStatusFilter(status)}
      />

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone, college, roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8.5 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Select */}
          <div className="flex items-center gap-1.5">
            <Filter className="size-3 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-[#14233c] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active (In Session)</option>
              <option value="INACTIVE">Inactive (On Hold)</option>
              <option value="COMPLETED">Completed (Alumni)</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Department Select */}
          <div className="flex items-center gap-1.5">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-[#14233c] focus:outline-none font-medium"
            >
              <option value="ALL">All Departments</option>
              <option value="BTECH">BTECH</option>
              <option value="BCOM">BCOM</option>
              <option value="BSC">BSC</option>
              <option value="BA">BA</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="MCOM">MCOM</option>
              <option value="MSC">MSC</option>
              <option value="MA">MA</option>
              <option value="DIPLOMA">DIPLOMA</option>
            </select>
          </div>

          {/* Sort By Select */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-3 text-slate-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split("-")
                setSortBy(sb as any)
                setSortOrder(so as any)
              }}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-[#14233c] focus:outline-none"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="college-asc">College (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Data Table */}
      <StudentsDataTable
        students={students}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(p) => {
          setPagination((prev) => ({ ...prev, page: p }))
          fetchStudents(p, pagination.limit)
        }}
        onLimitChange={(l) => {
          setPagination((prev) => ({ ...prev, limit: l, page: 1 }))
          fetchStudents(1, l)
        }}
        onView={(s) => setViewingStudent(s)}
        onEdit={(s) => {
          setEditingStudent(s)
          setIsFormModalOpen(true)
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteStudent}
        onAddNew={() => {
          setEditingStudent(null)
          setIsFormModalOpen(true)
        }}
      />

      {/* Add / Edit Student Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => fetchStudents()}
        initialData={editingStudent}
      />

      {/* View Student Dossier Slide-Over Drawer */}
      <StudentDossierDrawer
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(s) => {
          setEditingStudent(s)
          setIsFormModalOpen(true)
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteStudent}
      />
    </div>
  )
}
