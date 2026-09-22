import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  StarIcon,
  SparklesIcon,
  QuoteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AwardIcon,
  CheckCircle2Icon,
} from "lucide-react"

const verifiedAlumni = [
  {
    id: "alumni-1",
    name: "Rohan Verma",
    institution: "Delhi University",
    track: "Digital Practice & Product Ops",
    cohort: "Cohort 2026",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    quote:
      "Unlike generic video courses, this was an active internship with weekly supervisor checkpoints. My supervisor gave detailed feedback on my sprint task logs, and the QR certificate was verified by my university registrar without any friction.",
    certificateId: "IC-2026-DP-4192",
  },
  {
    id: "alumni-2",
    name: "Pooja Sundaram",
    institution: "Amity University",
    track: "Business Operations",
    cohort: "Cohort 2026",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    quote:
      "The structure gave me real operational discipline. We maintained live trackers and delivered weekly briefs under actual production deadlines. Having an immutable Certificate ID on my resume gave me immediate credibility in interviews.",
    certificateId: "IC-2026-BO-7718",
  },
  {
    id: "alumni-3",
    name: "Aditya Nair",
    institution: "Chandigarh University",
    track: "Design Studio Track",
    cohort: "Cohort 2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    quote:
      "The Design Studio track pushed me to articulate design decisions during structured critique checkpoints. I walked away with both a documented completion dossier and verifiable proof that employers checked during my hiring round.",
    certificateId: "IC-2026-DS-9041",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? verifiedAlumni.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === verifiedAlumni.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28 border-b border-[#ede7de]">
      {/* Mesh Grid */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10 sm:gap-14">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#e2dcce]/90">
          <div className="max-w-2xl">
            {/* Illuminated Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>FIRST-PERSON PERSPECTIVES</span>
              <span className="h-2 w-px bg-[#d6cbba]" />
              <span className="text-[10px] text-[#64748b] tracking-normal font-medium">
                Verified Student Alumni
              </span>
            </div>

            {/* Display Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
              Real Feedback. <br />
              <span className="italic text-[#a07142]">Documented Experiences.</span>
            </h2>

            {/* Subtext */}
            <p className="text-sm text-[#596579] leading-relaxed max-w-xl mt-3.5 font-normal">
              Authentic commentary from university students on internship supervision, milestone review rigor, and public credential verification.
            </p>
          </div>

          {/* Controls matching Hero pagination */}
          <div className="flex items-center gap-3 self-start lg:self-end">
            <span className="text-xs font-mono font-bold text-[#14233c]">
              0{currentIndex + 1} / 0{verifiedAlumni.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous story"
                className="size-8 rounded-full border border-[#cbd5e1] bg-white flex items-center justify-center text-[#64748b] hover:text-[#14233c] hover:border-[#14233c] transition-colors shadow-2xs cursor-pointer"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next story"
                className="size-8 rounded-full border border-[#cbd5e1] bg-white flex items-center justify-center text-[#64748b] hover:text-[#14233c] hover:border-[#14233c] transition-colors shadow-2xs cursor-pointer"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {verifiedAlumni.map((item, idx) => {
            const isFeatured = idx === currentIndex

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
                  isFeatured
                    ? "bg-[#0e1f33] text-white border-[#d4af37] shadow-xl ring-1 ring-[#d4af37]/40 -translate-y-1"
                    : "bg-white text-[#14233c] border-[#e2dcce] hover:border-[#a07142]/60 hover:shadow-md"
                }`}
              >
                <div>
                  {/* Top Row: Stars + Quote Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="size-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    <QuoteIcon
                      className={`size-6 ${
                        isFeatured ? "text-[#d4af37]/60" : "text-[#d4af37]/40"
                      }`}
                    />
                  </div>

                  {/* Testimonial Quote */}
                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed italic ${
                      isFeatured ? "text-slate-200" : "text-[#475569]"
                    }`}
                  >
                    “{item.quote}”
                  </p>
                </div>

                {/* Bottom Student Profile */}
                <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/15 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-200">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h4
                        className={`font-heading text-base font-bold truncate leading-tight ${
                          isFeatured ? "text-white" : "text-[#14233c]"
                        }`}
                      >
                        {item.name}
                      </h4>
                      <span
                        className={`text-xs truncate ${
                          isFeatured ? "text-slate-300" : "text-[#64748b]"
                        }`}
                      >
                        {item.institution} • {item.track}
                      </span>
                    </div>
                  </div>

                  {/* Certificate ID Badge */}
                  <div
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-mono flex items-center justify-between ${
                      isFeatured
                        ? "bg-white/10 text-amber-300 border border-white/10"
                        : "bg-[#faf6f0] text-[#8e653e] border border-[#eee5d8]"
                    }`}
                  >
                    <span>ID: {item.certificateId}</span>
                    <span className="flex items-center gap-1 text-[9.5px]">
                      <CheckCircle2Icon className="size-2.5" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
