import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

// Dedicated SVG crests matching the institutional emblems in the mockup
function DelhiUniversityLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-6 shrink-0" fill="none">
      <circle cx="16" cy="16" r="15" fill="#6b21a8" />
      <circle cx="16" cy="16" r="12" stroke="#e9d5ff" strokeWidth="1" />
      {/* Lotus / Crest motif */}
      <path
        d="M16 8C14 11 13 14 16 19C19 14 18 11 16 8Z"
        fill="#ffffff"
      />
      <path
        d="M16 19C13 17 10 16 9 19C11 20 14 20 16 19Z"
        fill="#fde047"
      />
      <path
        d="M16 19C19 17 22 16 23 19C21 20 18 20 16 19Z"
        fill="#fde047"
      />
      <circle cx="16" cy="22" r="1.5" fill="#ffffff" />
    </svg>
  )
}

function AmityUniversityLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-6 shrink-0" fill="none">
      {/* Blue shield with gold crest */}
      <path
        d="M16 3L27 7V16C27 22.5 22 27.5 16 29C10 27.5 5 22.5 5 16V7L16 3Z"
        fill="#1e3a8a"
      />
      <path
        d="M16 5.5L25 9V15.5C25 21 21 25.5 16 27C11 25.5 7 21 7 15.5V9L16 5.5Z"
        stroke="#facc15"
        strokeWidth="1"
      />
      {/* Gold crest tree/flame */}
      <path
        d="M16 9L18.5 14H13.5L16 9Z"
        fill="#facc15"
      />
      <path
        d="M16 14V22"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <path
        d="M12 18H20"
        stroke="#facc15"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ChandigarhUniversityLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-6 shrink-0" fill="none">
      <rect x="3" y="3" width="26" height="26" rx="4" fill="#b91c1c" />
      <circle cx="16" cy="12" r="4.5" fill="#facc15" />
      <path
        d="M11 23V18H14M18 18V23H21"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="12" r="2" fill="#b91c1c" />
    </svg>
  )
}

function LPULogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-6 shrink-0" fill="none">
      <circle cx="16" cy="16" r="14" fill="#ea580c" />
      <circle cx="16" cy="16" r="11" stroke="#ffedd5" strokeWidth="1" />
      {/* Sunburst rays */}
      <path
        d="M16 7V10M16 22V25M7 16H10M22 16H25M9.5 9.5L11.5 11.5M20.5 20.5L22.5 22.5M9.5 22.5L11.5 20.5M20.5 11.5L22.5 9.5"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="4" fill="#ffffff" />
    </svg>
  )
}

function UPESLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-6 shrink-0" fill="none">
      {/* Red angular chevron badge */}
      <path
        d="M16 3L27 10V22L16 29L5 22V10L16 3Z"
        fill="#dc2626"
      />
      <path
        d="M16 8L22 13V19L16 23L10 19V13L16 8Z"
        fill="#ffffff"
      />
      <path
        d="M16 11L19 14.5V17.5L16 19.5L13 17.5V14.5L16 11Z"
        fill="#dc2626"
      />
    </svg>
  )
}

function KIITLogo() {
  return (
    <svg viewBox="0 0 32 32" className="size-6 shrink-0" fill="none">
      <circle cx="16" cy="16" r="14" fill="#15803d" />
      <circle cx="16" cy="16" r="11" stroke="#dcfce7" strokeWidth="1" strokeDasharray="2 2" />
      {/* Temple / Cog motif */}
      <path
        d="M16 8L20 13H12L16 8Z"
        fill="#ffffff"
      />
      <rect x="13" y="13" width="6" height="8" fill="#ffffff" />
      <path
        d="M11 21H21"
        stroke="#facc15"
        strokeWidth="2"
      />
    </svg>
  )
}

const institutions = [
  { name: "Delhi University", logo: DelhiUniversityLogo },
  { name: "Amity University", logo: AmityUniversityLogo },
  { name: "Chandigarh University", logo: ChandigarhUniversityLogo },
  { name: "Lovely Professional University", logo: LPULogo },
  { name: "UPES", logo: UPESLogo },
  { name: "KIIT University", logo: KIITLogo },
]

export function TrustCredibilitySection() {
  return (
    <section className="relative overflow-hidden bg-[#0c1827] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Section: Dark Navy Block with Angled Geometric Slant */}
        <div className="lg:col-span-7 xl:col-span-7 bg-[#0f2135] px-6 py-12 sm:px-10 sm:py-16 lg:px-12 lg:py-16 relative z-10 flex flex-col justify-between [clip-path:none] lg:[clip-path:polygon(0_0,100%_0,calc(100%-55px)_100%,0_100%)]">
          {/* Top Micro-Copy in top-right of dark block */}
          <div className="absolute top-6 right-16 sm:top-8 sm:right-20 text-right hidden sm:block pointer-events-none select-none">
            <div className="text-[0.62rem] font-semibold tracking-[0.22em] leading-relaxed uppercase text-[#7388a1]">
              COLLABORATION<br />
              LEARNING<br />
              OPPORTUNITY<br />
              GROWTH
            </div>
          </div>

          <div>
            {/* Eyebrow */}
            <div className="text-[0.7rem] font-semibold tracking-[0.22em] text-[#c59b63] uppercase mb-3.5">
              TRUST & CREDIBILITY
            </div>

            {/* Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.12] tracking-tight text-white max-w-xl">
              Trusted by Students. <br />
              Recognised by Institutions.
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm leading-relaxed text-[#94a3b8] max-w-lg mt-3.5 font-normal">
              Students from leading universities and colleges across India trust The Iconic Career for their internship journey.
            </p>

            {/* University Logos Row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-4 mt-8 pt-6 border-t border-white/10">
              {institutions.map((inst) => {
                const Logo = inst.logo
                return (
                  <div key={inst.name} className="flex items-center gap-2">
                    <Logo />
                    <span className="text-[11px] sm:text-xs font-medium text-slate-200 whitespace-nowrap">
                      {inst.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Controls Row: Arrows + AND MANY MORE */}
          <div className="flex items-center gap-4 mt-10 pt-4 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous institutions"
                className="size-6 rounded-full border border-white/20 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/40 transition-colors"
              >
                <ChevronLeftIcon className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Next institutions"
                className="size-6 rounded-full border border-white/20 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/40 transition-colors"
              >
                <ChevronRightIcon className="size-3.5" />
              </button>
            </div>

            <div className="h-px w-12 bg-white/20" />

            <span className="text-[0.62rem] font-semibold tracking-[0.22em] text-[#7388a1] uppercase">
              AND MANY MORE
            </span>
          </div>
        </div>

        {/* Right Section: Campus Architecture with Angular Wall Lettering */}
        <div className="lg:col-span-5 xl:col-span-5 relative min-h-[320px] lg:min-h-[460px] lg:-ml-12">
          <img
            src="/images/campus-trust.jpg"
            alt="Premier Indian Institute campus building"
            className="object-cover object-center"
          />

          {/* Architectural Wall Typography Overlay */}
          <div className="absolute top-1/2 -translate-y-1/2 left-8 sm:left-14 pointer-events-none select-none">
            <div className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-white leading-none uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] opacity-95">
              A SKILLED<br />
              GENERATION<br />
              A STRONGER<br />
              <span className="text-[#facc15]">INDIA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
