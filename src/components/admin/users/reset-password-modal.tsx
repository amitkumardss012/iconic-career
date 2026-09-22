import * as React from "react"
import {
  X,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
} from "lucide-react"
import { toast } from "sonner"
import type { UserSafe } from "@/lib/services/user"
import { updateUserPasswordFn } from "@/lib/server/users"

interface ResetPasswordModalProps {
  isOpen: boolean
  user: UserSafe | null
  onClose: () => void
  onSuccess: () => void
}

export function ResetPasswordModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setNewPassword("")
      setShowPassword(false)
    }
  }, [isOpen])

  if (!isOpen || !user) return null

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*"
    let pass = ""
    for (let i = 0; i < 14; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewPassword(pass)
    setShowPassword(true)
    toast.info("Generated a secure random password.")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    setIsSubmitting(true)
    try {
      await updateUserPasswordFn({
        data: {
          id: user.id,
          newPassword,
        },
      })

      toast.success(`Password for ${user.name} has been updated successfully.`)
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to update user password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#14233c] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#b8864d]/20 text-[#e4b574] border border-[#b8864d]/30">
              <KeyRound className="size-4.5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">Direct Password Reset</h3>
              <p className="text-[0.68rem] text-slate-300">
                Override & set a new password without entering previous credentials
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target User Info Banner */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#14233c] text-[#e4b574] text-xs font-bold font-mono">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xs text-slate-900">{user.name}</span>
                <span className="text-[0.68rem] text-slate-500 font-mono">{user.email}</span>
              </div>
            </div>

            <span
              className={`rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                user.role === "ADMIN"
                  ? "bg-[#b8864d]/15 text-[#8e653e] border border-[#b8864d]/30"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {user.role}
            </span>
          </div>

          {/* New Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                New Password *
              </label>

              <button
                type="button"
                onClick={handleGeneratePassword}
                className="inline-flex items-center gap-1 text-[0.68rem] font-medium text-[#8e653e] hover:text-[#b8864d] transition-colors cursor-pointer"
              >
                <Sparkles className="size-3 text-[#b8864d]" />
                <span>Generate Strong Password</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="size-4" />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Enter at least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9.5 pr-10 text-xs text-slate-900 font-mono placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <span className="text-[0.68rem] text-slate-400 mt-1 block">
              Minimum 8 characters. Directly hashes via scrypt.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || newPassword.length < 8}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#14233c] px-4.5 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <KeyRound className="size-3.5 text-[#e4b574]" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
