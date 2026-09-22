import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import {
  getPaymentsFn,
  getPaymentStatsFn,
} from "@/lib/server/payments"
import type { PaymentTransactionRecordItem, PaymentStatsSummary } from "@/lib/services/payments"
import { PaymentsStatsBar } from "@/components/admin/payments/payments-stats-bar"
import { PaymentsDataTable } from "@/components/admin/payments/payments-data-table"
import { RecordPaymentModal } from "@/components/admin/payments/record-payment-modal"
import { toast } from "sonner"
import {
  Search,
  Plus,
  RefreshCw,
  CreditCard,
  Filter,
  DollarSign,
  FileText,
} from "lucide-react"

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: createMetaTags({
      title: "Fee Transactions & Ledger | Admin Console",
      description: "Manage tuition fee collections, Razorpay transactions, installment tracking, and financial audit ledgers.",
      path: "/admin/payments",
    }),
  }),
  loader: async () => {
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        getPaymentsFn({ data: { page: 1, limit: 10 } }),
        getPaymentStatsFn(),
      ])
      return {
        payments: paymentsRes,
        stats: statsRes,
      }
    } catch (err) {
      console.error("Payments loader error:", err)
      return {
        payments: {
          items: [] as PaymentTransactionRecordItem[],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        stats: {
          totalRevenue: 0,
          totalTransactions: 0,
          successfulTransactions: 0,
          totalRefunded: 0,
          netRevenue: 0,
        },
      }
    }
  },

  component: AdminPaymentsPage,
})

function AdminPaymentsPage() {
  const initialData = Route.useLoaderData()

  const [items, setItems] = React.useState<PaymentTransactionRecordItem[]>(initialData?.payments?.items || [])
  const [stats, setStats] = React.useState<PaymentStatsSummary>(
    initialData?.stats || {
      totalRevenue: 0,
      totalTransactions: 0,
      successfulTransactions: 0,
      totalRefunded: 0,
      netRevenue: 0,
    }
  )
  const [pagination, setPagination] = React.useState({
    total: initialData?.payments?.total || 0,
    page: initialData?.payments?.page || 1,
    limit: initialData?.payments?.limit || 10,
    totalPages: initialData?.payments?.totalPages || 1,
  })

  // Filter & Search states
  const [search, setSearch] = React.useState("")
  const [gateway, setGateway] = React.useState<string>("ALL")
  const [method, setMethod] = React.useState<string>("ALL")
  const [status, setStatus] = React.useState<string>("ALL")
  const [isLoading, setIsLoading] = React.useState(false)

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = React.useState(false)

  const fetchData = React.useCallback(
    async (pageToLoad = pagination.page) => {
      setIsLoading(true)
      try {
        const [paymentsRes, statsRes] = await Promise.all([
          getPaymentsFn({
            data: {
              page: pageToLoad,
              limit: pagination.limit,
              search: search || undefined,
              gateway: gateway !== "ALL" ? (gateway as any) : undefined,
              method: method !== "ALL" ? (method as any) : undefined,
              status: status !== "ALL" ? (status as any) : undefined,
            },
          }),
          getPaymentStatsFn(),
        ])

        setItems(paymentsRes.items)
        setStats(statsRes)
        setPagination({
          total: paymentsRes.total,
          page: paymentsRes.page,
          limit: paymentsRes.limit,
          totalPages: paymentsRes.totalPages,
        })
      } catch (err: any) {
        console.error("Failed to fetch payments:", err)
        toast.error("Failed to refresh payments ledger.")
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.limit, pagination.page, search, gateway, method, status]
  )

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, gateway, method, status])

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="px-2.5 py-0.5 rounded-full bg-[#b8864d]/15 border border-[#b8864d]/30 text-[#b8864d] font-semibold text-[11px] tracking-wide uppercase">
              Financial Reconciliation & Audits
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
            Fee Collections & Transactions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track student fee payments, manual receipts, installments, and Razorpay gateway settlements.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchData(pagination.page)}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsRecordModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#14233c] to-[#20365c] hover:from-[#1c3052] hover:to-[#2b487b] text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-[#e4b574]" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <PaymentsStatsBar stats={stats} />

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search receipt # (e.g. RCP-2026-), UTR reference, student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40 focus:border-[#b8864d] transition-all"
            />
          </div>

          {/* Gateway Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40"
            >
              <option value="ALL">All Gateways</option>
              <option value="MANUAL_ADMIN">Manual Admin</option>
              <option value="RAZORPAY">Razorpay</option>
              <option value="STRIPE">Stripe</option>
            </select>

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40"
            >
              <option value="ALL">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="NET_BANKING">Net Banking</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#b8864d]/40"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Data Table */}
      <PaymentsDataTable
        items={items}
        isLoading={isLoading}
      />

      {/* Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-semibold text-foreground">{items.length}</span> of{" "}
            <span className="font-semibold text-foreground">{pagination.total}</span> total transactions
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

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSuccess={() => fetchData(1)}
      />
    </div>
  )
}
