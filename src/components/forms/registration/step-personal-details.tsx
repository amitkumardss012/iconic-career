import * as React from "react"
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UsersIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRegistrationStore } from "@/lib/stores/registration-store"

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
]

interface StepPersonalDetailsProps {
  onNext: () => void
}

export function StepPersonalDetails({ onNext }: StepPersonalDetailsProps) {
  const formData = useRegistrationStore((s) => s.formData)
  const setField = useRegistrationStore((s) => s.setField)
  const errors = useRegistrationStore((s) => s.errors)
  const setErrors = useRegistrationStore((s) => s.setErrors)
  const isLoading = useRegistrationStore((s) => s.isLoading)

  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "None", color: "bg-slate-200", text: "text-slate-500" }
    let score = 0
    if (pwd.length >= 8) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-rose-500", text: "text-rose-600" }
    if (score === 2 || score === 3) return { score: 65, label: "Good", color: "bg-amber-500", text: "text-amber-600" }
    return { score: 100, label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" }
  }

  const pwdStrength = getPasswordStrength(formData.password)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    const step1Errors: Record<string, string> = {}

    if (!formData.name || formData.name.trim().length < 2) {
      step1Errors.name = "Full legal name must be at least 2 characters."
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      step1Errors.email = "Please enter a valid email address."
    }
    if (!formData.phone || !/^[0-9+ -]{7,15}$/.test(formData.phone)) {
      step1Errors.phone = "Please enter a valid mobile number (7-15 digits)."
    }
    if (!formData.password || formData.password.length < 8) {
      step1Errors.password = "Password must be at least 8 characters long."
    }
    if (formData.password !== formData.confirmPassword) {
      step1Errors.confirmPassword = "Passwords do not match."
    }
    if (formData.parentEmail && formData.parentEmail.trim() !== "") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
        step1Errors.parentEmail = "Please enter a valid parent email address."
      }
    }

    setErrors(step1Errors)
    if (Object.keys(step1Errors).length > 0) {
      const firstErr = Object.values(step1Errors)[0]
      toast.error(firstErr)
      return
    }

    onNext()
  }

  return (
    <form onSubmit={handleNext} className="flex flex-col gap-4">
      {/* 1A. Primary Account Identity */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 pb-1 border-b border-[#ede7de]">
          <UserIcon className="size-3.5 text-[#a07142]" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#14233c]">
            Primary Candidate Identity
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Full Name */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="reg-name" className="text-[11px] font-semibold text-[#14233c]">
              Full Legal Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-name"
                type="text"
                placeholder="e.g. Ananya Sharma"
                value={formData.name}
                onChange={(e) => setField("name", e.target.value)}
                disabled={isLoading}
                className={`pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.name ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
            </div>
            {errors.name && <span className="text-[10.5px] text-destructive font-medium">{errors.name}</span>}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-email" className="text-[11px] font-semibold text-[#14233c]">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-email"
                type="email"
                placeholder="e.g. ananya@university.edu"
                value={formData.email}
                onChange={(e) => setField("email", e.target.value)}
                disabled={isLoading}
                className={`pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.email ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
            </div>
            {errors.email && <span className="text-[10.5px] text-destructive font-medium">{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-phone" className="text-[11px] font-semibold text-[#14233c]">
              Mobile Number <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setField("phone", e.target.value)}
                disabled={isLoading}
                className={`pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.phone ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
            </div>
            {errors.phone && <span className="text-[10.5px] text-destructive font-medium">{errors.phone}</span>}
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label className="text-[11px] font-semibold text-[#14233c]">Gender</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setField("gender", g.value as any)}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all text-center cursor-pointer ${
                    formData.gender === g.value
                      ? "border-[#14233c] bg-[#14233c] text-white shadow-2xs font-semibold"
                      : "border-[#e2dcce] bg-[#faf8f5] text-[#596579] hover:bg-[#f6eee3] hover:text-[#14233c]"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 1B. Guardian & Emergency Contact */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 pb-1 border-b border-[#ede7de]">
          <UsersIcon className="size-3.5 text-[#a07142]" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#14233c]">
            Parent / Guardian & Emergency Contact
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Parent Name */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-parentName" className="text-[11px] font-semibold text-[#14233c]">
              Parent / Guardian Name
            </Label>
            <Input
              id="reg-parentName"
              type="text"
              placeholder="e.g. Rajesh Sharma"
              value={formData.parentName || ""}
              onChange={(e) => setField("parentName", e.target.value)}
              disabled={isLoading}
              className="h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
            />
          </div>

          {/* Relationship */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-relationship" className="text-[11px] font-semibold text-[#14233c]">
              Relationship
            </Label>
            <Input
              id="reg-relationship"
              type="text"
              placeholder="e.g. Father / Mother / Guardian"
              value={formData.relationship || ""}
              onChange={(e) => setField("relationship", e.target.value)}
              disabled={isLoading}
              className="h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
            />
          </div>

          {/* Parent Phone */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-parentPhone" className="text-[11px] font-semibold text-[#14233c]">
              Parent Contact Number
            </Label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-parentPhone"
                type="tel"
                placeholder="e.g. +91 98765 00000"
                value={formData.parentPhone || ""}
                onChange={(e) => setField("parentPhone", e.target.value)}
                disabled={isLoading}
                className="pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
              />
            </div>
          </div>

          {/* Parent Email */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-parentEmail" className="text-[11px] font-semibold text-[#14233c]">
              Parent Email Address
            </Label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-parentEmail"
                type="email"
                placeholder="e.g. parent@family.com"
                value={formData.parentEmail || ""}
                onChange={(e) => setField("parentEmail", e.target.value)}
                disabled={isLoading}
                className={`pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.parentEmail ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
            </div>
            {errors.parentEmail && (
              <span className="text-[10.5px] text-destructive font-medium">{errors.parentEmail}</span>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="reg-emergencyContact" className="text-[11px] font-semibold text-[#14233c]">
              Emergency Contact Details
            </Label>
            <Input
              id="reg-emergencyContact"
              type="text"
              placeholder="e.g. +91 98765 11111 (Guardian Alternate)"
              value={formData.emergencyContact || ""}
              onChange={(e) => setField("emergencyContact", e.target.value)}
              disabled={isLoading}
              className="h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-city" className="text-[11px] font-semibold text-[#14233c]">
              City
            </Label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-city"
                type="text"
                placeholder="e.g. Bengaluru"
                value={formData.city || ""}
                onChange={(e) => setField("city", e.target.value)}
                disabled={isLoading}
                className="pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
              />
            </div>
          </div>

          {/* State */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-state" className="text-[11px] font-semibold text-[#14233c]">
              State
            </Label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-state"
                type="text"
                placeholder="e.g. Karnataka"
                value={formData.state || ""}
                onChange={(e) => setField("state", e.target.value)}
                disabled={isLoading}
                className="pl-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1C. Password & Access Security */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 pb-1 border-b border-[#ede7de]">
          <LockIcon className="size-3.5 text-[#a07142]" />
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#14233c]">
            Account Security & Password
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Password */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-pwd" className="text-[11px] font-semibold text-[#14233c]">
              Set Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-pwd"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => setField("password", e.target.value)}
                disabled={isLoading}
                className={`pl-9 pr-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.password ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#14233c] transition-colors"
              >
                {showPassword ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10.5px] text-destructive font-medium">{errors.password}</span>
            )}

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="flex flex-col gap-0.5 mt-0.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#64748b]">Strength:</span>
                  <span className={`font-semibold ${pwdStrength.text}`}>{pwdStrength.label}</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pwdStrength.color} transition-all duration-300`}
                    style={{ width: `${pwdStrength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reg-confirm-pwd" className="text-[11px] font-semibold text-[#14233c]">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#94a3b8] pointer-events-none" />
              <Input
                id="reg-confirm-pwd"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                disabled={isLoading}
                className={`pl-9 pr-9 h-9.5 rounded-xl bg-[#faf8f5] border-[#e2dcce] text-xs sm:text-[13px] text-[#14233c] focus-visible:ring-[#14233c] ${
                  errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#14233c] transition-colors"
              >
                {showConfirmPassword ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-[10.5px] text-destructive font-medium">
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Step 1 Next Action */}
      <div className="pt-2">
        <Button
          type="submit"
          className="h-10 w-full rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white text-xs sm:text-sm font-semibold shadow-xs gap-1.5 transition-all cursor-pointer"
        >
          <span>Continue to Academic Details (Step 2)</span>
          <ArrowRightIcon className="size-3.5" />
        </Button>
      </div>
    </form>
  )
}
