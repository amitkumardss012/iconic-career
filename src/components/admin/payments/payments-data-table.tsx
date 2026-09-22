import * as React from "react"
import {
  CreditCard,
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCcw,
  FileText,
  DollarSign,
  Briefcase,
  GraduationCap,
  Building2,
  QrCode,
  Landmark,
} from "lucide-react"
import type { PaymentTransactionRecordItem } from "@/lib/services/payments"

interface PaymentsDataTableProps {
  items: PaymentTransactionRecordItem[]
  isLoading?: boolean
  onRefund?: (transaction: PaymentTransactionRecordItem) => void
}

export function PaymentsDataTable({
  items,
  isLoading,
  onRefund,
}: PaymentsDataTableProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-card rounded-2xl border border-border/80 p-12 text-center">
        <div className="w-8 h-8 border-2 border-[#b8864d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-medium">Loading payment ledger...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="w-full bg-card rounded-2xl border border-dashed border-border/80 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-accent/50 text-muted-foreground flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No payments found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          No fee transactions match your current search filters. Record a manual payment using the button above.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-accent/20 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <th className="py-3.5 px-4 pl-6">Receipt & Student</th>
              <th className="py-3.5 px-4">Program Track</th>
              <th className="py-3.5 px-4">Amount (₹)</th>
              <th className="py-3.5 px-4">Method & Channel</th>
              <th className="py-3.5 px-4">Transaction Status</th>
              <th className="py-3.5 px-4 pr-6">Date & Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {items.map((item) => {
              const isSuccess = item.status === "SUCCESS"
              const isRefunded = item.status === "REFUNDED" || item.status === "PARTIALLY_REFUNDED"

              return (
                <tr key={item.id} className="hover:bg-accent/30 transition-colors group">
                  {/* Column 1: Receipt & Student */}
                  <td className="py-4 px-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14233c] to-[#20365c] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                        {item.user?.name ? item.user.name.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          {item.user?.name || "Student"}
                        </div>
                        <div className="text-muted-foreground text-[11px]">
                          {item.user?.email || "No email"}
                        </div>
                        <div className="text-[10px] font-mono text-[#b8864d] font-semibold mt-0.5 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {item.receiptNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Program Track */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground text-xs">
                        {item.enrollment?.program?.title || "Program"}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Enrollment: {item.enrollment?.enrollmentNumber || "N/A"}
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Amount */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-foreground">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </div>
                      {isRefunded && item.refundAmount && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400">
                          Refunded: ₹{item.refundAmount.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Column 4: Method & Gateway */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent border border-border text-foreground">
                        {item.method}
                      </span>
                      <div className="text-[10px] text-muted-foreground">
                        Channel: <span className="font-medium">{item.gateway}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 5: Status */}
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isSuccess
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          : isRefunded
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {isSuccess && <CheckCircle2 className="w-3 h-3" />}
                      {isRefunded && <RefreshCcw className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>

                  {/* Column 6: Date & Reference */}
                  <td className="py-4 px-4 pr-6">
                    <div className="space-y-0.5">
                      <div className="text-xs text-foreground font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {new Date(item.paidAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      {item.transactionReference ? (
                        <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[160px]">
                          Ref: {item.transactionReference}
                        </div>
                      ) : (
                        <div className="text-[10px] text-muted-foreground/60 italic">No external ref</div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
