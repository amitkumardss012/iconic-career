import * as React from "react"
import { Link, useRouterState, useRouter } from "@tanstack/react-router"
import { getClientSession, clearClientSession } from "@/lib/auth/session"
import { toast } from "sonner"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  Briefcase,
  CreditCard,
  Award,
  Bell,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react"

export interface AdminNavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  description?: string
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "System overview and active metrics",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    description: "System accounts, administrators, and credentials",
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: GraduationCap,
    description: "Enrolled candidates and academic dossiers",
  },
  {
    title: "Enrollments",
    href: "/admin/enrollments",
    icon: UserCheck,
    description: "Student program allocations, durations & period extensions",
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    description: "Curriculum modules and syllabus catalog",
  },
  {
    title: "Internships",
    href: "/admin/internships",
    icon: Briefcase,
    badge: "14 Active",
    description: "Corporate tracks and cohort applications",
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    description: "Tuition invoices, payouts, and revenue",
  },
  {
    title: "Certificates",
    href: "/admin/certificates",
    icon: Award,
    description: "Cryptographic credential issuance",
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    badge: "3 New",
    description: "Candidate broadcasts and alerts",
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
    description: "Institutional intelligence and export logs",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Portal configurations and security",
  },
]

function AdminLogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <img
      src="/logo/logo.png"
      alt="The Iconic Career"
      className={`rounded-full object-contain ${className}`}
    />
  )
}

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const session = getClientSession()

  const userName = session?.name || "Master Administrator"
  const userEmail = session?.email || "admin@iconiccareer.com"
  const userInitials =
    userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD"

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    clearClientSession()
    toast.success("Logged out successfully.")
    router.navigate({ to: "/login" })
  }

  const isItemActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/" || pathname === "/admin/dashboard"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const content = (
    <div className="flex h-full flex-col bg-[#14233c] text-white border-r border-[#22385c]">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-[#22385c]/80 bg-[#101d33]">
        <Link to="/admin" className="flex items-center gap-3 group" onClick={onClose}>
          <AdminLogoMark className="size-7.5 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-heading text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              The Iconic Career
            </span>
            <span className="font-mono text-[0.65rem] tracking-wider text-[#d4af7a] uppercase font-medium flex items-center gap-1">
              <ShieldCheck className="size-3" /> Admin Console
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <div className="px-3 pb-2 text-[0.65rem] font-mono uppercase tracking-widest text-[#94a3b8] font-semibold">
          Operational Modules
        </div>

        {adminNavItems.map((item) => {
          const active = isItemActive(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all duration-150 ${
                active
                  ? "bg-gradient-to-r from-[#b8864d]/25 to-[#8e653e]/15 text-[#f8fafc] border-l-3 border-[#e4b574] shadow-xs font-semibold pl-3"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`size-4.5 transition-colors shrink-0 ${
                    active ? "text-[#e4b574]" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.title}</span>
              </div>

              {item.badge ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.65rem] font-mono font-medium ${
                    active
                      ? "bg-[#b8864d]/30 text-[#e4b574] border border-[#b8864d]/40"
                      : "bg-white/10 text-slate-300 group-hover:bg-white/15"
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                <ChevronRight
                  className={`size-3.5 transition-transform opacity-0 group-hover:opacity-100 ${
                    active ? "opacity-100 text-[#e4b574]" : "text-slate-400"
                  }`}
                />
              )}
            </Link>
          )
        })}
      </div>

      {/* Bottom Switcher & Profile Card */}
      <div className="border-t border-[#22385c] bg-[#101d33]/90 p-3 space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="size-3.5 text-[#d4af7a]" />
            <span>Public Website</span>
          </div>
          <span className="font-mono text-[0.65rem] text-slate-400">Live</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between rounded-lg bg-[#14233c] px-3 py-2.5 border border-[#22385c]">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#b8864d] to-[#e4b574] font-semibold text-[#14233c] text-xs shadow-xs">
              {userInitials}
            </div>
            <div className="flex flex-col truncate max-w-[120px]">
              <span className="text-xs font-semibold text-white leading-tight truncate">{userName}</span>
              <span className="text-[0.65rem] text-slate-400 truncate">{userEmail}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="rounded p-1.5 text-slate-400 hover:bg-white/10 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
