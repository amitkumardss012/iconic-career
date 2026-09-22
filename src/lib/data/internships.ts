import type { Internship } from "@/lib/types"

const durationOptions = ["4 weeks", "8 weeks", "12 weeks"]

export const internships: Internship[] = [
  {
    id: "int-digital",
    slug: "digital-practice-internship",
    name: "Digital Practice Internship",
    category: "technology",
    categoryLabel: "Technology",
    summary:
      "A supervised internship for students applying digital delivery habits against weekly briefs.",
    overview:
      "Interns work through a defined sequence: onboarding, assigned briefs, review notes, and a completion file. The internship is linked to the Digital Practice program so learning and recorded experience stay aligned.",
    programSlug: "digital-practice",
    durationOptions,
    defaultDuration: "8 weeks",
    eligibility: [
      "Enrolled or recently enrolled in a relevant academic course",
      "Ability to attend scheduled check-ins",
      "Willingness to keep written task records",
    ],
    structure: [
      { title: "Start", detail: "Student account, internship start date, and briefing." },
      { title: "Assigned work", detail: "Weekly digital briefs with documented review." },
      { title: "Mid-point", detail: "Progress recorded against the selected duration." },
      { title: "Completion", detail: "Close-out review before certificate eligibility." },
    ],
    completionProcess: [
      "Internship hours and reviews are recorded on the student profile.",
      "A supervisor confirms completion status.",
      "Certificate generation is offered only after completion is recorded.",
    ],
    certificateProcess: [
      "Completion unlocks certificate issuance.",
      "The document includes name, internship, duration, dates, and Certificate ID.",
      "Third parties can check the ID on the public verification page.",
    ],
    extensionNote:
      "If an extension is available, it is requested after the original end date and treated as a separate paid service once payments are connected.",
    image: {
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
      alt: "Mentor and student reviewing work on a laptop",
    },
    faqs: [
      {
        question: "Is this remote or on-site?",
        answer:
          "Format is confirmed during enrollment. The public pages describe structure, not a guaranteed location.",
      },
    ],
  },
  {
    id: "int-ops",
    slug: "business-operations-internship",
    name: "Business Operations Internship",
    category: "business",
    categoryLabel: "Business",
    summary:
      "Internship work centered on coordination, reporting, and operational follow-through.",
    overview:
      "Students support a simple operating rhythm: trackers, written updates, and scheduled reviews. Completion is based on recorded participation, not on hiring outcomes.",
    programSlug: "business-operations",
    durationOptions,
    defaultDuration: "8 weeks",
    eligibility: [
      "Comfort with spreadsheets or shared trackers",
      "Reliable written communication",
      "Availability for the selected duration",
    ],
    structure: [
      { title: "Desk setup", detail: "Tools, reporting format, and supervisor contact." },
      { title: "Weekly cycle", detail: "Assigned operational tasks and status notes." },
      { title: "Review", detail: "Documented feedback at planned intervals." },
      { title: "Close-out", detail: "Completion file and certificate pathway." },
    ],
    completionProcess: [
      "Tasks and attendance are logged.",
      "Completion status is set by the organization.",
      "The student can then proceed to certificate steps.",
    ],
    certificateProcess: [
      "Certificate details mirror the internship record.",
      "Verification does not display private contact details.",
    ],
    extensionNote:
      "Extensions, when offered, continue the same internship record with a new end date after payment verification.",
    image: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
      alt: "Small team in a workshop discussion around a table",
    },
    faqs: [
      {
        question: "Will I receive a stipend?",
        answer:
          "Compensation, if any, is confirmed during enrollment. It is not advertised as a default on this page.",
      },
    ],
  },
  {
    id: "int-design",
    slug: "design-studio-internship",
    name: "Design Studio Internship",
    category: "design",
    categoryLabel: "Design",
    summary:
      "A studio internship with briefs, critique, and an archived completion packet.",
    overview:
      "Interns interpret briefs, iterate with notes, and present work at scheduled reviews. The internship is paired with the Design Studio program.",
    programSlug: "design-studio",
    durationOptions,
    defaultDuration: "8 weeks",
    eligibility: [
      "Ability to share work-in-progress",
      "Basic familiarity with a design tool of choice",
      "Commitment to critique sessions",
    ],
    structure: [
      { title: "Brief", detail: "Written assignment and constraints." },
      { title: "Iterate", detail: "Documented revisions." },
      { title: "Review", detail: "Supervisor notes." },
      { title: "Archive", detail: "Final files for completion." },
    ],
    completionProcess: [
      "Deliverables are logged against the brief.",
      "Completion is recorded after the final review.",
    ],
    certificateProcess: [
      "The certificate names the internship and duration.",
      "It does not grade artistic quality.",
    ],
    extensionNote:
      "Studio extensions may be requested if the original duration is insufficient. Approval is not automatic.",
    image: {
      src: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1600&q=80",
      alt: "Creative meeting with sketches and design layouts on a table",
    },
    faqs: [
      {
        question: "Do I need Adobe software?",
        answer:
          "Tooling is confirmed in the internship brief. The program does not require a specific commercial license on this page.",
      },
    ],
  },
  {
    id: "int-comms",
    slug: "communications-internship",
    name: "Communications Internship",
    category: "communications",
    categoryLabel: "Communications",
    summary:
      "Supervised writing and editing against an editorial calendar.",
    overview:
      "Interns draft, revise, and log correspondence or content according to house standards. Linked to Communications Practice.",
    programSlug: "communications-practice",
    durationOptions,
    defaultDuration: "8 weeks",
    eligibility: [
      "Clear written English",
      "Willingness to accept editorial notes",
      "Availability for weekly deadlines",
    ],
    structure: [
      { title: "Style", detail: "Standards and source handling." },
      { title: "Desk", detail: "Assigned writing and edits." },
      { title: "Review", detail: "Editor notes." },
      { title: "Close", detail: "Completion archive." },
    ],
    completionProcess: [
      "Pieces are logged in the internship file.",
      "Completion follows the final editorial review.",
    ],
    certificateProcess: [
      "Certificate ID can be checked publicly.",
      "Drafts themselves are not published on the verification page.",
    ],
    extensionNote:
      "Editorial internships may be extended when both the student and supervisor agree, subject to enrollment rules.",
    image: {
      src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80",
      alt: "Person writing in a notebook beside a laptop",
    },
    faqs: [
      {
        question: "Will my writing be published publicly?",
        answer:
          "Not by default. Publication is a separate decision and is not implied by enrollment.",
      },
    ],
  },
  {
    id: "int-workplace",
    slug: "workplace-practice-internship",
    name: "Workplace Practice Internship",
    category: "operations",
    categoryLabel: "Operations",
    summary:
      "A first internship with defined duration, supervision, and complete records.",
    overview:
      "This internship is intended for students who need a clear, supervised workplace experience. It is paired with Workplace Practice.",
    programSlug: "workplace-practice",
    durationOptions,
    defaultDuration: "4 weeks",
    eligibility: [
      "Student status or recent graduate status as confirmed at enrollment",
      "Ability to follow a weekly schedule",
      "Agreement to keep attendance notes",
    ],
    structure: [
      { title: "Identity", detail: "Student account and internship identity record." },
      { title: "Schedule", detail: "Defined start and end dates." },
      { title: "Work", detail: "Assigned tasks with check-ins." },
      { title: "Completion", detail: "Status update and certificate option." },
    ],
    completionProcess: [
      "Attendance and task notes are reviewed.",
      "Completion status is set on the student profile.",
    ],
    certificateProcess: [
      "Certificate generation follows completion.",
      "A separate certificate payment may apply when that service is live.",
    ],
    extensionNote:
      "Students may request an extension before the original end date. The new duration is recorded only after confirmation.",
    image: {
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
      alt: "Young professionals talking in a bright common area",
    },
    faqs: [
      {
        question: "Do I get a student ID?",
        answer:
          "Student accounts are planned to include an internal student ID after enrollment and payment verification. That account area is part of a later phase.",
      },
    ],
  },
  {
    id: "int-research",
    slug: "research-support-internship",
    name: "Research Support Internship",
    category: "business",
    categoryLabel: "Business",
    summary:
      "Desk-based research assistance with source logs and written summaries.",
    overview:
      "Interns gather and organize information for a supervisor. Linked to the Research Support program. This is supervised practice, not a research degree.",
    programSlug: "research-support",
    durationOptions,
    defaultDuration: "8 weeks",
    eligibility: [
      "Comfort with long-form reading",
      "Careful note-taking",
      "Honesty about uncertain sources",
    ],
    structure: [
      { title: "Scope", detail: "Research question and limits." },
      { title: "Collect", detail: "Source log." },
      { title: "Summarize", detail: "Written briefings." },
      { title: "Handover", detail: "Final dossier." },
    ],
    completionProcess: [
      "The dossier is reviewed for completeness.",
      "Completion is recorded independently of publication.",
    ],
    certificateProcess: [
      "The certificate confirms internship completion only.",
    ],
    extensionNote:
      "Research internships can be extended when the original scope is incomplete, subject to review.",
    image: {
      src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
      alt: "Library stacks with warm lighting",
    },
    faqs: [
      {
        question: "Is ethics approval included?",
        answer:
          "This internship does not describe human-subjects research. Any specialized compliance would be defined separately in writing.",
      },
    ],
  },
]
