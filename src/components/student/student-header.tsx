import * as React from "react"
import { useRouterState, Link } from "@tanstack/react-router"
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  BookOpen,
  HelpCircle,
} from "lucide-react"

interface StudentHeaderProps {
  onOpenSidebar: () => void
}

export function StudentHeader({ onOpenSidebar }: StudentHeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const getPageTitle = (path: string) => {
    const clean = path.replace("/student", "").replace("/", "")
    if (!clean || clean === "dashboard") return "My Learning Dashboard"
    if (clean === "courses") return "My Enrolled Courses"
    if (clean === "programs") return "My Internship Programs"
    if (clean === "certificates") return "My Verified Certificates"
    return clean.charAt(0).toUpperCase() + clean.slice(1)
  }

  const currentTitle = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open Student Navigation"
        >
          <Menu className="size-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
          <Link to="/student" className="hover:text-slate-900 transition-colors flex items-center gap-1">
            <Sparkles className="size-3.5 text-[#b8864d]" />
            <span className="hidden sm:inline">Student</span>
          </Link>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">{currentTitle}</span>
        </nav>
      </div>

      {/* Center/Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons, milestones, docs... (Ctrl+K)"
            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-8.5 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-[0.7rem] font-medium text-emerald-800">
          <CheckCircle2 className="size-3 text-emerald-600" />
          <span>Active Enrollment</span>
        </div>

        {/* Notifications */}
        <Link
          to="/student/dashboard"
          className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Announcements & Alerts"
        >
          <Bell className="size-4.5" />
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#b8864d] text-[0.6rem] font-bold text-white shadow-xs">
            2
          </span>
        </Link>

        {/* Help / Docs */}
        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Student Help Desk"
        >
          <HelpCircle className="size-4.5" />
        </button>
      </div>
    </header>
  )
}
