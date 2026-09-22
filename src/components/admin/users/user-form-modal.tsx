import * as React from "react"
import {
  X,
  UserPlus,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Mail,
  User as UserIcon,
  Phone,
  Lock,
} from "lucide-react"
import { toast } from "sonner"
import type { UserSafe } from "@/lib/services/user"
import { createUserFn, updateUserFn } from "@/lib/server/users"

interface UserFormModalProps {
  isOpen: boolean
  initialData?: UserSafe | null
  onClose: () => void
  onSuccess: () => void
}

export function UserFormModal({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [role, setRole] = React.useState<"ADMIN" | "STUDENT">("ADMIN")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name)
        setEmail(initialData.email)
        setPhone(initialData.phone || "")
        setRole(initialData.role)
        setPassword("")
        setShowPassword(false)
      } else {
        setName("")
        setEmail("")
        setPhone("")
        setRole("ADMIN")
        setPassword("")
        setShowPassword(false)
      }
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*"
    let pass = ""
    for (let i = 0; i < 14; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(pass)
    setShowPassword(true)
    toast.info("Generated a secure random password.")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      toast.error("Full name and email are required.")
      return
    }

    if (!initialData && password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    setIsSubmitting(true)
    try {
      if (initialData) {
        // Update existing user
        await updateUserFn({
          data: {
            id: initialData.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim() || null,
            role,
            ...(password.trim() ? { password: password.trim() } : {}),
          },
        })
        toast.success(`User "${name}" updated successfully.`)
      } else {
        // Create new user
        await createUserFn({
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            phone: phone.trim() || null,
            role,
          },
        })
        toast.success(`User "${name}" created successfully.`)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to save user.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#14233c] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#b8864d]/20 text-[#e4b574] border border-[#b8864d]/30">
              {initialData ? <UserCheck className="size-4.5" /> : <UserPlus className="size-4.5" />}
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">
                {initialData ? "Edit Administrator Record" : "Add New Administrator"}
              </h3>
              <p className="text-[0.68rem] text-slate-300">
                {initialData
                  ? `Update credentials and console permissions for #${initialData.id}`
                  : "Provision a new institutional administrator account"}
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
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <UserIcon className="size-4" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9.5 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Mail className="size-4" />
              </div>
              <input
                type="email"
                required
                placeholder="alex.morgan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9.5 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Phone Number & Role Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Phone className="size-4" />
                </div>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9.5 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#14233c] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                System Role *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Shield className="size-4" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "ADMIN" | "STUDENT")}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9.5 pr-8 text-xs font-medium text-slate-800 focus:border-[#14233c] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="STUDENT">STUDENT (Standard Learner)</option>
                  <option value="ADMIN">ADMIN (Full Console Access)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {initialData ? "Change Password (Optional)" : "Initial Password *"}
              </label>

              <button
                type="button"
                onClick={handleGeneratePassword}
                className="inline-flex items-center gap-1 text-[0.68rem] font-medium text-[#8e653e] hover:text-[#b8864d] transition-colors cursor-pointer"
              >
                <Sparkles className="size-3 text-[#b8864d]" />
                <span>Generate Password</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="size-4" />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                required={!initialData}
                minLength={8}
                placeholder={initialData ? "Leave empty to keep existing password" : "Enter at least 8 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {initialData && (
              <span className="text-[0.68rem] text-slate-400 mt-1 block">
                Leave blank if you do not want to alter this user's current password.
              </span>
            )}
          </div>

          {/* Actions */}
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
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#14233c] px-4.5 py-2 text-xs font-semibold text-white hover:bg-[#1f375e] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : initialData ? (
                <>
                  <UserCheck className="size-3.5 text-[#e4b574]" />
                  <span>Update Administrator</span>
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5 text-[#e4b574]" />
                  <span>Create Administrator</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
