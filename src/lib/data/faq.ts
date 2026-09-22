import type { FaqItem } from "@/lib/types"

export const faqItems: FaqItem[] = [
  {
    id: "faq-register",
    category: "registration",
    question: "How do I register?",
    answer:
      "Use Register to complete personal details, academic information, and your program and internship selection. A student account is created after enrollment and payment are verified by the organization.",
    featured: true,
  },
  {
    id: "faq-process",
    category: "internships",
    question: "How does the internship process work?",
    answer:
      "Students register, select a program and internship, complete enrollment, begin on the recorded start date, finish the selected duration, and then become eligible for a certificate once completion is confirmed.",
    featured: true,
  },
  {
    id: "faq-after-enroll",
    category: "registration",
    question: "What happens after enrollment?",
    answer:
      "After payment is verified on the server, the student record is activated. Internship dates, duration, and status are then managed on the student profile. The public website does not replace that account.",
    featured: true,
  },
  {
    id: "faq-certificate-gen",
    category: "certificates",
    question: "How does certificate generation work?",
    answer:
      "Certificates are generated after internship completion is recorded. The document includes identifying fields needed for verification. Generation is an organizational process, not a download button on this public site until the student panel is available.",
    featured: true,
  },
  {
    id: "faq-verify",
    category: "verification",
    question: "How can a certificate be verified?",
    answer:
      "Enter the Certificate ID on the verification page, or open the QR link printed on the certificate. The result shows verification status and limited public fields. Private contact details are not displayed.",
    featured: true,
  },
  {
    id: "faq-extend",
    category: "extensions",
    question: "Can an internship be extended?",
    answer:
      "Extensions may be requested after or near the original end date. When offered, an extension is a separate enrollment step and is confirmed only after the organization records it—and after payment verification if a fee applies.",
    featured: true,
  },
  {
    id: "faq-what",
    category: "general",
    question: "What is The Iconic Career?",
    answer:
      "The Iconic Career is an internship and student management organization. The public website is the entry point for discovering programs, registering, and verifying certificates.",
  },
  {
    id: "faq-account",
    category: "general",
    question: "Do I need an account to explore programs?",
    answer:
      "No. Programs, internships, FAQs, and certificate verification are public. An account is required to enroll and to manage internship status.",
  },
  {
    id: "faq-login",
    category: "registration",
    question: "When will login be available?",
    answer:
      "Login will connect to student accounts in a later phase. The current login screen is prepared for that connection and does not create a session on its own.",
  },
  {
    id: "faq-duration",
    category: "programs",
    question: "How is program duration chosen?",
    answer:
      "Each program lists available durations. You select a duration during enrollment. That duration is written onto the internship record used for completion and certification.",
  },
  {
    id: "faq-diff",
    category: "programs",
    question: "What is the difference between a program and an internship?",
    answer:
      "Programs describe the learning offering. Internships are the supervised experience with dates, completion status, and certificate eligibility. They are linked, but they are not the same page.",
  },
  {
    id: "faq-pay",
    category: "payments",
    question: "How will payments work?",
    answer:
      "Enrollment, extensions, and some certificate services are planned to use Razorpay. Orders are created on the server, the gateway collects payment, and the organization verifies the result before activating a service. The browser payment screen is never treated as final on its own.",
  },
  {
    id: "faq-pay-now",
    category: "payments",
    question: "Can I pay on this website today?",
    answer:
      "The enrollment flow is prepared for payment, but the gateway is not connected in this phase. The site will not report a successful payment until server-side verification exists.",
  },
  {
    id: "faq-qr",
    category: "verification",
    question: "What if I only have a QR code?",
    answer:
      "QR codes are intended to open a verification URL that includes the Certificate ID. You can also type the ID manually on /verify.",
  },
  {
    id: "faq-invalid",
    category: "verification",
    question: "What if a certificate cannot be found?",
    answer:
      "The verification page will say the record was not found or is not valid. That result should be read as a check against the registry, not as a comment on the person presenting the document.",
  },
  {
    id: "faq-id",
    category: "certificates",
    question: "What appears on the certificate?",
    answer:
      "Planned fields include student name, program or internship, duration, start and end dates, Certificate ID, issue date, organization mark, authorized signature, and a QR code.",
  },
]

export const faqCategories: { value: FaqItem["category"] | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "registration", label: "Registration" },
  { value: "programs", label: "Programs" },
  { value: "internships", label: "Internships" },
  { value: "payments", label: "Payments" },
  { value: "certificates", label: "Certificates" },
  { value: "verification", label: "Verification" },
  { value: "extensions", label: "Extensions" },
]
