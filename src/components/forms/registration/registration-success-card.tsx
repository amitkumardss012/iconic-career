import * as React from "react"
import { useRouter } from "@tanstack/react-router"
import { UserCheckIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRegistrationStore } from "@/lib/stores/registration-store"

export function RegistrationSuccessCard() {
  const router = useRouter()
  const successStudentName = useRegistrationStore((s) => s.successStudentName)

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-[#e4dccf] bg-white p-6 sm:p-10 shadow-[0_20px_60px_rgba(20,35,60,0.08)] text-center flex flex-col items-center">
      <div className="size-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
        <UserCheckIcon className="size-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800 shadow-2xs mb-2.5">
        <span>REGISTRATION ACTIVE</span>
      </div>

      <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#14233c] tracking-tight">
        Welcome to The Iconic Career, {successStudentName}!
      </h2>

      <p className="text-xs text-[#596579] mt-2 leading-relaxed max-w-md">
        Your student identity dossier and academic record have been successfully initialized. You can now access your candidate dashboard and begin exploring verified tracks.
      </p>

      <div className="w-full grid grid-cols-3 gap-2.5 my-6 pt-4 border-t border-[#ede7de] text-left">
        <div className="rounded-xl border border-[#e2dcce] bg-[#faf8f5] p-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a07142] block">Role</span>
          <span className="text-[11.5px] font-semibold text-[#14233c] mt-0.5 block">Verified Candidate</span>
        </div>
        <div className="rounded-xl border border-[#e2dcce] bg-[#faf8f5] p-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a07142] block">Status</span>
          <span className="text-[11.5px] font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>
        <div className="rounded-xl border border-[#e2dcce] bg-[#faf8f5] p-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a07142] block">Access</span>
          <span className="text-[11.5px] font-semibold text-[#14233c] mt-0.5 block">Student Portal</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-sm">
        <Button
          onClick={() => router.navigate({ to: "/student" })}
          className="w-full h-10 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white text-xs font-semibold shadow-xs gap-1.5 transition-all cursor-pointer"
        >
          <span>Proceed to Dashboard</span>
          <ArrowRightIcon className="size-3.5" />
        </Button>
        <Button
          variant="outline"
          onClick={() => router.navigate({ to: "/programs" })}
          className="w-full sm:w-auto h-10 rounded-xl border-[#e2dcce] text-xs font-semibold text-[#14233c] hover:bg-[#f6eee3] cursor-pointer"
        >
          Browse Programs
        </Button>
      </div>
    </div>
  )
}
