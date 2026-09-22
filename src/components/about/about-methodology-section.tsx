import * as React from "react"
import {
  SparklesIcon,
  ShieldCheckIcon,
  CompassIcon,
  FileCheckIcon,
  ScaleIcon,
} from "lucide-react"

const methodologyRules = [
  {
    num: "01",
    title: "Structure Before Spectacle",
    subtitle: "Intentional Milestones",
    description:
      "Internships have a documented start date, an end date, and regular supervisor checkpoints. We reject open-ended favors and informal promises in favor of defined briefs.",
    icon: CompassIcon,
  },
  {
    num: "02",
    title: "Experience Is The Product",
    subtitle: "Practice First",
    description:
      "Students enroll to complete supervised work and build demonstrable capabilities. Documentation and certificate issuance follow the work, not the other way around.",
    icon: FileCheckIcon,
  },
  {
    num: "03",
    title: "Records That Can Be Checked",
    subtitle: "Public Accountability",
    description:
      "Every issued document must match an accessible record on our public ledger. Academic evaluators and employers must be able to verify authenticity without delays or logins.",
    icon: ShieldCheckIcon,
  },
  {
    num: "04",
    title: "Zero Inflated Claims",
    subtitle: "Integrity in Copy",
    description:
      "We avoid marketing hyperbole and false placement guarantees. Partnerships, statistics, and deliverables appear only when we can stand behind them with complete institutional confidence.",
    icon: ScaleIcon,
  },
]

export function AboutMethodologySection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a1526] text-white py-16 sm:py-20 lg:py-28 border-y border-white/10">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial from-[#d4af37]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/15">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0e2238] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5d77f] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>OUR OPERATING PHILOSOPHY</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.08] tracking-tight text-white">
              The 4 Guiding Rules of <br />
              <span className="italic text-[#f5d77f]">Our Internship Methodology.</span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mt-3.5 font-normal">
              Every curriculum brief, review session, and certificate issued by our organization is governed by four non-negotiable institutional principles.
            </p>
          </div>

          <div className="text-left lg:text-right hidden sm:block">
            <div className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-[#7388a1]">
              INTEGRITY • TRANSPARENCY • RIGOR • AUDIT
            </div>
            <div className="font-heading italic text-xs text-[#d4af37] mt-1">
              Instituting A Higher Standard
            </div>
          </div>
        </div>

        {/* 4 Methodology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {methodologyRules.map((rule) => {
            const Icon = rule.icon
            return (
              <div
                key={rule.num}
                className="rounded-2xl border border-white/10 bg-[#0e1f33]/90 p-6 flex flex-col justify-between gap-6 hover:border-[#d4af37]/50 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <span className="font-mono text-xl font-bold text-[#f5d77f]">
                      {rule.num}
                    </span>
                    <div className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-[#d4af37]">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-wider block">
                    {rule.subtitle}
                  </span>

                  <h3 className="font-heading text-lg font-bold text-white mt-1 group-hover:text-[#f5d77f] transition-colors">
                    {rule.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                    {rule.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-[#d4af37] uppercase">
                  Audited Policy
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
