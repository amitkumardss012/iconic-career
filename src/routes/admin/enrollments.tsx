import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import {
  getEnrollmentsFn,
  getEnrollmentStatsFn,
  deleteEnrollmentFn,
} from "@/lib/server/enrollments"
import type { EnrollmentRecordItem, EnrollmentStatsSummary } from "@/lib/services/enrollments"
import { EnrollmentsStatsBar } from "@/components/admin/enrollments/enrollments-stats-bar"
import { EnrollmentsDataTable } from "@/components/admin/enrollments/enrollments-data-table"
import { EnrollStudentModal } from "@/components/admin/enrollments/enroll-student-modal"
import { ExtendInternshipModal } from "@/components/admin/enrollments/extend-internship-modal"
import { EditEnrollmentModal } from "@/components/admin/enrollments/edit-enrollment-modal"
import { RecordPaymentModal } from "@/components/admin/payments/record-payment-modal"
import { toast } from "sonner"
import {
  Search,
  Filter,
  Plus,
  RefreshCw,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  UserCheck,
  CheckCircle2,
} from "lucide-react"

export const Route = createFileRoute("/admin/enrollments")({
  head: () => ({
    meta: createMetaTags({
      title: "Enrollments & Internship Durations | Admin Console",
      description: "Enroll students, configure internship durations, extend periods, and track academic milestones.",
      path: "/admin/enrollments",
    }),
  }),
  loader: async () => {
    try {
      const [enrollmentsRes, statsRes] = await Promise.all([
        getEnrollmentsFn({ data: { page: 1, limit: 10 } }),
        getEnrollmentStatsFn(),
      ])
      return {
        enrollments: enrollmentsRes,
        stats: statsRes,
      }
    } catch (err) {
      console.error("Enrollment loader error:", err)
      return {
        enrollments: {
          items: [] as EnrollmentRecordItem[],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        stats: {
          total: 0,
          active: 0,
          activeCourses: 0,
          activeInternships: 0,
          extendedInternships: 0,
          completed: 0,
        },
      }
    }
  },

  component: AdminEnrollmentsPage,
})

function AdminEnrollmentsPage() {
  const initialData = Route.useLoaderData()

  const [items, setItems] = React.useState<EnrollmentRecordItem[]>(initialData?.enrollments?.items || [])
  const [stats, setStats] = React.useState<EnrollmentStatsSummary>(
    initialData?.stats || {
      total: 0,
      active: 0,
      activeCourses: 0,
      activeInternships: 0,
      extendedInternships: 0,
      completed: 0,
    }
  )
  const [pagination, setPagination] = React.useState({
    total: initialData?.enrollments?.total || 0,
    page: initialData?.enrollments?.page || 1,
    limit: initialData?.enrollments?.limit || 10,
    totalPages: initialData?.enrollments?.totalPages || 1,
  })

  // Filter & Search states
  const [search, setSearch] = React.useState("")
  const [programType, setProgramType] = React.useState<"ALL" | "COURSE" | "INTERNSHIP">("ALL")
  const [status, setStatus] = React.useState<string>("ALL")
  const [extendedOnly, setExtendedOnly] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Modals state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = React.useState(false)
  const [extendingItem, setExtendingItem] = React.useState<EnrollmentRecordItem | null>(null)
  const [editingItem, setEditingItem] = React.useState<EnrollmentRecordItem | null>(null)
  const [paymentEnrollment, setPaymentEnrollment] = React.useState<EnrollmentRecordItem | null>(null)
  const [deletingItem, setDeletingItem] = React.useState<EnrollmentRecordItem | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Refetch data
  const fetchData = React.useCallback(
    async (pageToLoad = pagination.page) => {
      setIsLoading(true)
      try {
        const [enrollmentsRes, statsRes] = await Promise.all([
          getEnrollmentsFn({
            data: {
              page: pageToLoad,
              limit: pagination.limit,
              search: search || undefined,
              programType: programType !== "ALL" ? programType : undefined,
              status: status !== "ALL" ? (status as any) : undefined,
              isExtended: extendedOnly ? true : undefined,
            },
          }),
          getEnrollmentStatsFn(),
        ])

        setItems(enrollmentsRes.items)
        setStats(statsRes)
        setPagination({
          total: enrollmentsRes.total,
          page: enrollmentsRes.page,
          limit: enrollmentsRes.limit,
          totalPages: enrollmentsRes.totalPages,
        })
      } catch (err: any) {
        console.error("Failed to fetch enrollments:", err)
        toast.error("Failed to refresh enrollments list.")
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.limit, pagination.page, search, programType, status, extendedOnly]
  )

  // Handle Search Debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, programType, status, extendedOnly])

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setIsDeleting(true)
    try {
      await deleteEnrollmentFn({ data: { id: deletingItem.id } })
      toast.success(`Enrollment ${deletingItem.enrollmentNumber} removed successfully.`)
      setDeletingItem(null)
      fetchData(1)
    } catch (err: any) {
      toast.error(err.message || "Failed to remove enrollment.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="px-2.5 py-0.5 rounded-full bg-[#b8864d]/15 border border-[#b8864d]/30 text-[#b8864d] font-semibold text-[11px] tracking-wide uppercase">
              Operations & Cohorts
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
            Program & Internship Enrollments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student registrations, internship durations, timeline extensions, and academic progress.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchData(pagination.page)}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsEnrollModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#14233c] to-[#20365c] hover:from-[#1c3052] hover:to-[#2b487b] text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-[#e4b574]" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Bar */}
      <EnrollmentsStatsBar stats={stats} />

      {/* Filter and Search Controls */}
      <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, email, or enrollment ID (e.g. ENR-2026-)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
            />
          </div>

          {/* Program Type Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-accent/40 border border-border self-start md:self-auto">
            <button
              type="button"
              onClick={() => setProgramType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                programType === "ALL"
                  ? "bg-card text-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setProgramType("INTERNSHIP")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                programType === "INTERNSHIP"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold shadow-sm border border-amber-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-3 h-3" />
              Internships
            </button>
            <button
              type="button"
              onClick={() => setProgramType("COURSE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                programType === "COURSE"
                  ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold shadow-sm border border-blue-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              Courses
            </button>
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXTENDED">EXTENDED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="PAUSED">PAUSED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            {/* Quick Extension Filter Pill */}
            <button
              type="button"
              onClick={() => setExtendedOnly(!extendedOnly)}
              className={`h-10 px-3 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                extendedOnly
                  ? "bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40 font-semibold"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Extended Only
            </button>
          </div>
        </div>
      </div>

      {/* Enrollments Data Table */}
      <EnrollmentsDataTable
        items={items}
        isLoading={isLoading}
        onExtend={(item) => setExtendingItem(item)}
        onEdit={(item) => setEditingItem(item)}
        onDelete={(item) => setDeletingItem(item)}
        onRecordPayment={(item) => setPaymentEnrollment(item)}
      />

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{items.length}</span> of{" "}
            <span className="font-semibold text-foreground">{pagination.total}</span> total enrollments
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => fetchData(pagination.page - 1)}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || isLoading}
              onClick={() => fetchData(pagination.page + 1)}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* 1. Enroll Student Modal */}
      <EnrollStudentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onSuccess={() => fetchData(1)}
      />

      {/* 2. Extend Internship Duration Modal */}
      <ExtendInternshipModal
        isOpen={!!extendingItem}
        enrollment={extendingItem}
        onClose={() => setExtendingItem(null)}
        onSuccess={() => fetchData(pagination.page)}
      />

      {/* 3. Edit Enrollment Modal */}
      <EditEnrollmentModal
        isOpen={!!editingItem}
        enrollment={editingItem}
        onClose={() => setEditingItem(null)}
        onSuccess={() => fetchData(pagination.page)}
      />

      {/* 4. Record Fee Payment Modal */}
      <RecordPaymentModal
        isOpen={!!paymentEnrollment}
        preselectedEnrollment={paymentEnrollment}
        onClose={() => setPaymentEnrollment(null)}
        onSuccess={() => fetchData(pagination.page)}
      />

      {/* 4. Delete Confirmation Dialog */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1726]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-foreground">Confirm Unenrollment</h3>
              <p className="text-xs text-muted-foreground">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-foreground">{deletingItem.user?.name}</span> from{" "}
                <span className="font-semibold text-foreground">{deletingItem.program?.title}</span>?
                This action will delete the enrollment history record.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl border border-border hover:bg-accent text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold shadow-sm"
              >
                {isDeleting ? "Removing..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
