import { GraduationCapIcon, UserCheck2Icon, BarChart3Icon, AwardIcon } from "lucide-react"

const features = [
  {
    icon: GraduationCapIcon,
    title: "Industry-Relevant Curriculum",
    description: "Learn the skills that match current industry needs.",
  },
  {
    icon: UserCheck2Icon,
    title: "Student-Centric Approach",
    description: "Flexible, accessible and designed around you.",
  },
  {
    icon: BarChart3Icon,
    title: "Practical Learning",
    description: "Gain real-world experience through hands-on projects.",
  },
  {
    icon: AwardIcon,
    title: "Verifiable Certification",
    description: "Earn certificates that add real value.",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] flex justify-center">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-28 min-h-0 lg:min-h-[640px] flex items-center">
        {/* Background Bleachers Image Layer: Only rendered on desktop/large screens (hidden on mobile) */}
        <div className="hidden lg:block absolute top-6 sm:top-10 lg:top-14 bottom-0 right-0 w-[50%] xl:w-[48%] rounded-tl-2xl lg:rounded-tl-3xl overflow-hidden pointer-events-none select-none z-0">
          <img
            src="/images/why-choose-us.jpg"
            alt="University students collaborating on wooden amphitheater steps" loading="eager"
            className="object-cover object-center"
          />

          {/* Crisp, subtle left edge fade */}
          <div className="absolute inset-y-0 left-0 w-20 lg:w-32 bg-gradient-to-r from-[#faf8f5] to-transparent z-10" />

          {/* Subtle top edge fade */}
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#faf8f5] to-transparent z-10" />

          {/* Architectural vertical lettering on right wall */}
          <div className="absolute top-8 right-8 text-right pointer-events-none select-none z-10">
            <div className="text-[0.62rem] sm:text-[0.68rem] font-bold tracking-[0.22em] leading-relaxed uppercase text-[#64748b]/90">
              BETTER<br />
              LEARNERS<br />
              BRIGHTER<br />
              TOMORROWS
            </div>
          </div>

          {/* Floating Dark Navy Quote Card anchored over bottom right */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 max-w-[300px] rounded-lg bg-[#0e2238]/95 p-4 text-white shadow-2xl border border-white/10 backdrop-blur-xs pointer-events-auto z-20">
            <div className="flex items-start gap-2.5">
              <span className="font-heading text-2xl leading-none text-[#d4af37] select-none font-bold">
                “
              </span>
              <div>
                <p className="text-xs font-normal leading-relaxed text-slate-200">
                  Education is not just about learning, but about creating opportunities.
                </p>
                <div className="mt-2 h-[1.5px] w-8 bg-[#d4af37]/80 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 w-full max-w-2xl xl:max-w-3xl">
          {/* Eyebrow */}
          <div className="text-[0.7rem] font-semibold tracking-[0.22em] text-[#9b6f43] uppercase mb-3.5">
            WHY CHOOSE US
          </div>

          {/* Heading */}
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
            More Than a Program. <br />
            <span className="text-[#a07142]">A Stronger You.</span>
          </h2>

          {/* Paragraph */}
          <p className="text-sm sm:text-[15px] leading-relaxed text-[#596579] max-w-xl mt-4 font-normal">
            We combine practical learning, industry exposure and professional certification to help you build real skills and achieve your career goals.
          </p>

          {/* 4 Feature Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 mt-12 pt-6 border-t border-[#f0eae1]/90">
            {features.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex flex-col gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#f6eee3] text-[#9b6f43] shrink-0 shadow-2xs">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-sans text-[13.5px] font-bold text-[#14233c] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#64748b] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
