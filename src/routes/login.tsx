import * as React from "react"
import { createFileRoute, Link, useRouter, redirect } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { loginSchema } from "@/lib/validation/auth"
import { loginFn } from "@/lib/server/auth"
import { saveClientSession, getClientSession } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  AlertCircleIcon,
  LockIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  FolderGit2Icon,
  AwardIcon,
} from "lucide-react"

import { z } from "zod"

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute("/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  beforeLoad: () => {
    const session = getClientSession()
    if (session) {
      if (session.role === "ADMIN") {
        throw redirect({ to: "/admin" })
      } else {
        throw redirect({ to: "/student" })
      }
    }
  },
  head: () => ({
    meta: createMetaTags({
      title: "Candidate & Staff Login | The Iconic Career",
      description: "Unified portal sign in for administrators and enrolled students.",
      path: "/login",
    }),
  }),
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const search = Route.useSearch()
  const [identifier, setIdentifier] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [authError, setAuthError] = React.useState<string | null>(null)
  const [checkingSession, setCheckingSession] = React.useState(true)

  // Immediate client-side protection: redirect authenticated users directly
  React.useEffect(() => {
    const session = getClientSession()
    if (session) {
      if (session.role === "ADMIN") {
        router.navigate({ to: "/admin" })
      } else {
        router.navigate({ to: "/student" })
      }
    } else {
      setCheckingSession(false)
    }
  }, [router])

  if (checkingSession) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-[#faf8f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="size-8 animate-spin rounded-full border-2 border-[#14233c] border-t-transparent" />
          <span className="text-xs font-semibold text-[#596579]">Checking active session...</span>
        </div>
      </div>
    )
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setAuthError(null)

    const parseRes = loginSchema.safeParse({ identifier, password })
    if (!parseRes.success) {
      const fieldErrors: Record<string, string> = {}
      parseRes.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    try {
      const res = await loginFn({ data: { identifier, password } })
      if (res.success) {
        saveClientSession(res.user, res.token)
        toast.success(res.message || "Authentication successful.")

        // Check for specific redirect URL
        if (search?.redirect) {
          if (res.role === "ADMIN" && search.redirect.startsWith("/admin")) {
            window.location.href = search.redirect
            return
          }
          if (res.role === "STUDENT" && search.redirect.startsWith("/student")) {
            window.location.href = search.redirect
            return
          }
        }

        // Default role based redirection
        if (res.role === "ADMIN") {
          router.navigate({ to: "/admin" })
        } else {
          router.navigate({ to: "/student" })
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials or system interruption."
      setAuthError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-[#faf8f5] flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Architectural Mesh */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-150 h-87.5 bg-radial from-[#f3e7d5]/60 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Split-Screen Luxury Command Center Container */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-[#e4dccf] bg-white shadow-[0_20px_60px_rgba(20,35,60,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Dark Luxury Command Center Anchor */}
        <div className="lg:col-span-5 bg-[#0e1726] p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#22334f]">
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-radial from-[#d4af37]/20 via-transparent to-transparent blur-2xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Top Anchor Content */}
          <div className="relative flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#1a253a] px-3.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#e8c56c] shadow-xs w-fit">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>STUDENT & ALUMNI PORTAL</span>
            </div>

            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-normal tracking-tight text-white leading-tight">
                Welcome to Your <br />
                <span className="italic text-[#e8c56c]">Career Command Center.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mt-3">
                Access your assigned project briefs, submit weekly milestone dossiers, receive supervisor critique, and view your verified credentials.
              </p>
            </div>

            {/* 3 Value Anchor Pillars */}
            <div className="flex flex-col gap-3.5 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-[#cbd5e1]">
                <div className="size-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#e8c56c]">
                  <FolderGit2Icon className="size-3.5" />
                </div>
                <span>Weekly Supervised Milestone Records</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#cbd5e1]">
                <div className="size-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#e8c56c]">
                  <ShieldCheckIcon className="size-3.5" />
                </div>
                <span>Documented Proof of Work File</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#cbd5e1]">
                <div className="size-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#e8c56c]">
                  <AwardIcon className="size-3.5" />
                </div>
                <span>Public QR-Verifiable Registry</span>
              </div>
            </div>
          </div>

          {/* Bottom Cohort Pill */}
          <div className="relative pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-semibold">Active Cohort Session</span>
            </div>
            <span>2026 Batch</span>
          </div>
        </div>

        {/* Right Column: Authentication Console */}
        <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-3">
                <span>IDENTITY GATEWAY</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#14233c] tracking-tight">
                Sign In to Your Account
              </h1>
              <p className="text-xs sm:text-sm text-[#596579] mt-1.5 leading-relaxed">
                Enter your registered credentials to access your candidate dossier and internship files.
              </p>
            </div>

            {/* Authentication Notice Banner */}
            {authError && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3">
                <AlertCircleIcon className="size-4 shrink-0 mt-0.5 text-amber-600" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[#14233c]">Authentication Gateway Notice</span>
                  <p className="leading-relaxed text-[#596579]">{authError}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="identifier" className="text-xs font-semibold text-[#14233c]">
                  Email Address or Mobile Number
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="e.g. candidate@university.edu or +91 98765 43210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
                    errors.identifier ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.identifier && (
                  <span className="text-xs text-destructive font-medium">{errors.identifier}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-[#14233c]">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() =>
                      setAuthError(
                        "Self-service password reset is activated alongside the Student Dashboard in Phase 3. Please contact admissions@theiconiccareer.com for priority assistance."
                      )
                    }
                    className="text-xs font-semibold text-[#a07142] hover:text-[#14233c] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`h-11 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-sm text-[#14233c] focus-visible:ring-[#14233c] ${
                    errors.password ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                {errors.password && (
                  <span className="text-xs text-destructive font-medium">{errors.password}</span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-11 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white text-xs sm:text-sm font-semibold shadow-xs gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <LockIcon className="size-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </Button>
            </form>

            {/* Switch to Register */}
            <div className="pt-5 border-t border-[#ede7de] text-center text-xs text-[#64748b]">
              Don&apos;t have an active student registration?{" "}
              <Link
                to="/register"
                className="font-bold text-[#14233c] hover:text-[#a07142] inline-flex items-center gap-1 hover:underline transition-colors ml-1"
              >
                <span>Register / Enroll Now</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
