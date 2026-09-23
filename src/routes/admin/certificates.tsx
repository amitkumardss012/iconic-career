import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import {
  getCertificatesFn,
  getCertificateStatsFn,
} from "@/lib/server/certificates"
import type {
  CertificateRecordItem,
  CertificateStatsSummary,
} from "@/lib/services/certificates"
import { CertificatesStatsBar } from "@/components/admin/certificates/certificates-stats-bar"
import { CertificatesDataTable } from "@/components/admin/certificates/certificates-data-table"
import { IssueCertificateModal } from "@/components/admin/certificates/issue-certificate-modal"
import { EditCertificateModal } from "@/components/admin/certificates/edit-certificate-modal"
import {
  Award,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Sparkles,
  Lock,
  Unlock,
} from "lucide-react"

export const Route = createFileRoute("/admin/certificates")({
  head: () => ({
    meta: createMetaTags({
      title: "Certificate Issuance & Verification | Admin Console",
      description: "Issue, customize, update, and manage verifiable certificates with full download access control.",
      path: "/admin/certificates",
    }),
  }),
  loader: async () => {
    try {
      const [certificatesRes, statsRes] = await Promise.all([
        getCertificatesFn({ data: { page: 1, limit: 10 } }),
        getCertificateStatsFn(),
      ])
      return {
        certificates: certificatesRes,
        stats: statsRes,
      }
    } catch (err) {
      console.error("Certificates loader error:", err)
      return {
        certificates: {
          items: [] as CertificateRecordItem[],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        stats: {
          total: 0,
          issued: 0,
          revoked: 0,
          suspended: 0,
          downloadAllowed: 0,
          downloadLocked: 0,
          totalDownloads: 0,
        },
      }
    }
  },
  component: AdminCertificatesPage,
})

function AdminCertificatesPage() {
  const initialData = Route.useLoaderData() as {
    certificates: {
      items: CertificateRecordItem[]
      total: number
      page: number
      limit: number
      totalPages: number
    }
    stats: CertificateStatsSummary
  }

  const [items, setItems] = React.useState<CertificateRecordItem[]>(
    initialData?.certificates?.items || []
  )
  const [stats, setStats] = React.useState<CertificateStatsSummary>(
    initialData?.stats || {
      total: 0,
      issued: 0,
      revoked: 0,
      suspended: 0,
      downloadAllowed: 0,
      downloadLocked: 0,
      totalDownloads: 0,
    }
  )
  const [pagination, setPagination] = React.useState({
    total: initialData?.certificates?.total || 0,
    page: initialData?.certificates?.page || 1,
    limit: initialData?.certificates?.limit || 10,
    totalPages: initialData?.certificates?.totalPages || 1,
  })

  // Filter & Search states
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<string>("ALL")
  const [isDownloadAllowed, setIsDownloadAllowed] = React.useState<"ALL" | "ALLOWED" | "LOCKED">("ALL")
  const [isLoading, setIsLoading] = React.useState(false)

  // Modals state
  const [isIssueModalOpen, setIsIssueModalOpen] = React.useState(false)
  const [editingCert, setEditingCert] = React.useState<CertificateRecordItem | null>(null)

  // Refetch data
  const fetchData = React.useCallback(
    async (targetPage = 1) => {
      try {
        setIsLoading(true)
        const [res, statsRes] = (await Promise.all([
          getCertificatesFn({
            data: {
              page: targetPage,
              limit: pagination.limit,
              search: search.trim() || undefined,
              status: status !== "ALL" ? status : undefined,
              isDownloadAllowed,
            },
          }),
          getCertificateStatsFn(),
        ])) as [
          {
            items: CertificateRecordItem[]
            total: number
            page: number
            limit: number
            totalPages: number
          },
          CertificateStatsSummary,
        ]

        setItems(res.items)
        setPagination({
          total: res.total,
          page: res.page,
          limit: res.limit,
          totalPages: res.totalPages,
        })
        setStats(statsRes)
      } catch (err) {
        console.error("Failed to refresh certificates list:", err)
      } finally {
        setIsLoading(false)
      }
    },
    [search, status, isDownloadAllowed, pagination.limit]
  )

  // Debounced search trigger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1)
    }, 250)
    return () => clearTimeout(timer)
  }, [search, status, isDownloadAllowed])

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-[#14233c]">
              Certificates & Credentials
            </h1>
            <span className="rounded-full bg-[#14233c]/5 px-2.5 py-0.5 text-xs font-semibold text-[#14233c]">
              {pagination.total} Total
            </span>
          </div>
          <p className="text-sm text-[#64748b] mt-1">
            Issue tamper-evident graduation credentials, edit full recipient snapshots, and control download permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchData(pagination.page)}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl border border-[#e2dcce] bg-white px-3 py-2 text-xs font-semibold text-[#14233c] hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh Ledger"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin text-[#b8864d]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#14233c] to-[#1e3458] px-4 py-2 text-sm font-bold text-white shadow-md hover:opacity-95 transition-all"
          >
            <Plus className="size-4 text-[#d4af37]" />
            <span>Issue Certificate</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Metric Bar */}
      <CertificatesStatsBar stats={stats} />

      {/* 3. Search & Filters Bar */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#64748b]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by cert number, student name, email, program..."
            className="w-full rounded-xl border border-[#e2dcce] bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-[#14233c] placeholder-[#94a3b8] focus:border-[#b8864d] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-[#e2dcce] bg-white px-2.5 py-1.5 text-xs text-[#14233c] focus:border-[#b8864d] focus:outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ISSUED">ISSUED (Active)</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="REVOKED">REVOKED</option>
            </select>
          </div>

          {/* Download Permission Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Download:</span>
            <select
              value={isDownloadAllowed}
              onChange={(e) => setIsDownloadAllowed(e.target.value as any)}
              className="rounded-xl border border-[#e2dcce] bg-white px-2.5 py-1.5 text-xs text-[#14233c] focus:border-[#b8864d] focus:outline-none font-medium"
            >
              <option value="ALL">All Access</option>
              <option value="ALLOWED">Allowed (Permitted)</option>
              <option value="LOCKED">Locked (Hold)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Certificates Data Table */}
      <CertificatesDataTable
        items={items}
        pagination={pagination}
        onPageChange={(p) => fetchData(p)}
        onEdit={(cert) => setEditingCert(cert)}
        onRefresh={() => fetchData(pagination.page)}
        isLoading={isLoading}
      />

      {/* 5. Issue Certificate Modal */}
      <IssueCertificateModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSuccess={() => fetchData(1)}
      />

      {/* 6. Edit Certificate Modal (ALL FIELDS EDITABLE) */}
      <EditCertificateModal
        isOpen={!!editingCert}
        certificate={editingCert}
        onClose={() => setEditingCert(null)}
        onSuccess={() => fetchData(pagination.page)}
      />
    </div>
  )
}
