import * as React from "react"
import {
  MoreVertical,
  Edit,
  KeyRound,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Plus,
  Users as UsersIcon,
  Search,
} from "lucide-react"
import type { UserSafe } from "@/lib/services/user"

interface UsersDataTableProps {
  users: UserSafe[]
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
  onEdit: (user: UserSafe) => void
  onResetPassword: (user: UserSafe) => void
  onAddNew: () => void
}

export function UsersDataTable({
  users,
  isLoading,
  pagination,
  onPageChange,
  onLimitChange,
  onEdit,
  onResetPassword,
  onAddNew,
}: UsersDataTableProps) {
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null)

  React.useEffect(() => {
    const handleDocumentClick = () => setOpenDropdownId(null)
    window.addEventListener("click", handleDocumentClick)
    return () => window.removeEventListener("click", handleDocumentClick)
  }, [])

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") {
      return "bg-[#b8864d]/15 text-[#8e653e] border-[#b8864d]/30"
    }
    return "bg-blue-50 text-blue-700 border-blue-200"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3.5">User Details</th>
              <th className="px-5 py-3.5">Contact</th>
              <th className="px-5 py-3.5">System Role</th>
              <th className="px-5 py-3.5">Registered</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="size-6 animate-spin rounded-full border-2 border-[#14233c] border-t-transparent" />
                    <span className="text-xs font-medium text-slate-500">Loading user catalog...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="mx-auto max-w-sm flex flex-col items-center justify-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <UsersIcon className="size-6" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-heading text-base font-bold text-slate-900">
                        No Administrator Accounts Located
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Try adjusting your search criteria or provision a new administrator account.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onAddNew}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#14233c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs cursor-pointer"
                    >
                      <Plus className="size-3.5 text-[#e4b574]" />
                      <span>Add Administrator</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isMenuOpen = openDropdownId === user.id
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onEdit(user)}
                  >
                    {/* User Details */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold font-mono ${
                            user.role === "ADMIN"
                              ? "bg-[#14233c] text-[#e4b574] border border-[#b8864d]/40"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {initials}
                        </div>

                        <div className="flex flex-col truncate max-w-[240px]">
                          <span className="font-semibold text-slate-900 group-hover:text-[#14233c] transition-colors truncate">
                            {user.name}
                          </span>
                          <span className="font-mono text-[0.68rem] text-slate-400 truncate">
                            ID: #{user.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="inline-flex items-center gap-1.5 font-mono text-slate-700">
                          <Mail className="size-3 text-slate-400 shrink-0" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-slate-400">
                            <Phone className="size-2.5 text-slate-400 shrink-0" />
                            {user.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[0.65rem] font-bold uppercase tracking-wider border ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="size-3" />
                        ) : (
                          <GraduationCap className="size-3" />
                        )}
                        <span>{user.role}</span>
                      </span>
                    </td>

                    {/* Registered Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-slate-500">
                        <Calendar className="size-3 text-slate-400" />
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td
                      className="px-5 py-3.5 text-right whitespace-nowrap relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenDropdownId(isMenuOpen ? null : user.id)
                        }}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-5 top-10 z-30 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              onEdit(user)
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <Edit className="size-3.5 text-[#8e653e]" />
                            <span>Edit Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOpenDropdownId(null)
                              onResetPassword(user)
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <KeyRound className="size-3.5 text-amber-600" />
                            <span>Reset Password</span>
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
            Showing <strong className="font-semibold text-slate-900">{users.length}</strong> of{" "}
            <strong className="font-semibold text-slate-900">{pagination.total}</strong> accounts
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
