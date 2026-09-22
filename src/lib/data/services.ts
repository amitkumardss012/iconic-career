import type { ServiceItem } from "@/lib/types"

export const services: ServiceItem[] = [
  {
    id: "svc-internships",
    slug: "internship-programs",
    name: "Internship Programs",
    summary: "Supervised internships with a defined duration, reviews, and a completion record.",
    detail:
      "Internship programs are the core offering. Students select a track, complete enrollment, and work against a documented schedule rather than an informal arrangement.",
    emphasis: "primary",
  },
  {
    id: "svc-training",
    slug: "career-oriented-training",
    name: "Career-Oriented Training",
    summary: "Program modules that prepare students for the internship’s working rhythm.",
    detail:
      "Training is practical and scoped to the internship. It is not presented as a degree, license, or guaranteed job pathway.",
    emphasis: "secondary",
  },
  {
    id: "svc-cert",
    slug: "student-certification",
    name: "Student Certification",
    summary: "Certificates issued after recorded completion, designed for later checking.",
    detail:
      "Certification follows the internship record. The document is treated as an organizational artefact with a Certificate ID, not as a decorative diploma.",
    emphasis: "primary",
  },
  {
    id: "svc-docs",
    slug: "internship-documentation",
    name: "Internship Documentation",
    summary: "Student identity, duration, status, and completion notes kept as a structured file.",
    detail:
      "Documentation is what allows completion, extensions, and certificates to stay consistent. Student-facing files will live in the student panel in a later phase.",
    emphasis: "secondary",
  },
  {
    id: "svc-extend",
    slug: "internship-extension",
    name: "Internship Extension",
    summary: "A separate step to continue an internship beyond the original end date.",
    detail:
      "Extensions are requested, reviewed, and—when a fee applies—activated only after payment verification. They are not automatic.",
    emphasis: "secondary",
  },
  {
    id: "svc-verify",
    slug: "certificate-verification",
    name: "Certificate Verification",
    summary: "A public check using Certificate ID or a QR link.",
    detail:
      "Anyone can open the verification page. Results show limited public fields so employers or institutions can confirm a document without receiving private student data.",
    emphasis: "primary",
  },
]
