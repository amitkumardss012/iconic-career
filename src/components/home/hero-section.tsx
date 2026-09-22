import { Link } from "@tanstack/react-router"
import { ArrowRightIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] flex justify-center">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-28 min-h-0 lg:min-h-[740px] flex items-center">
        {/* Background Image Layer: Only rendered on desktop/large screens (hidden on mobile) */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[62%] xl:w-[60%] pointer-events-none select-none z-0">
          <img
            src="/images/hero-student.jpg"
            alt="Student with laptop on modern sunlit campus" loading="eager"
            className="object-cover object-[62%_20%]"
          />

          {/* Minimal, crisp left edge blend only — zero haze over the student */}
          <div className="absolute inset-y-0 left-0 w-24 lg:w-36 bg-gradient-to-r from-[#faf8f5] to-transparent z-10" />

          {/* Soft bottom dissolve so the image fades out smoothly into the section background */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/90 to-transparent z-10" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Eyebrow, Display Typography, Description, CTAs, Stats */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center max-w-xl">
            {/* Eyebrow */}
            <div className="text-[0.7rem] sm:text-[0.75rem] font-semibold tracking-[0.22em] text-[#9b6f43] uppercase mb-4">
              REAL LEARNING. REAL EXPOSURE. REAL IMPACT.
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-[46px] sm:text-[64px] lg:text-[72px] xl:text-[78px] font-normal leading-[1.04] tracking-tight text-[#14233c]">
              Your <br />
              Career Story <br />
              <span className="text-[#a07142]">Starts Here.</span>
            </h1>

            {/* Subparagraph */}
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#596579] max-w-lg mt-5 font-normal">
              Industry-aligned internship programmes designed to help you gain real-world experience, build in-demand skills and earn verifiable certifications.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-8">
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-md bg-[#8e653e] hover:bg-[#7b542e] text-white px-5 sm:px-6 py-3 text-xs sm:text-sm font-medium shadow-sm transition-colors"
              >
                <span>Explore Programmes</span>
                <ArrowRightIcon className="size-4" />
              </Link>

              <button
                type="button"
                className="inline-flex items-center gap-2.5 rounded-md border border-[#334155]/25 bg-white/80 hover:bg-white text-[#14233c] px-4 sm:px-5 py-3 text-xs sm:text-sm font-medium transition-colors shadow-2xs backdrop-blur-xs"
              >
                <span className="flex size-5 items-center justify-center rounded-full border border-current">
                  <PlayIcon className="size-2.5 fill-current ml-0.5" />
                </span>
                <span>Watch Our Story</span>
              </button>
            </div>

            {/* Bottom Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 pt-8 mt-10 border-t border-[#e5dfd5]/80">
              <div className="sm:pr-4">
                <div className="font-heading text-2xl sm:text-3xl font-medium text-[#14233c]">
                  50K+
                </div>
                <div className="text-[0.68rem] text-[#64748b] leading-tight mt-1 font-medium">
                  Students Empowered
                </div>
              </div>

              <div className="sm:border-l sm:border-[#e2dcce] sm:px-4">
                <div className="font-heading text-2xl sm:text-3xl font-medium text-[#14233c]">
                  20+
                </div>
                <div className="text-[0.68rem] text-[#64748b] leading-tight mt-1 font-medium">
                  Program Domains
                </div>
              </div>

              <div className="sm:border-l sm:border-[#e2dcce] sm:px-4">
                <div className="font-heading text-2xl sm:text-3xl font-medium text-[#14233c]">
                  100%
                </div>
                <div className="text-[0.68rem] text-[#64748b] leading-tight mt-1 font-medium">
                  Online & Flexible
                </div>
              </div>

              <div className="sm:border-l sm:border-[#e2dcce] sm:pl-4">
                <div className="font-heading text-2xl sm:text-3xl font-medium text-[#a07142]">
                  Verified
                </div>
                <div className="text-[0.68rem] text-[#64748b] leading-tight mt-1 font-medium">
                  Certificates
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Community Card & Far-Right Editorial Strip (desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative h-full flex-col justify-between min-h-[580px] pointer-events-none">
            {/* Far-Right Editorial Vertical Column */}
            <div className="self-end text-right flex flex-col items-end gap-6 text-[#5b687c] pt-2 pointer-events-auto">
              {/* Cursive / Italic progression */}
              <div className="font-heading italic text-sm text-[#8c6239] space-y-1">
                <div>Learn</div>
                <div>Experience</div>
                <div>Get Certified</div>
                <div>Grow</div>
              </div>

              {/* Clean uppercase pillar words */}
              <div className="text-[0.65rem] font-semibold tracking-[0.18em] leading-relaxed uppercase text-[#64748b]">
                SKILLS<br />
                PEOPLE<br />
                OPPORTUNITIES<br />
                A BRIGHTER<br />
                TOMORROW
              </div>
            </div>

            {/* Bottom Row: Floating Community Badge + Slider Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-auto pt-6 pointer-events-auto">
              {/* Floating Community Card */}
              <div className="w-full sm:max-w-[310px] rounded-2xl bg-[#0e1f33]/92 border border-white/15 p-4 text-white shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs sm:text-[13px] font-medium leading-snug text-slate-100">
                    Join a growing community of future builders.
                  </p>
                  <Link
                    to="/register"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/25 transition-colors"
                    aria-label="Join community"
                  >
                    <ArrowRightIcon className="size-3.5 text-white" />
                  </Link>
                </div>

                {/* Overlapping User Avatars */}
                <div className="mt-3 flex items-center -space-x-2">
                  <div className="relative size-7 rounded-full border-2 border-[#0e1f33] overflow-hidden bg-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="Community member"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative size-7 rounded-full border-2 border-[#0e1f33] overflow-hidden bg-slate-300">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="Community member"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative size-7 rounded-full border-2 border-[#0e1f33] overflow-hidden bg-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="Community member"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative size-7 rounded-full border-2 border-[#0e1f33] overflow-hidden bg-slate-300">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="Community member"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Slider Controls and Tagline at bottom right */}
              <div className="flex flex-col items-end gap-1.5 self-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-[#14233c]">01 / 05</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Previous"
                      className="size-5 rounded-full border border-[#cbd5e1] bg-white/70 flex items-center justify-center text-[#64748b] hover:text-[#14233c] hover:border-[#94a3b8] transition-colors shadow-2xs"
                    >
                      <ChevronLeftIcon className="size-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next"
                      className="size-5 rounded-full border border-[#cbd5e1] bg-white/70 flex items-center justify-center text-[#64748b] hover:text-[#14233c] hover:border-[#94a3b8] transition-colors shadow-2xs"
                    >
                      <ChevronRightIcon className="size-3" />
                    </button>
                  </div>
                </div>
                <div className="text-[0.55rem] font-medium tracking-wider uppercase text-[#8c6239] text-right">
                  MORE THAN AN INTERNSHIP<br />
                  A LAUNCHPAD FOR LIFE
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
