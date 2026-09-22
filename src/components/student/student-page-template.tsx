import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  BookOpen,
  PlayCircle,
  FileCheck,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react"

export interface MetricCardItem {
  label: string
  value: string
  change?: string
}

export interface StudentPageTemplateProps {
  moduleName: string
  category: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  badgeText?: string
  metrics?: MetricCardItem[]
  features?: string[]
  primaryActionLabel?: string
}

export function StudentPageTemplate({
  moduleName,
  category,
  description,
  icon: Icon,
  badgeText = "Enrolled & Active",
  metrics = [
    { label: "Enrolled Modules", value: "8 Modules", change: "6 Completed" },
    { label: "Milestone Score", value: "96%", change: "Top 5% Cohort" },
    { label: "Attendance", value: "100%", change: "Perfect Record" },
    { label: "Target Completion", value: "18 Days", change: "On Track" },
  ],
  features = [
    "Interactive code sandboxes, live test suites, and instant feedback",
    "Direct weekly 1:1 mentor review and portfolio advisory calls",
    "Digital project showcase portfolio linked to verified employer portal",
    "One-click cryptographic certificate claim upon final defense submission",
  ],
  primaryActionLabel = "Resume Learning",
}: StudentPageTemplateProps) {
  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#14233c] to-[#22385c] text-white shadow-sm">
            <Icon className="size-6 text-[#e4b574]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#b8864d]">
                {category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-800">
                <CheckCircle2 className="size-2.5 text-emerald-600" />
                {badgeText}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              {moduleName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <RefreshCw className="size-3.5 text-slate-400" />
            <span>Sync Progress</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14233c] px-4 py-2 text-xs font-medium text-white hover:bg-[#1e3458] transition-colors shadow-xs"
          >
            <PlayCircle className="size-3.5 text-[#e4b574]" />
            <span>{primaryActionLabel}</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-hover hover:border-slate-300"
          >
            <span className="text-[0.7rem] font-medium text-slate-500 uppercase tracking-wider">
              {metric.label}
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-heading text-2xl font-bold text-slate-900">{metric.value}</span>
              {metric.change && (
                <span className="text-[0.68rem] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  {metric.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Learning Workspace Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 size-48 rounded-full bg-gradient-to-br from-[#e4b574]/10 to-transparent blur-2xl pointer-events-none" />

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#b8864d]/30 bg-[#b8864d]/10 px-3 py-1 text-xs font-medium text-[#8e653e] mb-4">
            <Sparkles className="size-3.5 text-[#b8864d]" />
            <span>Curriculum Track Active</span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {moduleName} Candidate Learning Hub
          </h2>

          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Your coursework, milestone tasks, and supervised submissions for <strong className="text-slate-900">{moduleName}</strong> are
            synchronized with your cohort instructors.
          </p>

          {/* Curriculum Capabilities Checklist */}
          <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50/80 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Layers className="size-4 text-[#b8864d]" />
              Learning Deliverables & Milestones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/student"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#14233c] hover:text-[#b8864d] transition-colors"
            >
              <span>Back to Student Dashboard</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
