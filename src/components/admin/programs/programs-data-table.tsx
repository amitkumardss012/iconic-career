import * as React from "react"
import {
  MoreVertical,
  Edit,
  Power,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Briefcase,
  Star,
  Flame,
  Sparkles,
  Calendar,
  Clock,
  Plus,
  Layers,
} from "lucide-react"
import type { ProgramRecordItem } from "@/lib/types/programs"
import { resolveImageUrl } from "@/lib/types/programs"

interface ProgramsDataTableProps {
  programs: ProgramRecordItem[]
  isLoading: boolean
  programType?: "COURSE" | "INTERNSHIP" | "ALL"
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
  onEdit: (program: ProgramRecordItem) => void
  onToggleStatus: (program: ProgramRecordItem) => void
  onDelete: (programId: number) => void
  onAddNew: () => void
}

export function ProgramsDataTable({
  programs,
  isLoading,
  programType = "ALL",
  pagination,
  onPageChange,
  onLimitChange,
  onEdit,
  onToggleStatus,
  onDelete,
  onAddNew,
}: ProgramsDataTableProps) {
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null)

  React.useEffect(() => {
    const handleDocumentClick = () => setOpenDropdownId(null)
    window.addEventListener("click", handleDocumentClick)
    return () => window.removeEventListener("click", handleDocumentClick)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "DRAFT":
        return "bg-slate-100 text-slate-600 border-slate-200"
      case "CLOSED":
        return "bg-amber-50 text-[#8e653e] border-[#b8864d]/30"
      case "ARCHIVED":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3.5">Program & Curriculum</th>
              <th className="px-5 py-3.5">Domain / Category</th>
              <th className="px-5 py-3.5">Duration / Batch</th>
              <th className="px-5 py-3.5">Pricing</th>
              <th className="px-5 py-3.5">Rating</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="size-6 animate-spin rounded-full border-2 border-[#14233c] border-t-transparent" />
                    <span className="text-xs font-medium text-slate-500">Loading catalog...</span>
                  </div>
                </td>
              </tr>
            ) : programs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="mx-auto max-w-sm flex flex-col items-center justify-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      {programType === "INTERNSHIP" ? <Briefcase className="size-6" /> : <BookOpen className="size-6" />}
                    </div>
                    <div className="text-center">
                      <h4 className="font-heading text-base font-bold text-slate-900">
                        No {programType === "INTERNSHIP" ? "Internship Tracks" : "Courses"} Located
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Get started by publishing your first curriculum offering or adjust your search filter.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onAddNew}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#14233c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="size-3.5 text-[#e4b574]" />
                      <span>Create {programType === "INTERNSHIP" ? "Internship" : "Course"}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              programs.map((program) => {
                const isMenuOpen = openDropdownId === program.id
                const thumbUrl = resolveImageUrl(program.thumbnail)

                return (
                  <tr
                    key={program.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onEdit(program)}
                  >
                    {/* Thumbnail, Title, Slug & Badges */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={program.title}
                              className="size-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-slate-400">
                              {program.type === "INTERNSHIP" ? (
                                <Briefcase className="size-4.5" />
                              ) : (
                                <BookOpen className="size-4.5" />
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 max-w-[240px]">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 group-hover:text-[#14233c] transition-colors truncate">
                              {program.title}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[0.65rem] text-slate-400 truncate">
                              /{program.slug}
                            </span>

                            {program.isBestseller && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.2 text-[0.6rem] font-bold text-amber-700 border border-amber-200">
                                <Flame className="size-2.5" /> Bestseller
                              </span>
                            )}

                            {program.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#b8864d]/10 px-1.5 py-0.2 text-[0.6rem] font-bold text-[#8e653e] border border-[#b8864d]/20">
                                <Sparkles className="size-2.5" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[0.7rem] font-medium text-slate-700">
                        <Layers className="size-3 text-slate-400" />
                        {program.category?.name || "General"}
                      </span>
                    </td>

                    {/* Duration / Schedule */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col text-[0.72rem]">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                          <Clock className="size-3 text-slate-400" />
                          {program.duration || "Self-Paced"}
                        </span>
                        {program.startDate && (
                          <span className="inline-flex items-center gap-1 text-[0.65rem] text-slate-400 font-mono">
                            <Calendar className="size-2.5" />
                            {new Date(program.startDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">
                          {program.price === 0 ? "Free" : `₹${program.price.toLocaleString("en-IN")}`}
                        </span>
                        {program.discountPrice && (
                          <span className="text-[0.65rem] text-slate-400 line-through">
                            ₹{program.discountPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 rounded-md bg-amber-50/80 px-2 py-0.5 text-xs font-bold text-amber-900 border border-amber-200/50">
                        <Star className="size-3 text-amber-500 fill-amber-500" />
                        <span>{program.rating}</span>
                        <span className="text-[0.65rem] font-normal text-slate-400">
                          ({program.ratingCount})
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-medium border ${getStatusBadge(program.status)}`}>
                        {program.status}
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
                          setOpenDropdownId(isMenuOpen ? null : program.id)
                        }}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-5 top-10 z-30 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              onEdit(program)
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Edit className="size-3.5 text-[#8e653e]" />
                            <span>Edit Program</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              onToggleStatus(program)
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Power className="size-3.5 text-amber-600" />
                            <span>
                              {program.status === "PUBLISHED" ? "Unpublish (Draft)" : "Publish (Live)"}
                            </span>
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              if (window.confirm(`Delete program "${program.title}"?`)) {
                                onDelete(program.id)
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
            Showing <strong className="font-semibold text-slate-900">{programs.length}</strong> of{" "}
            <strong className="font-semibold text-slate-900">{pagination.total}</strong> offerings
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
