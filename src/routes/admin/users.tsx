import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { getUsersFn } from "@/lib/server/users"
import type { UserSafe, PaginatedUsersResult } from "@/lib/services/user"
import { UsersDataTable } from "@/components/admin/users/users-data-table"
import { UserFormModal } from "@/components/admin/users/user-form-modal"
import { ResetPasswordModal } from "@/components/admin/users/reset-password-modal"
import { toast } from "sonner"
import {
  Users,
  Shield,
  GraduationCap,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Sparkles,
  KeyRound,
} from "lucide-react"

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: createMetaTags({
      title: "Administrators Management | Admin Console",
      description: "Manage system administrator accounts, console privileges, and perform direct password resets.",
      path: "/admin/users",
    }),
  }),
  loader: async () => {
    return await getUsersFn({ data: { page: 1, limit: 10, role: "ADMIN" } })
  },
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const initialData = Route.useLoaderData() as PaginatedUsersResult

  const [users, setUsers] = React.useState<UserSafe[]>(initialData?.data || [])
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
  const [sortBy, setSortBy] = React.useState<"createdAt" | "name" | "email" | "role" | "id">("createdAt")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = React.useState(false)

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<UserSafe | null>(null)
  const [resetPasswordUser, setResetPasswordUser] = React.useState<UserSafe | null>(null)

  // Load / Query users (Strictly role: "ADMIN")
  const fetchUsers = React.useCallback(
    async (pageToLoad = pagination.page, limitToLoad = pagination.limit) => {
      setIsLoading(true)
      try {
        const res = await getUsersFn({
          data: {
            page: pageToLoad,
            limit: limitToLoad,
            role: "ADMIN",
            search: searchTerm.trim() || undefined,
            sortBy,
            sortOrder,
          },
        })

        setUsers(res.data)
        setPagination(res.pagination)
      } catch (err: any) {
        toast.error("Failed to load administrator accounts. " + (err.message || ""))
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.page, pagination.limit, searchTerm, sortBy, sortOrder]
  )

  // Trigger search / filter on change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, pagination.limit)
    }, 250)
    return () => clearTimeout(timer)
  }, [searchTerm, sortBy, sortOrder])

  return (
    <div className="space-y-6">
      {/* 01. Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
              Administrators
            </h1>
            <span className="rounded-full bg-[#14233c]/10 px-2.5 py-0.5 text-xs font-bold text-[#14233c]">
              {pagination.total} Admins
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage console administrators, institutional privileges, and perform direct password resets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchUsers()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingUser(null)
              setIsFormModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14233c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5 text-[#e4b574]" />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      {/* 02. Stats Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#b8864d]/15 text-[#8e653e]">
            <Shield className="size-5" />
          </div>
          <div>
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
              Total Administrators
            </span>
            <h4 className="font-heading text-lg font-bold text-[#8e653e]">{pagination.total}</h4>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#14233c]/10 text-[#14233c]">
            <Users className="size-5" />
          </div>
          <div>
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
              Active Console Access
            </span>
            <h4 className="font-heading text-lg font-bold text-slate-900">{pagination.total} Active</h4>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <KeyRound className="size-5" />
          </div>
          <div>
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
              Password Security
            </span>
            <h4 className="font-heading text-lg font-bold text-emerald-700">Scrypt Secured</h4>
          </div>
        </div>
      </div>

      {/* 03. Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="size-4" />
          </div>
          <input
            type="text"
            placeholder="Search administrators by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9.5 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-[0.68rem] font-medium text-slate-400">Sort by:</span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split("-")
              setSortBy(sb as any)
              setSortOrder(so as any)
            }}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-[#14233c] focus:outline-none cursor-pointer"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="email-asc">Email (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 04. Data Table */}
      <UsersDataTable
        users={users}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => fetchUsers(page, pagination.limit)}
        onLimitChange={(limit) => fetchUsers(1, limit)}
        onEdit={(user) => {
          setEditingUser(user)
          setIsFormModalOpen(true)
        }}
        onResetPassword={(user) => {
          setResetPasswordUser(user)
        }}
        onAddNew={() => {
          setEditingUser(null)
          setIsFormModalOpen(true)
        }}
      />

      {/* 05. User Form Modal (Create / Edit) */}
      <UserFormModal
        isOpen={isFormModalOpen}
        initialData={editingUser}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => fetchUsers(pagination.page, pagination.limit)}
      />

      {/* 06. Direct Admin Password Reset Modal */}
      <ResetPasswordModal
        isOpen={!!resetPasswordUser}
        user={resetPasswordUser}
        onClose={() => setResetPasswordUser(null)}
        onSuccess={() => fetchUsers(pagination.page, pagination.limit)}
      />
    </div>
  )
}
