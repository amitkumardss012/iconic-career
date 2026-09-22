import type { Program } from "@/lib/types"

const durationOptions = ["4 weeks", "8 weeks", "12 weeks"]

export const programs: Program[] = [
  {
    id: "prg-digital-practice",
    slug: "digital-practice",
    name: "Digital Practice",
    category: "technology",
    categoryLabel: "Technology",
    summary:
      "A structured introduction to digital product work, covering research, delivery habits, and documentation.",
    description:
      "Digital Practice is designed for students who want guided exposure to how digital work is planned, executed, and recorded. The program pairs learning modules with a related internship so experience and documentation stay connected.",
    durationOptions,
    defaultDuration: "8 weeks",
    internshipAvailable: true,
    certificateAvailable: true,
    whoItsFor: [
      "Students exploring product, engineering-adjacent, or digital operations roles",
      "Learners who want a documented internship rather than informal project work",
      "Participants who can commit to a defined duration and review checkpoints",
    ],
    learningOutcomes: [
      "Describe a typical digital delivery cycle in plain language",
      "Produce structured notes, task logs, and review summaries",
      "Collaborate against a brief with defined checkpoints",
      "Prepare internship artefacts that can support certificate issuance",
    ],
    structure: [
      {
        title: "Orientation",
        detail: "Program expectations, tools, and how internship hours are recorded.",
      },
      {
        title: "Guided practice",
        detail: "Weekly briefs with review notes rather than open-ended assignments.",
      },
      {
        title: "Internship application",
        detail: "Work is applied inside the related internship track.",
      },
      {
        title: "Close-out",
        detail: "Completion review, documentation check, and certificate eligibility.",
      },
    ],
    internshipRelationship:
      "This program is paired with the Digital Practice Internship. Enrollment selects both the learning track and the internship duration.",
    certificateNote:
      "A certificate is issued after internship completion is recorded. Certificates are designed to be checked through the public verification page.",
    image: {
      src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
      alt: "Students collaborating around laptops in a quiet workroom",
    },
    relatedInternshipSlugs: ["digital-practice-internship"],
    faqs: [
      {
        question: "Is this a coding bootcamp?",
        answer:
          "No. Digital Practice focuses on structured digital work habits and internship documentation. Technical depth varies by internship brief.",
      },
      {
        question: "Does the program include a certificate?",
        answer:
          "Certificate issuance follows recorded internship completion. Program participation alone does not automatically generate a certificate.",
      },
    ],
  },
  {
    id: "prg-business-operations",
    slug: "business-operations",
    name: "Business Operations",
    category: "business",
    categoryLabel: "Business",
    summary:
      "Practical exposure to coordination, reporting, and operational follow-through in a student internship setting.",
    description:
      "Business Operations helps students understand how work moves through a team: briefs, trackers, reviews, and written updates. It is intended for learners who want organized experience rather than a generic business overview.",
    durationOptions,
    defaultDuration: "8 weeks",
    internshipAvailable: true,
    certificateAvailable: true,
    whoItsFor: [
      "Commerce, management, and interdisciplinary students",
      "Learners who prefer process, communication, and documentation",
      "Students preparing a verifiable internship record",
    ],
    learningOutcomes: [
      "Maintain a simple operations tracker",
      "Write concise status updates",
      "Support planning and follow-up cycles",
      "Close an internship with complete records",
    ],
    structure: [
      { title: "Foundations", detail: "How internships are scoped, scheduled, and reviewed." },
      { title: "Operating rhythm", detail: "Weekly reporting, task ownership, and review meetings." },
      { title: "Applied internship", detail: "Live operational briefs inside the paired internship." },
      { title: "Completion file", detail: "Final documentation for completion and certification." },
    ],
    internshipRelationship:
      "Paired with the Business Operations Internship. Duration selected at enrollment applies to both program and internship.",
    certificateNote:
      "Certificates list the internship, duration, and recorded dates. They are intended for third-party checking via Certificate ID or QR.",
    image: {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
      alt: "Person reviewing documents and a planner at a desk",
    },
    relatedInternshipSlugs: ["business-operations-internship"],
    faqs: [
      {
        question: "Are placements guaranteed?",
        answer:
          "No. The Iconic Career provides structured internship programs and documentation. Employment outcomes are not promised.",
      },
    ],
  },
  {
    id: "prg-design-studio",
    slug: "design-studio",
    name: "Design Studio",
    category: "design",
    categoryLabel: "Design",
    summary:
      "A guided studio track for students practicing visual communication, critique, and delivery discipline.",
    description:
      "Design Studio is a career-oriented program that emphasizes brief interpretation, iteration, and presenting work with a clear rationale. Internship hours are recorded against defined studio checkpoints.",
    durationOptions,
    defaultDuration: "8 weeks",
    internshipAvailable: true,
    certificateAvailable: true,
    whoItsFor: [
      "Design, media, and interdisciplinary students",
      "Learners who can share work-in-progress for review",
      "Students who want internship documentation alongside studio practice",
    ],
    learningOutcomes: [
      "Respond to a written brief",
      "Document iterations and decisions",
      "Present work in a structured review",
      "Compile a completion packet",
    ],
    structure: [
      { title: "Briefing", detail: "How studio internships are scoped and evaluated." },
      { title: "Production", detail: "Scheduled deliverables with critique notes." },
      { title: "Internship studio", detail: "Applied work in the Design Studio Internship." },
      { title: "Archive", detail: "Final files and completion confirmation." },
    ],
    internshipRelationship:
      "Linked to the Design Studio Internship. Certificate details follow the internship record, not a portfolio grade.",
    certificateNote:
      "Certificates confirm recorded participation and completion. They are not a substitute for a professional license.",
    image: {
      src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1600&q=80",
      alt: "Designer reviewing printed layouts on a table",
    },
    relatedInternshipSlugs: ["design-studio-internship"],
    faqs: [
      {
        question: "Do I need a design degree?",
        answer:
          "A related course of study is helpful but not described as mandatory here. Eligibility is confirmed during enrollment review.",
      },
    ],
  },
  {
    id: "prg-communications",
    slug: "communications-practice",
    name: "Communications Practice",
    category: "communications",
    categoryLabel: "Communications",
    summary:
      "Writing, editing, and stakeholder communication practiced inside a supervised internship structure.",
    description:
      "Communications Practice focuses on clear writing, editorial judgment, and professional correspondence. Students work against briefs and keep a documented trail of reviews.",
    durationOptions,
    defaultDuration: "8 weeks",
    internshipAvailable: true,
    certificateAvailable: true,
    whoItsFor: [
      "Students in media, English, marketing, or related programs",
      "Learners who want supervised writing experience",
      "Participants who can meet weekly editorial checkpoints",
    ],
    learningOutcomes: [
      "Draft and revise against a brief",
      "Maintain an editorial log",
      "Communicate status without exaggeration",
      "Submit a completion record",
    ],
    structure: [
      { title: "Voice and standards", detail: "House style, review notes, and source handling." },
      { title: "Production cycle", detail: "Scheduled writing and editing assignments." },
      { title: "Internship desk", detail: "Applied work in the Communications Internship." },
      { title: "Close", detail: "Archive and certificate eligibility check." },
    ],
    internshipRelationship:
      "Paired with the Communications Internship. Enrollment selects duration for the internship record.",
    certificateNote:
      "Issued after completion is confirmed. Verification uses the Certificate ID shown on the document.",
    image: {
      src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
      alt: "Notebook, printed pages, and a pen on a wooden desk",
    },
    relatedInternshipSlugs: ["communications-internship"],
    faqs: [
      {
        question: "Is this a journalism course?",
        answer:
          "It is a career-oriented communications internship program, not a degree or journalism qualification.",
      },
    ],
  },
  {
    id: "prg-workplace-operations",
    slug: "workplace-practice",
    name: "Workplace Practice",
    category: "operations",
    categoryLabel: "Operations",
    summary:
      "A general internship track for students who need structured workplace exposure and complete documentation.",
    description:
      "Workplace Practice is for students whose academic path is still forming, or who need a clearly supervised internship with defined duration, reviews, and a certificate pathway.",
    durationOptions,
    defaultDuration: "4 weeks",
    internshipAvailable: true,
    certificateAvailable: true,
    whoItsFor: [
      "Undergraduate students seeking a first documented internship",
      "Learners who need a defined schedule and supervisor checkpoints",
      "Students who value verification-ready records",
    ],
    learningOutcomes: [
      "Follow a workplace schedule and brief",
      "Keep attendance and task notes",
      "Complete review conversations",
      "Understand how completion leads to certification",
    ],
    structure: [
      { title: "Onboarding", detail: "Student account, identity record, and internship start date." },
      { title: "Supervised weeks", detail: "Assigned work with weekly check-ins." },
      { title: "Review", detail: "Completion status recorded on the student profile." },
      { title: "Certification", detail: "Certificate generation after completion is confirmed." },
    ],
    internshipRelationship:
      "Paired with the Workplace Practice Internship. Extensions, when offered, are handled as a separate enrollment step.",
    certificateNote:
      "Certificates can be checked publicly. Private academic records are not displayed on the verification page.",
    image: {
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
      alt: "Students studying together at a long library table",
    },
    relatedInternshipSlugs: ["workplace-practice-internship"],
    faqs: [
      {
        question: "Can the internship be extended?",
        answer:
          "Extension is a separate request after the original duration. Availability, fees, and records will be confirmed in the student account once that service is connected.",
      },
    ],
  },
  {
    id: "prg-research-support",
    slug: "research-support",
    name: "Research Support",
    category: "business",
    categoryLabel: "Business",
    summary:
      "A careful research-assistance track focused on source notes, summaries, and organized findings.",
    description:
      "Research Support trains students to gather, organize, and summarize information for a supervising editor or analyst. It is not an academic degree and does not confer research credentials.",
    durationOptions,
    defaultDuration: "8 weeks",
    internshipAvailable: true,
    certificateAvailable: true,
    whoItsFor: [
      "Students comfortable with reading and structured note-taking",
      "Learners who can cite sources clearly",
      "Participants who prefer desk-based internship work",
    ],
    learningOutcomes: [
      "Build a source log",
      "Write accurate summaries",
      "Flag uncertainty instead of filling gaps",
      "Deliver a completion dossier",
    ],
    structure: [
      { title: "Methods", detail: "How intern research notes are expected to be kept." },
      { title: "Assignments", detail: "Scoped research briefs with review." },
      { title: "Internship desk", detail: "Applied work in the Research Support Internship." },
      { title: "Handover", detail: "Final files and completion confirmation." },
    ],
    internshipRelationship:
      "Paired with the Research Support Internship. Findings remain internal unless a supervisor publishes them.",
    certificateNote:
      "The certificate records internship completion, not publication or peer review.",
    image: {
      src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80",
      alt: "Open books stacked on a library table",
    },
    relatedInternshipSlugs: ["research-support-internship"],
    faqs: [
      {
        question: "Will my research be published?",
        answer:
          "Publication is not part of the standard internship. Work is treated as supervised practice unless otherwise agreed in writing.",
      },
    ],
  },
]

export const programCategories = [
  { value: "all", label: "All categories" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "design", label: "Design" },
  { value: "communications", label: "Communications" },
  { value: "operations", label: "Operations" },
] as const
