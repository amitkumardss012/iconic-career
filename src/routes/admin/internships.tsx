import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import {
  getProgramsListFn,
  toggleProgramStatusFn,
  deleteProgramFn,
  getProgramCategoriesFn,
} from "@/lib/server/programs"
import type { ProgramRecordItem, ProgramStatsSummary, ProgramCategoryItem } from "@/lib/types/programs"
import { ProgramsDataTable } from "@/components/admin/programs/programs-data-table"
import { ProgramFormModal } from "@/components/admin/programs/program-form-modal"
import { CategoryManagerModal } from "@/components/admin/programs/category-manager-modal"
import { toast } from "sonner"
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  RefreshCw,
  FolderTree,
  Sparkles,
  Layers,
  GraduationCap,
  Building2,
  Clock,
} from "lucide-react"

export const Route = createFileRoute("/admin/internships")({
  head: () => ({
    meta: createMetaTags({
      title: "Internship Programs Management | Admin Console",
      description: "Manage industry internship cohorts, partner tracks, durations, and applicant postings.",
      path: "/admin/internships",
    }),
  }),
  loader: async () => {
    return await getProgramsListFn({ data: { type: "INTERNSHIP", page: 1, limit: 10 } })
  },
  component: AdminInternshipsPage,
})

function AdminInternshipsPage() {
  const initialData = Route.useLoaderData()

  const [programs, setPrograms] = React.useState<ProgramRecordItem[]>(initialData?.data || [])
  const [stats, setStats] = React.useState<ProgramStatsSummary>(
    initialData?.stats || { total: 0, courses: 0, internships: 0, published: 0, drafts: 0, totalEnrolled: 0 }
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

  const [categories, setCategories] = React.useState<ProgramCategoryItem[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<number | "">("")
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
  const [isLoading, setIsLoading] = React.useState(false)

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false)
  const [editingProgram, setEditingProgram] = React.useState<ProgramRecordItem | null>(null)

  // Fetch Categories
  const loadCategories = React.useCallback(async () => {
    try {
      const cats = await getProgramCategoriesFn({ data: {} })
      setCategories(cats)
    } catch {
      // ignore
    }
  }, [])

  React.useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // Fetch Programs Query
  const fetchPrograms = React.useCallback(
    async (pageToLoad = pagination.page, limitToLoad = pagination.limit) => {
      setIsLoading(true)
      try {
        const res = await getProgramsListFn({
          data: {
            type: "INTERNSHIP",
            page: pageToLoad,
            limit: limitToLoad,
            search: searchTerm || undefined,
            categoryId: selectedCategory ? Number(selectedCategory) : undefined,
            status: statusFilter as any,
          },
        })

        if (res?.success) {
          setPrograms(res.data)
          setStats(res.stats)
          setPagination(res.pagination)
        }
      } catch (err) {
        console.error("Failed to load internships:", err)
        toast.error("Failed to fetch internship catalog.")
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.page, pagination.limit, searchTerm, selectedCategory, statusFilter]
  )

  // Debounced search trigger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrograms(1, pagination.limit)
    }, 250)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory, statusFilter])

  // Toggle status handler
  const handleToggleStatus = async (program: ProgramRecordItem) => {
    const newStatus = program.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
    try {
      await toggleProgramStatusFn({
        data: {
          id: program.id,
          status: newStatus as any,
        },
      })
      toast.success(`Internship track "${program.title}" marked as ${newStatus}`)
      fetchPrograms()
    } catch {
      toast.error("Failed to update status.")
    }
  }

  // Delete handler
  const handleDelete = async (programId: number) => {
    try {
      await deleteProgramFn({ data: { id: programId } })
      toast.success("Internship track deleted successfully.")
      fetchPrograms()
    } catch {
      toast.error("Failed to delete internship track.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#b8864d]/30 bg-[#b8864d]/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-[#8e653e] uppercase tracking-wider">
            <Sparkles className="size-3 text-[#b8864d]" />
            <span>Corporate Cohort Engine</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Internship Tracks Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Supervise corporate internship offerings, duration cohorts (3, 6, 8 Months), and mentorship deliverables.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchPrograms()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`size-3.5 text-slate-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <FolderTree className="size-3.5 text-[#8e653e]" />
            <span>Manage Domains</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProgram(null)
              setIsFormModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14233c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5 text-[#e4b574]" />
            <span>Post Internship Track</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-slate-500">Active Tracks</span>
            <Briefcase className="size-4 text-[#8e653e]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-slate-900">{stats.internships}</span>
            <span className="text-xs text-slate-400">Total Offerings</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-slate-500">Open Enrollments</span>
            <Sparkles className="size-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-emerald-600">{stats.published}</span>
            <span className="text-xs text-slate-400">Published Cohorts</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-slate-500">Candidates Enrolled</span>
            <GraduationCap className="size-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-slate-900">{stats.totalEnrolled}</span>
            <span className="text-xs text-slate-400">Active Cohorts</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-slate-500">Internship Domains</span>
            <Layers className="size-4 text-violet-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-slate-900">{categories.length}</span>
            <span className="text-xs text-slate-400">Industry Sectors</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search internship title, slug, summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8.5 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <Layers className="size-3 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : "")}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-[#14233c] focus:outline-none"
            >
              <option value="">All Domains</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="size-3 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-[#14233c] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
              <option value="CLOSED">Closed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <ProgramsDataTable
        programs={programs}
        isLoading={isLoading}
        programType="INTERNSHIP"
        pagination={pagination}
        onPageChange={(p) => {
          setPagination((prev) => ({ ...prev, page: p }))
          fetchPrograms(p, pagination.limit)
        }}
        onLimitChange={(l) => {
          setPagination((prev) => ({ ...prev, limit: l, page: 1 }))
          fetchPrograms(1, l)
        }}
        onEdit={(p) => {
          setEditingProgram(p)
          setIsFormModalOpen(true)
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onAddNew={() => {
          setEditingProgram(null)
          setIsFormModalOpen(true)
        }}
      />

      {/* Create / Edit Program Modal */}
      <ProgramFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => fetchPrograms()}
        initialData={editingProgram}
        defaultType="INTERNSHIP"
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoriesChanged={() => {
          loadCategories()
          fetchPrograms()
        }}
      />
    </div>
  )
}
