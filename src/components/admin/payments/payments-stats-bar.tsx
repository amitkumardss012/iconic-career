import * as React from "react"
import { CreditCard, CheckCircle2, TrendingUp, RefreshCcw, DollarSign, Wallet } from "lucide-react"
import type { PaymentStatsSummary } from "@/lib/services/payments"

interface PaymentsStatsBarProps {
  stats: PaymentStatsSummary
}

export function PaymentsStatsBar({ stats }: PaymentsStatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Net Collections */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm relative overflow-hidden group hover:border-[#b8864d]/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Net Revenue
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#b8864d]/10 text-[#b8864d] flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-serif text-foreground tracking-tight">
            ₹{stats.netRevenue.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Total confirmed payments</p>
      </div>

      {/* 2. Total Transactions Processed */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm relative overflow-hidden group hover:border-blue-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Transactions
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-serif text-foreground tracking-tight">
            {stats.totalTransactions}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {stats.successfulTransactions} successful
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">All gateway & manual entries</p>
      </div>

      {/* 3. Gross Collections */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Gross Collections
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-serif text-foreground tracking-tight">
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Prior to refund deductions</p>
      </div>

      {/* 4. Total Refunds */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Disbursed Refunds
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <RefreshCcw className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-serif text-foreground tracking-tight">
            ₹{stats.totalRefunded.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">Processed refund transactions</p>
      </div>
    </div>
  )
}
