import * as React from "react"
import {
  SparklesIcon,
  CompassIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  UsersIcon,
  CheckCircle2Icon,
} from "lucide-react"

const coreValues = [
  {
    title: "Structure Before Spectacle",
    detail:
      "Internships are scheduled professional commitments with clear briefs, recorded milestones, and regular supervisor feedback—not casual favors.",
    icon: CompassIcon,
    tag: "DISCIPLINE",
  },
  {
    title: "Experience Over Embellishment",
    detail:
      "We believe that real student capability is built through hands-on practice. We avoid unsupported claims and focus entirely on measurable work.",
    icon: BookOpenIcon,
    tag: "PRACTICE",
  },
  {
    title: "Verifiable Public Standing",
    detail:
      "A completion credential must be backed by an accessible public record so academic evaluators and employers can confirm authenticity without delay.",
    icon: ShieldCheckIcon,
    tag: "ACCOUNTABILITY",
  },
  {
    title: "Support Across The Journey",
    detail:
      "From orientation through final certificate issuance, our platform ensures every learner has clear guidance, recorded progress, and accessible support.",
    icon: UsersIcon,
    tag: "MENTORSHIP",
  },
]

export function AboutValuesSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28 border-b border-[#ede7de]">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
            <SparklesIcon className="size-3 text-[#d4af37]" />
            <span>OUR CORE VALUES</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
            The Principles That Shape <br />
            <span className="italic text-[#a07142]">Every Decision We Make.</span>
          </h2>

          <p className="text-sm text-[#596579] leading-relaxed max-w-xl mt-3.5 font-normal">
            Rooted in academic accountability, transparent verification, and student empowerment.
          </p>
        </div>

        {/* 4 Values Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val) => {
            const Icon = val.icon
            return (
              <div
                key={val.title}
                className="group rounded-2xl border border-[#e2dcce] bg-white p-6 flex flex-col justify-between gap-6 shadow-[0_2px_12px_rgba(20,35,60,0.03)] hover:border-[#a07142]/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="size-10 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 group-hover:bg-[#8e653e] group-hover:text-white transition-colors">
                      <Icon className="size-5" />
                    </div>

                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8e653e] bg-[#faf6f0] border border-[#eee3d5] px-2 py-0.5 rounded">
                      {val.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-[#14233c] group-hover:text-[#a07142] transition-colors">
                    {val.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#596579] leading-relaxed mt-2.5">
                    {val.detail}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f0eae1] flex items-center gap-1.5 text-[11px] font-medium text-[#8e653e]">
                  <CheckCircle2Icon className="size-3" />
                  <span>Institutional Principle</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
