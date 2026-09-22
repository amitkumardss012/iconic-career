import * as React from "react"
import type { EnrollmentStatsSummary } from "@/lib/services/enrollments"
import {
  UserCheck,
  Briefcase,
  BookOpen,
  Clock,
  Award,
  Sparkles,
} from "lucide-react"

interface EnrollmentsStatsBarProps {
  stats: EnrollmentStatsSummary
}

export function EnrollmentsStatsBar({ stats }: EnrollmentsStatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {/* 01. Total Enrollments */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">Total Files</span>
          <div className="size-8 rounded-xl bg-[#14233c]/5 text-[#14233c] flex items-center justify-center">
            <UserCheck className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-[#14233c]">{stats.total}</span>
          <span className="text-[11px] text-[#64748b] block mt-0.5">All registered allocations</span>
        </div>
      </div>

      {/* 02. Active Internships */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Internship Tracks</span>
          <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Briefcase className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-amber-950">{stats.activeInternships}</span>
          <span className="text-[11px] text-[#64748b] block mt-0.5">Corporate cohort briefs</span>
        </div>
      </div>

      {/* 03. Active Courses */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Course Tracks</span>
          <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-blue-950">{stats.activeCourses}</span>
          <span className="text-[11px] text-[#64748b] block mt-0.5">Self-paced & batch courses</span>
        </div>
      </div>

      {/* 04. Extended Internships */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Extended Periods</span>
          <div className="size-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-purple-950">{stats.extendedInternships}</span>
          <span className="text-[11px] text-purple-700 font-semibold block mt-0.5">With approved extension</span>
        </div>
      </div>

      {/* 05. Completed */}
      <div className="rounded-2xl border border-[#e2dcce] bg-white p-4 shadow-xs flex flex-col justify-between hover:border-[#b8864d]/60 transition-all col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Completed & Alumni</span>
          <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold font-heading text-emerald-950">{stats.completed}</span>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">Milestones certified</span>
        </div>
      </div>
    </div>
  )
}
