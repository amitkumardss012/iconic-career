import * as React from "react"
import { useSearch, useNavigate } from "@tanstack/react-router"
import { AlertCircleIcon } from "lucide-react"
import { toast } from "sonner"
import type { RegisterSearchInput } from "@/lib/validation/auth"
import { studentRegistrationSchema, type StudentRegistrationInput } from "@/lib/validation/auth"
import type { DocumentType } from "@/lib/types/programs"
import { registerStudentFn } from "@/lib/server/auth"
import { saveClientSession } from "@/lib/auth/session"
import { useRegistrationStore } from "@/lib/stores/registration-store"

import { RegistrationStepperSidebar } from "@/components/forms/registration/registration-stepper-sidebar"
import { RegistrationStepperHeader } from "@/components/forms/registration/registration-stepper-header"
import { StepPersonalDetails } from "@/components/forms/registration/step-personal-details"
import { StepAcademicDetails } from "@/components/forms/registration/step-academic-details"
import { StepConsentLetter } from "@/components/forms/registration/step-consent-letter"
import { RegistrationSuccessCard } from "@/components/forms/registration/registration-success-card"

export function StudentRegistrationForm() {
  const searchParams = useSearch({ from: "/register" }) as RegisterSearchInput
  const navigate = useNavigate({ from: "/register" })

  // Zustand state and actions
  const currentStep = useRegistrationStore((s) => s.currentStep)
  const setStep = useRegistrationStore((s) => s.setStep)
  const formData = useRegistrationStore((s) => s.formData)
  const serverError = useRegistrationStore((s) => s.serverError)
  const setServerError = useRegistrationStore((s) => s.setServerError)
  const setErrors = useRegistrationStore((s) => s.setErrors)
  const setLoading = useRegistrationStore((s) => s.setLoading)
  const registeredSuccess = useRegistrationStore((s) => s.registeredSuccess)
  const setRegistrationSuccess = useRegistrationStore((s) => s.setRegistrationSuccess)
  const hydrateFromSearchParams = useRegistrationStore((s) => s.hydrateFromSearchParams)

  // Hydrate store from initial URL search parameters on mount
  React.useEffect(() => {
    hydrateFromSearchParams(searchParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep URL query params in sync with debouncing and resetScroll: false
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  const syncUrlParams = React.useCallback(
    (step: number, data: StudentRegistrationInput) => {
      navigate({
        search: (prev) => ({
          ...prev,
          step,
          name: data.name || undefined,
          email: data.email || undefined,
          phone: data.phone || undefined,
          gender: data.gender || undefined,
          parentName: data.parentName || undefined,
          parentPhone: data.parentPhone || undefined,
          parentEmail: data.parentEmail || undefined,
          relationship: data.relationship || undefined,
          emergencyContact: data.emergencyContact || undefined,
          city: data.city || undefined,
          state: data.state || undefined,
          university: data.university || undefined,
          college: data.college || undefined,
          degreeLevel: data.degreeLevel || undefined,
          department: data.department || undefined,
          course: data.course || undefined,
          subject: data.subject || undefined,
          session: data.session || undefined,
          registrationNumber: data.registrationNumber || undefined,
        }),
        replace: true,
        resetScroll: false,
      })
    },
    [navigate]
  )

  // Watch formData or step changes to update URL
  React.useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      syncUrlParams(currentStep, formData)
    }, 400)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [currentStep, formData, syncUrlParams])

  // Step transition handler
  const handleStepTransition = (targetStep: number) => {
    setStep(targetStep)
    syncUrlParams(targetStep, formData)
  }

  // Final Registration Submission
  const handleFinalSubmit = async (overrideConsentLetter?: DocumentType | null) => {
    setServerError(null)

    const submissionData = {
      ...formData,
      consentLetter:
        overrideConsentLetter !== undefined ? overrideConsentLetter : formData.consentLetter,
    }

    const parseResult = studentRegistrationSchema.safeParse(submissionData)
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {}
      parseResult.error.issues.forEach((issue) => {
        const pathKey = issue.path[0] as string
        if (pathKey && !fieldErrors[pathKey]) {
          fieldErrors[pathKey] = issue.message
        }
      })
      setErrors(fieldErrors)

      // Jump back to relevant step
      if (
        fieldErrors.name ||
        fieldErrors.email ||
        fieldErrors.phone ||
        fieldErrors.password ||
        fieldErrors.confirmPassword ||
        fieldErrors.parentEmail
      ) {
        handleStepTransition(1)
      } else if (fieldErrors.college || fieldErrors.course) {
        handleStepTransition(2)
      }

      const firstError = Object.values(fieldErrors)[0]
      toast.error(firstError || "Please check your registration form details.")
      return
    }

    setLoading(true)
    try {
      const res = await registerStudentFn({ data: parseResult.data })
      if (res.success && res.user) {
        saveClientSession(res.user, res.token)
        toast.success(res.message || "Registration successful! Welcome to your dashboard.")
        setRegistrationSuccess(res.user.name)
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to complete registration. Please try again."
      setServerError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (registeredSuccess) {
    return <RegistrationSuccessCard />
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-[#e4dccf] bg-white shadow-[0_20px_60px_rgba(20,35,60,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* Left Column: Sidebar Step Indicator */}
      <RegistrationStepperSidebar onStepClick={(step) => handleStepTransition(step)} />

      {/* Right Column: Active Step SFC Console */}
      <div className="lg:col-span-8 p-5 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-4">
          {/* Header */}
          <RegistrationStepperHeader onStepClick={(step) => handleStepTransition(step)} />

          {/* Server Error Alert */}
          {serverError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2.5">
              <AlertCircleIcon className="size-3.5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">Registration Interrupted</span>
                <p className="leading-relaxed">{serverError}</p>
              </div>
            </div>
          )}

          {/* STEP 1 SFC */}
          {currentStep === 1 && (
            <StepPersonalDetails onNext={() => handleStepTransition(2)} />
          )}

          {/* STEP 2 SFC */}
          {currentStep === 2 && (
            <StepAcademicDetails
              onBack={() => handleStepTransition(1)}
              onNext={() => handleStepTransition(3)}
            />
          )}

          {/* STEP 3 SFC */}
          {currentStep === 3 && (
            <StepConsentLetter
              onBack={() => handleStepTransition(2)}
              onSubmit={(doc) => handleFinalSubmit(doc)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
