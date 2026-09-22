export const internshipJourney = [
  {
    step: "01",
    title: "Register",
    detail: "Share personal details so the organization can open a student record.",
  },
  {
    step: "02",
    title: "Select a program",
    detail: "Choose the learning track that matches the internship you want to complete.",
  },
  {
    step: "03",
    title: "Complete enrollment",
    detail: "Confirm duration and finish enrollment. Services activate after payment is verified on the server.",
  },
  {
    step: "04",
    title: "Begin the internship",
    detail: "Start on the recorded date with a brief, a schedule, and a supervisor checkpoint.",
  },
  {
    step: "05",
    title: "Complete the internship",
    detail: "Finish the selected duration. Completion status is written to the student profile.",
  },
  {
    step: "06",
    title: "Receive a certificate",
    detail: "After completion is confirmed, a certificate can be issued and later checked publicly.",
  },
] as const

export const studentOutcomes = {
  primary: {
    title: "A verifiable certificate",
    detail:
      "The certificate is the public artefact of a completed internship. It is designed to be checked by Certificate ID or QR, not to be treated as unexamined stationery.",
  },
  supporting: [
    {
      title: "Student account",
      detail: "A login for enrollment status, internship dates, and completion records.",
    },
    {
      title: "Student ID",
      detail: "An internal identifier issued after enrollment is verified.",
    },
    {
      title: "Internship experience",
      detail: "Supervised work against a brief, with duration on the record.",
    },
    {
      title: "Completion status",
      detail: "A clear state: in progress, complete, or extended.",
    },
    {
      title: "Extension option",
      detail: "A separate request when more time is needed and approved.",
    },
    {
      title: "Certificate verification",
      detail: "A public page any third party can use without a student login.",
    },
  ],
} as const

export const trustThemes = [
  {
    title: "Structured programs",
    detail: "Defined duration, reviews, and a written journey from registration to completion.",
  },
  {
    title: "Internship experience",
    detail: "Work is assigned and recorded. A certificate is not a substitute for the internship.",
  },
  {
    title: "Professional documentation",
    detail: "Identity, dates, and status are kept as a file the organization can stand behind.",
  },
  {
    title: "Verifiable certificates",
    detail: "Certificate ID and QR are part of the document so third parties can check it.",
  },
] as const

export const principles = [
  {
    title: "Structure before spectacle",
    detail:
      "Internships have a start date, an end date, and checkpoints. The website exists to make that structure understandable.",
  },
  {
    title: "Experience is the product",
    detail:
      "Students enroll to complete supervised work. Documentation and certification follow the work, not the other way around.",
  },
  {
    title: "Records that can be checked",
    detail:
      "Completion, extensions, and certificates should match the same student file. Public verification is part of that discipline.",
  },
  {
    title: "Clear next steps",
    detail:
      "Discover, choose, register, enroll, complete, certify, verify. Each page should make the next action obvious.",
  },
  {
    title: "No inflated claims",
    detail:
      "Partnerships, placements, and statistics appear only when the organization can stand behind them. Until then, the copy stays specific to the process.",
  },
] as const
