import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { StudentRegistrationInput, RegisterSearchInput } from "@/lib/validation/auth"
import type { DocumentType } from "@/lib/types/programs"

export interface RegistrationState {
  // Step tracker
  currentStep: number

  // Form Fields
  formData: StudentRegistrationInput

  // UI state
  errors: Record<string, string>
  isLoading: boolean
  serverError: string | null
  registeredSuccess: boolean
  successStudentName: string

  // Actions
  setStep: (step: number) => void
  setField: <K extends keyof StudentRegistrationInput>(field: K, value: StudentRegistrationInput[K]) => void
  setFormData: (data: Partial<StudentRegistrationInput>) => void
  setErrors: (errors: Record<string, string>) => void
  clearError: (field: string) => void
  setLoading: (loading: boolean) => void
  setServerError: (error: string | null) => void
  setRegistrationSuccess: (userName: string) => void
  generateRegistrationNumber: () => string
  hydrateFromSearchParams: (search: RegisterSearchInput) => void
  resetForm: () => void
}

const INITIAL_FORM_DATA: StudentRegistrationInput = {
  name: "",
  email: "",
  phone: "",
  gender: null,
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  relationship: "",
  emergencyContact: "",
  city: "",
  state: "",
  password: "",
  confirmPassword: "",

  university: "",
  college: "",
  degreeLevel: "UG",
  department: "",
  course: "",
  subject: "",
  session: "",
  registrationNumber: "",

  consentLetter: null,
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: INITIAL_FORM_DATA,
      errors: {},
      isLoading: false,
      serverError: null,
      registeredSuccess: false,
      successStudentName: "",

      setStep: (step) => set({ currentStep: step }),

      setField: (field, value) =>
        set((state) => {
          const nextErrors = { ...state.errors }
          if (nextErrors[field as string]) {
            delete nextErrors[field as string]
          }
          return {
            formData: { ...state.formData, [field]: value },
            errors: nextErrors,
          }
        }),

      setFormData: (partial) =>
        set((state) => ({
          formData: { ...state.formData, ...partial },
        })),

      setErrors: (errors) => set({ errors }),

      clearError: (field) =>
        set((state) => {
          const next = { ...state.errors }
          delete next[field]
          return { errors: next }
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setServerError: (serverError) => set({ serverError }),

      setRegistrationSuccess: (userName) =>
        set({
          registeredSuccess: true,
          successStudentName: userName,
          isLoading: false,
          serverError: null,
        }),

      generateRegistrationNumber: () => {
        const year = new Date().getFullYear()
        const randomSuffix = Math.floor(10000 + Math.random() * 90000)
        const generated = `REG-${year}-${randomSuffix}`
        get().setField("registrationNumber", generated)
        return generated
      },

      hydrateFromSearchParams: (search) =>
        set((state) => {
          const updated: Partial<StudentRegistrationInput> = {}
          if (search.name && !state.formData.name) updated.name = search.name
          if (search.email && !state.formData.email) updated.email = search.email
          if (search.phone && !state.formData.phone) updated.phone = search.phone
          if (search.gender && !state.formData.gender) updated.gender = search.gender as any
          if (search.parentName && !state.formData.parentName) updated.parentName = search.parentName
          if (search.parentPhone && !state.formData.parentPhone) updated.parentPhone = search.parentPhone
          if (search.parentEmail && !state.formData.parentEmail) updated.parentEmail = search.parentEmail
          if (search.relationship && !state.formData.relationship) updated.relationship = search.relationship
          if (search.emergencyContact && !state.formData.emergencyContact) updated.emergencyContact = search.emergencyContact
          if (search.city && !state.formData.city) updated.city = search.city
          if (search.state && !state.formData.state) updated.state = search.state
          if (search.university && !state.formData.university) updated.university = search.university
          if (search.college && !state.formData.college) updated.college = search.college
          if (search.degreeLevel && (!state.formData.degreeLevel || state.formData.degreeLevel === "UG")) {
            updated.degreeLevel = search.degreeLevel as any
          }
          if (search.department && !state.formData.department) updated.department = search.department
          if (search.course && !state.formData.course) updated.course = search.course
          if (search.subject && !state.formData.subject) updated.subject = search.subject
          if (search.session && !state.formData.session) updated.session = search.session
          if (search.registrationNumber && !state.formData.registrationNumber) updated.registrationNumber = search.registrationNumber

          const nextStep = search.step && typeof search.step === "number" ? search.step : state.currentStep

          return {
            currentStep: nextStep,
            formData: { ...state.formData, ...updated },
          }
        }),

      resetForm: () =>
        set({
          currentStep: 1,
          formData: INITIAL_FORM_DATA,
          errors: {},
          isLoading: false,
          serverError: null,
          registeredSuccess: false,
          successStudentName: "",
        }),
    }),
    {
      name: "iconic_student_registration_store_v3",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.sessionStorage : null as any)),
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
      }),
    }
  )
)
