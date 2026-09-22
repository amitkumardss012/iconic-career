import * as React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { getClientSession } from "@/lib/auth/session"
import {
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  PlayCircle,
  FileCheck2,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react"

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: createMetaTags({
      title: "Student Dashboard | The Iconic Career",
      description: "Candidate learning dashboard, active courses, milestone submissions, and certificates.",
      path: "/student",
    }),
  }),
  component: StudentDashboardPage,
})

export function StudentDashboardPage() {
  const session = getClientSession()
  const candidateName = session?.name || "Candidate"

  const stats = [
    {
      title: "Active Courses",
      value: "2 Enrolled",
      change: "On schedule",
      icon: BookOpen,
      color: "from-blue-600 to-indigo-700",
      href: "/student/courses",
    },
    {
      title: "Internship Tracks",
      value: "1 Cohort",
      change: "Week 4 of 8",
      icon: GraduationCap,
      color: "from-[#b8864d] to-[#8e653e]",
      href: "/student/programs",
    },
    {
      title: "Milestones Cleared",
      value: "14 of 18",
      change: "78% progress",
      icon: FileCheck2,
      color: "from-emerald-600 to-teal-700",
      href: "/student/courses",
    },
    {
      title: "Verified Credentials",
      value: "1 Issued",
      change: "Cryptographically signed",
      icon: Award,
      color: "from-violet-600 to-purple-700",
      href: "/student/certificates",
    },
  ]

  const activeCourses = [
    {
      id: "fs-101",
      title: "Full Stack Web Engineering & Architecture",
      cohort: "Cohort 2026-Q1",
      progress: 82,
      currentLesson: "Module 6: High-Performance Database Design with PostgreSQL",
      instructor: "Dr. Vikram Sethi",
      nextDeadline: "Milestone 4 due in 3 days",
    },
    {
      id: "ai-201",
      title: "Applied AI & Machine Learning Foundations",
      cohort: "Cohort 2026-Q1",
      progress: 65,
      currentLesson: "Module 4: Supervised Learning & Loss Optimization",
      instructor: "Ananya Roy",
      nextDeadline: "Lab 3 submission due in 5 days",
    },
  ]

  const quickNavs = [
    {
      title: "My Enrolled Courses",
      desc: "Access video lectures, code sandboxes, and milestone deliverables.",
      icon: BookOpen,
      href: "/student/courses",
      badge: "2 Courses",
    },
    {
      title: "My Internship Programs",
      desc: "Track company deliverables, supervisor evaluations, and stipend logs.",
      icon: GraduationCap,
      href: "/student/programs",
      badge: "1 Track",
    },
    {
      title: "My Certificates",
      desc: "Download verified tamper-evident diplomas and share verification badges.",
      icon: Award,
      href: "/student/certificates",
      badge: "1 Issued",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Candidate Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14233c] via-[#1b3052] to-[#22385c] p-6 sm:p-8 text-white shadow-md border border-[#2a4570]">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 size-64 rounded-full bg-[#b8864d]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b8864d]/40 bg-[#b8864d]/20 px-3 py-1 text-xs font-medium text-[#e4b574]">
              <Sparkles className="size-3.5 text-[#e4b574]" />
              <span>Student & Candidate Workspace</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Welcome back, {candidateName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              You are currently on track for your supervised company internship cohort. Keep up the strong momentum!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/courses"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#b8864d] to-[#e4b574] px-4 py-2 text-xs font-semibold text-[#14233c] hover:opacity-95 transition-opacity shadow-xs"
            >
              <PlayCircle className="size-3.5" />
              <span>Resume Current Lesson</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Link
              key={i}
              to={stat.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#b8864d]/50 hover:shadow-md block"
            >
              <div className="flex items-center justify-between">
                <div className="text-[0.72rem] font-medium uppercase tracking-wider text-slate-500">
                  {stat.title}
                </div>
                <div className={`flex size-9 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-xs`}>
                  <Icon className="size-4.5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  {stat.value}
                </span>
                <span className="text-[0.7rem] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {stat.change}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[0.7rem] font-medium text-[#8e653e] group-hover:text-[#6a4828] transition-colors">
                <span>Open module</span>
                <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* In-Progress Courses Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">In-Progress Courses</h2>
            <p className="text-xs text-slate-500">Continue where you left off</p>
          </div>
          <Link
            to="/student/courses"
            className="text-xs font-semibold text-[#8e653e] hover:text-[#6a4828] flex items-center gap-1"
          >
            <span>All Courses</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {activeCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#b8864d] bg-[#b8864d]/10 px-2.5 py-0.5 rounded">
                    {course.cohort}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{course.progress}% Complete</span>
                </div>

                <h3 className="font-heading text-lg font-bold text-slate-900 mt-3">{course.title}</h3>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                  <PlayCircle className="size-3.5 text-[#b8864d]" />
                  <span>{course.currentLesson}</span>
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-5 space-y-3">
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#b8864d] to-[#e4b574] transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="size-3 text-amber-600" />
                    {course.nextDeadline}
                  </span>
                  <Link
                    to="/student/courses"
                    className="font-semibold text-[#14233c] hover:text-[#b8864d] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Continue</span>
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Modules Navigation */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900">Candidate Modules</h2>
          <p className="text-xs text-slate-500">Jump directly into your learning materials</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickNavs.map((nav) => {
            const Icon = nav.icon
            return (
              <Link
                key={nav.title}
                to={nav.href}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#14233c] hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-[#14233c] transition-colors group-hover:bg-[#14233c] group-hover:text-white">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium text-slate-600">
                      {nav.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-base font-bold text-slate-900 group-hover:text-[#14233c] transition-colors">
                    {nav.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {nav.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-[#8e653e] group-hover:text-[#14233c]">
                    Open section
                  </span>
                  <ArrowUpRight className="size-3.5 text-[#8e653e] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
