export type Media = {
  src: string
  alt: string
}

export type ProgramCategory =
  | "technology"
  | "business"
  | "design"
  | "communications"
  | "operations"

export type Program = {
  id: string
  slug: string
  name: string
  type?: "COURSE" | "INTERNSHIP"
  category: ProgramCategory
  categoryLabel: string
  summary: string
  description: string
  durationOptions: string[]
  defaultDuration: string
  internshipAvailable: boolean
  certificateAvailable: boolean
  whoItsFor: string[]
  learningOutcomes: string[]
  structure: { title: string; detail: string }[]
  internshipRelationship: string
  certificateNote: string
  image: Media
  relatedInternshipSlugs: string[]
  faqs: { question: string; answer: string }[]
  price?: number
  discountPrice?: number | null
  formattedPrice?: string
  formattedOriginalPrice?: string
  discountPercentage?: string
  rating?: string
  reviewsCount?: string
  cohortDate?: string
  seatsLeft?: number
  badge?: string
  level?: string
  deliveryMode?: string
  tags?: string[]
  isBestseller?: boolean
  isFeatured?: boolean
}

export type Internship = {
  id: string
  slug: string
  name: string
  type?: "COURSE" | "INTERNSHIP"
  category: ProgramCategory
  categoryLabel: string
  summary: string
  overview: string
  programSlug: string
  durationOptions: string[]
  defaultDuration: string
  eligibility: string[]
  structure: { title: string; detail: string }[]
  completionProcess: string[]
  certificateProcess: string[]
  extensionNote: string
  certificateAvailable?: boolean
  whoItsFor?: string[]
  learningOutcomes?: string[]
  image: Media
  faqs: { question: string; answer: string }[]
  price?: number
  discountPrice?: number | null
  formattedPrice?: string
  formattedOriginalPrice?: string
  discountPercentage?: string
  rating?: string
  reviewsCount?: string
  cohortDate?: string
  seatsLeft?: number
  badge?: string
}

export type ServiceItem = {
  id: string
  slug: string
  name: string
  summary: string
  detail: string
  emphasis: "primary" | "secondary"
}

export type FaqCategory =
  | "general"
  | "registration"
  | "programs"
  | "internships"
  | "payments"
  | "certificates"
  | "verification"
  | "extensions"

export type FaqItem = {
  id: string
  category: FaqCategory
  question: string
  answer: string
  featured?: boolean
}

export type Testimonial = {
  id: string
  studentName: string
  program: string
  institution?: string
  quote: string
  placeholder: boolean
}

export type NavLink = {
  href: string
  label: string
}

export type Student = {
  id: string
  fullName: string
  email: string
  mobile: string
  studentId?: string
}

export type Enrollment = {
  id: string
  studentId?: string
  programSlug: string
  internshipSlug: string
  duration: string
  status:
    | "draft"
    | "submitted"
    | "awaiting_payment"
    | "payment_pending_verification"
    | "active"
    | "cancelled"
}

export type Payment = {
  id: string
  enrollmentId: string
  provider: "razorpay"
  purpose: "enrollment" | "extension" | "certificate"
  amountMinor?: number
  currency?: "INR"
  status:
    | "not_started"
    | "order_created"
    | "pending_gateway"
    | "pending_server_verification"
    | "verified"
    | "failed"
    | "cancelled"
}

export type Certificate = {
  id: string
  certificateId: string
  studentName: string
  programName: string
  internshipName: string
  duration: string
  startDate: string
  endDate: string
  issueDate: string
}

export type VerificationStatus =
  | "idle"
  | "loading"
  | "valid"
  | "invalid"
  | "not_found"
  | "error"

export type VerificationResult = {
  status: Exclude<VerificationStatus, "idle" | "loading">
  certificate?: Pick<
    Certificate,
    | "certificateId"
    | "studentName"
    | "programName"
    | "internshipName"
    | "duration"
    | "issueDate"
  >
  message: string
}

export type EnrollmentDraft = {
  fullName: string
  mobile: string
  email: string
  college: string
  academicProgram: string
  yearOfStudy: string
  programSlug: string
  internshipSlug: string
  duration: string
}

export type PaymentPreparationResult = {
  status: "unavailable" | "cancelled" | "failed"
  message: string
}
