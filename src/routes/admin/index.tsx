import * as React from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  CreditCard,
  Award,
  Bell,
  BarChart3,
  Settings,
  TrendingUp,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  PlusCircle,
  Download,
} from "lucide-react"

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: createMetaTags({
      title: "Admin Dashboard | The Iconic Career",
      description: "Executive operational overview and centralized administration portal.",
      path: "/admin",
    }),
  }),
  component: AdminDashboardPage,
})

export function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Enrolled Students",
      value: "1,248",
      change: "+18.4% vs last month",
      isPositive: true,
      icon: GraduationCap,
      color: "from-blue-600 to-indigo-700",
      href: "/admin/students",
    },
    {
      title: "Active Internships",
      value: "14 Tracks",
      change: "48 Candidates in cohort",
      isPositive: true,
      icon: Briefcase,
      color: "from-[#b8864d] to-[#8e653e]",
      href: "/admin/internships",
    },
    {
      title: "Tuition & Fee Revenue",
      value: "₹24,80,000",
      change: "+12.2% monthly run rate",
      isPositive: true,
      icon: CreditCard,
      color: "from-emerald-600 to-teal-700",
      href: "/admin/payments",
    },
    {
      title: "Issued Certificates",
      value: "412 Issued",
      change: "100% Cryptographically verified",
      isPositive: true,
      icon: Award,
      color: "from-violet-600 to-purple-700",
      href: "/admin/certificates",
    },
  ]

  const quickModules = [
    {
      name: "Students Directory",
      desc: "Review candidate applications, dossier verification, and student profiles.",
      icon: Users,
      href: "/admin/students",
      badge: "1,248 Records",
    },
    {
      name: "Course Catalog",
      desc: "Manage curriculum tracks, lesson modules, and academic certifications.",
      icon: BookOpen,
      href: "/admin/courses",
      badge: "8 Programs",
    },
    {
      name: "Internship Programs",
      desc: "Supervise company internship tracks and mentor performance evaluations.",
      icon: Briefcase,
      href: "/admin/internships",
      badge: "14 Active",
    },
    {
      name: "Fee Transactions",
      desc: "Track Razorpay / gateway payments, invoice receipts, and tuition plans.",
      icon: CreditCard,
      href: "/admin/payments",
      badge: "₹24.8L Processed",
    },
    {
      name: "Certificate Ledger",
      desc: "Generate, digitally sign, and verify cryptographic graduation credentials.",
      icon: Award,
      href: "/admin/certificates",
      badge: "412 Issued",
    },
    {
      name: "Announcements & Alerts",
      desc: "Broadcast notifications and system updates to registered candidate pools.",
      icon: Bell,
      href: "/admin/notifications",
      badge: "3 Scheduled",
    },
    {
      name: "Analytics & Reports",
      desc: "Generate audit logs, placement reports, and executive summaries.",
      icon: BarChart3,
      href: "/admin/reports",
      badge: "Reports Ready",
    },
    {
      name: "System Settings",
      desc: "Configure role-based access, API keys, email SMTP, and platform options.",
      icon: Settings,
      href: "/admin/settings",
      badge: "v1.0.4 Config",
    },
  ]

  const recentActivities = [
    {
      id: "act-1",
      user: "Aarav Sharma",
      action: "enrolled in Full Stack Web Engineering",
      time: "10 minutes ago",
      type: "enrollment",
    },
    {
      id: "act-2",
      user: "System Ledger",
      action: "issued verified certificate #IC-2026-8942",
      time: "42 minutes ago",
      type: "certificate",
    },
    {
      id: "act-3",
      user: "Priya Patel",
      action: "submitted milestone dossier for AI/ML Track",
      time: "2 hours ago",
      type: "submission",
    },
    {
      id: "act-4",
      user: "Payment Gateway",
      action: "confirmed tuition payment ₹14,999 (TXN-9021)",
      time: "3 hours ago",
      type: "payment",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14233c] via-[#1b3052] to-[#22385c] p-6 sm:p-8 text-white shadow-md border border-[#2a4570]">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 size-64 rounded-full bg-[#b8864d]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b8864d]/40 bg-[#b8864d]/20 px-3 py-1 text-xs font-medium text-[#e4b574]">
              <Sparkles className="size-3.5 text-[#e4b574]" />
              <span>Administrative Operations Portal</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Welcome back, Administrator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time monitoring across candidate enrollments, corporate internship cohorts, fee reconciliation, and credential verifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors shadow-xs"
            >
              <Download className="size-3.5" />
              <span>Export Reports</span>
            </Link>
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#b8864d] to-[#e4b574] px-4 py-2 text-xs font-semibold text-[#14233c] hover:opacity-95 transition-opacity shadow-xs"
            >
              <PlusCircle className="size-3.5" />
              <span>Add Candidate</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
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
                <span className="flex items-center text-[0.7rem] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  <TrendingUp className="mr-1 size-3" />
                  {stat.change}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[0.7rem] font-medium text-[#8e653e] group-hover:text-[#6a4828] transition-colors">
                <span>View details</span>
                <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Access Modules Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">Admin Modules</h2>
            <p className="text-xs text-slate-500">Jump directly into any operational console</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickModules.map((module) => {
            const Icon = module.icon
            return (
              <Link
                key={module.name}
                to={module.href}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#14233c] hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-[#14233c] transition-colors group-hover:bg-[#14233c] group-hover:text-white">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium text-slate-600">
                      {module.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-base font-bold text-slate-900 group-hover:text-[#14233c] transition-colors">
                    {module.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {module.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-[#8e653e] group-hover:text-[#14233c]">
                    Open console
                  </span>
                  <ArrowUpRight className="size-3.5 text-[#8e653e] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Activity Stream and Operational Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900">Recent Operations Log</h3>
              <p className="text-xs text-slate-500">Live operational events across all portals</p>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-[#8e653e] hover:text-[#6a4828]"
            >
              Full Log →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-center justify-between py-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Clock className="size-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{act.user}</span>{" "}
                    <span className="text-slate-600">{act.action}</span>
                  </div>
                </div>
                <span className="font-mono text-[0.68rem] text-slate-400 shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health / Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900">Platform Health</h3>
            <p className="text-xs text-slate-500">Infrastructure & service endpoints</p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Database Cluster (PostgreSQL)</span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 className="size-3" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Verification Ledger</span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 className="size-3" /> Sync Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Payment Webhooks (Razorpay)</span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 className="size-3" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Email Gateway (SMTP)</span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 className="size-3" /> Ready
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-3.5 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <ShieldCheck className="size-4 text-[#b8864d]" />
              <span>Admin Security Active</span>
            </div>
            <p className="text-[0.7rem] text-slate-500 mt-1">
              TLS 1.3 encryption enabled. Audit logging is active for all administrative changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
