import * as React from "react"
import type { CertificateStatsSummary } from "@/lib/services/certificates"
import {
  Award,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  DownloadCloud,
} from "lucide-react"

interface CertificatesStatsBarProps {
  stats: CertificateStatsSummary
}

export function CertificatesStatsBar({ stats }: CertificatesStatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
      {/* 01. Total Issued */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Total Certificates</span>
          <div className="size-8 rounded-xl bg-[#14233c]/5 text-[#14233c] flex items-center justify-center">
            <Award className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-[#14233c]">{stats.total}</span>
          <span className="text-[11px] text-[#64748b] block mt-0.5">All ledger credentials</span>
        </div>
      </div>

      {/* 02. Active & Verifiable */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Active Verifiable</span>
          <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-emerald-950">{stats.issued}</span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">Valid & authentic</span>
        </div>
      </div>

      {/* 03. Download Allowed */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Download Allowed</span>
          <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Unlock className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-blue-950">{stats.downloadAllowed}</span>
          <span className="text-[11px] text-[#64748b] block mt-0.5">Permitted for generation</span>
        </div>
      </div>

      {/* 04. Download Locked */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Download Locked</span>
          <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lock className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-amber-950">{stats.downloadLocked}</span>
          <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">Held by admin</span>
        </div>
      </div>

      {/* 05. Revoked */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Revoked</span>
          <div className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-rose-950">{stats.revoked}</span>
          <span className="text-[11px] text-rose-700 font-semibold block mt-0.5">Invalidated credentials</span>
        </div>
      </div>

      {/* 06. Download Telemetry */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Downloads</span>
          <div className="size-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <DownloadCloud className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-purple-950">{stats.totalDownloads}</span>
          <span className="text-[11px] text-purple-700 font-semibold block mt-0.5">Public generation count</span>
        </div>
      </div>
    </div>
  )
}
