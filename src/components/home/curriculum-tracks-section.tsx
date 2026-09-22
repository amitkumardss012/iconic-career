import * as React from "react"
import {
  ClockIcon,
  AwardIcon,
  StarIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  SparklesIcon,
  LayersIcon,
  FileTextIcon,
  ChevronRightIcon,
  UserCheck2Icon,
  QrCodeIcon,
  CheckIcon,
  BookOpenIcon,
  FolderOpenIcon,
  ArrowRightIcon,
} from "lucide-react"
import type { Program } from "@/lib/types"

interface CurriculumTracksSectionProps {
  courses?: Program[]
  internships?: Program[]
}

export function CurriculumTracksSection({
  courses = [],
  internships = [],
}: CurriculumTracksSectionProps) {
  const [trackType, setTrackType] = React.useState<"courses" | "internships">("courses")
  const displayPrograms = trackType === "courses" ? courses : internships

  const [activeSlug, setActiveSlug] = React.useState<string>(displayPrograms[0]?.slug || "")
  const [activeTab, setActiveTab] = React.useState<"syllabus" | "outcomes" | "certificate">("syllabus")

  // Auto-sync active slug when tab or programs change
  React.useEffect(() => {
    if (displayPrograms.length > 0) {
      if (!displayPrograms.some((p) => p.slug === activeSlug)) {
        setActiveSlug(displayPrograms[0].slug)
      }
    } else {
      setActiveSlug("")
    }
  }, [displayPrograms, activeSlug])

  const selectedProgram = React.useMemo(() => {
    return displayPrograms.find((p) => p.slug === activeSlug) || displayPrograms[0] || null
  }, [displayPrograms, activeSlug])

  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28 border-t border-[#ede7de]">
      {/* Ambient Radial Mesh Lighting */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-b from-[#f5e6d0]/50 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10 sm:gap-14">
        {/* Section Top Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#e2dcce]/90">
          <div className="max-w-2xl">
            {/* Illuminated Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>INTERACTIVE CURRICULUM STUDIO</span>
              <span className="h-2 w-px bg-[#d6cbba]" />
              <span className="text-[10px] text-[#64748b] tracking-normal font-medium">
                Live Database Catalog
              </span>
            </div>

            {/* Display Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.08] tracking-tight text-[#14233c]">
              Choose Your Track. <br />
              <span className="italic text-[#a07142]">Explore The Real Syllabus.</span>
            </h2>

            {/* Subtext */}
            <p className="text-sm text-[#596579] leading-relaxed max-w-xl mt-3.5 font-normal">
              Browse our verified tracks directly from our database. Switch between Courses and Internship programs below to inspect curriculum milestones and verified credential formats.
            </p>
          </div>

          {/* Right: Two Primary Tabs Switcher (Courses / Internship) */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#ede5d8] border border-[#dccfc0] shadow-inner">
              <button
                type="button"
                onClick={() => setTrackType("courses")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  trackType === "courses"
                    ? "bg-[#14233c] text-white shadow-md shadow-[#14233c]/20 scale-[1.02]"
                    : "text-[#596579] hover:text-[#14233c]"
                }`}
              >
                <BookOpenIcon className="size-4" />
                <span>Courses</span>
                {courses.length > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      trackType === "courses" ? "bg-[#d4af37] text-[#14233c]" : "bg-[#ded2c1] text-[#596579]"
                    }`}
                  >
                    {courses.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTrackType("internships")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  trackType === "internships"
                    ? "bg-[#14233c] text-white shadow-md shadow-[#14233c]/20 scale-[1.02]"
                    : "text-[#596579] hover:text-[#14233c]"
                }`}
              >
                <BriefcaseIcon className="size-4" />
                <span>Internship</span>
                {internships.length > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      trackType === "internships" ? "bg-[#d4af37] text-[#14233c]" : "bg-[#ded2c1] text-[#596579]"
                    }`}
                  >
                    {internships.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        {displayPrograms.length === 0 ? (
          /* Empty State: No Programs / No Courses Found */
          <div className="w-full rounded-2xl border border-dashed border-[#d8cdbd] bg-white/70 py-16 px-6 sm:px-12 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-2xl bg-[#f5eee3] border border-[#e5dcce] flex items-center justify-center text-[#8e653e] mb-4 shadow-xs">
              <FolderOpenIcon className="size-8" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-semibold text-[#14233c]">
              {trackType === "courses" ? "No courses found" : "No programs found"}
            </h3>
            <p className="text-sm text-[#64748b] max-w-md mt-2 leading-relaxed">
              {trackType === "courses"
                ? "There are currently no courses published in the database."
                : "There are currently no internship programs published in the database."}
            </p>
          </div>
        ) : selectedProgram ? (
          /* Master Interactive Studio Layout: Left Track Rail + Right Stage Spotlight */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ========================================================================= */}
            {/* LEFT COLUMN: Vertical Interactive Track Rail (42% Width on Desktop) */}
            {/* ========================================================================= */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#8c6239]">
                  AVAILABLE {trackType === "courses" ? "COURSES" : "INTERNSHIPS"} ({displayPrograms.length})
                </span>
                <span className="text-[11px] text-[#64748b] font-medium">Click to preview</span>
              </div>

              {/* List of Compact Track Cards */}
              <div className="flex flex-col gap-2.5">
                {displayPrograms.map((prog, idx) => {
                  const isSelected = prog.slug === activeSlug

                  return (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => setActiveSlug(prog.slug)}
                      className={`group relative text-left w-full rounded-xl transition-all duration-300 p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer border ${
                        isSelected
                          ? "bg-[#0e1f33] text-white border-[#d4af37] shadow-lg ring-1 ring-[#d4af37]/50 -translate-y-0.5"
                          : "bg-white text-[#14233c] border-[#e5dfd5] hover:border-[#a07142]/60 hover:bg-[#fefdfb] hover:shadow-xs"
                      }`}
                    >
                      {/* Left: Index + Name + Category + Duration */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Track Number */}
                        <span
                          className={`size-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[#d4af37] text-[#0e1f33]"
                              : "bg-[#f5eee3] text-[#8e653e] group-hover:bg-[#8e653e] group-hover:text-white"
                          }`}
                        >
                          0{idx + 1}
                        </span>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            {prog.categoryLabel && (
                              <span
                                className={`text-[9.5px] font-mono uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded ${
                                  isSelected
                                    ? "bg-white/15 text-slate-200"
                                    : "bg-[#f0eae1] text-[#7388a1]"
                                }`}
                              >
                                {prog.categoryLabel}
                              </span>
                            )}
                            {prog.defaultDuration && (
                              <span
                                className={`text-[10px] ${
                                  isSelected ? "text-slate-300" : "text-[#64748b]"
                                }`}
                              >
                                • {prog.defaultDuration}
                              </span>
                            )}
                          </div>

                          <h4
                            className={`font-heading text-[16px] sm:text-[17px] font-bold leading-tight truncate mt-0.5 ${
                              isSelected ? "text-white" : "text-[#14233c] group-hover:text-[#a07142]"
                            }`}
                          >
                            {prog.name}
                          </h4>
                        </div>
                      </div>

                      {/* Right: Price Tag + Arrow */}
                      <div className="flex items-center gap-3 shrink-0">
                        {prog.formattedPrice && (
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                              <span
                                className={`font-sans font-extrabold text-[15px] sm:text-[16px] ${
                                  isSelected ? "text-white" : "text-[#14233c]"
                                }`}
                              >
                                {prog.formattedPrice}
                              </span>
                              {prog.formattedOriginalPrice && (
                                <span
                                  className={`text-[10px] line-through ${
                                    isSelected ? "text-slate-400" : "text-[#94a3b8]"
                                  }`}
                                >
                                  {prog.formattedOriginalPrice}
                                </span>
                              )}
                            </div>
                            {prog.discountPercentage && (
                              <span
                                className={`text-[9px] font-bold px-1 rounded uppercase tracking-tight ${
                                  isSelected
                                    ? "bg-[#d4af37]/25 text-[#f5d77f]"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                {prog.discountPercentage}
                              </span>
                            )}
                          </div>
                        )}

                        <ChevronRightIcon
                          className={`size-4 transition-transform ${
                            isSelected
                              ? "text-[#d4af37] translate-x-1"
                              : "text-[#cbd5e1] group-hover:text-[#14233c] group-hover:translate-x-0.5"
                          }`}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Micro-Banner below left rail */}
              <div className="mt-2 rounded-xl bg-[#f5ede0]/60 border border-[#e8ded0] p-3.5 flex items-center justify-between text-xs text-[#7c5631]">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-[#9b6f43] shrink-0" />
                  <span className="font-medium">Verified practical syllabus & QR registry</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-[#8e653e] uppercase">
                  100% Online
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: Spotlight Studio Stage (58% Width on Desktop)              */}
            {/* ========================================================================= */}
            <div className="lg:col-span-7 rounded-2xl border border-[#d6cbba] bg-white overflow-hidden shadow-[0_16px_40px_rgba(20,35,60,0.08)] flex flex-col">
              {/* Stage Billboard Image Banner */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#0e1f33]">
                {selectedProgram.image?.src ? (
                  <img
                    src={selectedProgram.image.src}
                    alt={selectedProgram.image.alt || selectedProgram.name}
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0e1f33] to-[#1a365d] flex items-center justify-center">
                    <BookOpenIcon className="size-16 text-white/10" />
                  </div>
                )}

                {/* High-Contrast Gradient Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1f33] via-[#0e1f33]/70 to-black/30 pointer-events-none" />

                {/* Top Row Badges */}
                <div className="absolute top-4 inset-x-4 sm:inset-x-6 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedProgram.categoryLabel && (
                      <span className="inline-flex items-center rounded-md bg-[#0e2238]/90 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                        {selectedProgram.categoryLabel}
                      </span>
                    )}
                    {selectedProgram.badge && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#d4af37] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0e1f33] shadow-xs">
                        {selectedProgram.badge}
                      </span>
                    )}
                  </div>

                  {selectedProgram.rating && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#14233c] shadow-xs backdrop-blur-md">
                      <StarIcon className="size-3 fill-amber-400 text-amber-400" />
                      <span>{selectedProgram.rating}</span>
                      {selectedProgram.reviewsCount && (
                        <span className="text-[10px] text-[#64748b] font-normal">
                          ({selectedProgram.reviewsCount})
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Bottom Headline Over Image */}
                <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-10 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                    {selectedProgram.defaultDuration && (
                      <>
                        <ClockIcon className="size-3 text-[#d4af37]" />
                        <span>{selectedProgram.defaultDuration} Track</span>
                      </>
                    )}
                    {selectedProgram.cohortDate && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-300 font-sans font-semibold">
                          <span className="size-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                          Starts: {selectedProgram.cohortDate}
                          {selectedProgram.seatsLeft != null && ` (${selectedProgram.seatsLeft} seats left)`}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    {selectedProgram.name}
                  </h3>
                </div>
              </div>

              {/* Pricing & Fast-Action Strip directly under billboard */}
              <div className="bg-[#0b1828] text-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10">
                <div>
                  {selectedProgram.formattedPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#f5d77f]">
                        {selectedProgram.formattedPrice}
                      </span>
                      {selectedProgram.formattedOriginalPrice && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through">
                          {selectedProgram.formattedOriginalPrice}
                        </span>
                      )}
                      {selectedProgram.discountPercentage && (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded uppercase">
                          Save {selectedProgram.discountPercentage}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-white">Enrollment Available</span>
                  )}
                  {selectedProgram.summary && (
                    <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                      {selectedProgram.summary}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl bg-[#a07142] hover:bg-[#8e653e] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-md gap-2 cursor-pointer"
                  >
                    <span>Enroll</span>
                    <ArrowRightIcon className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 hover:bg-white/10 text-white px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Interactive Stage Tab Nav: Syllabus / Outcomes / Certificate */}
              <div className="border-b border-[#e5dfd5] bg-[#faf8f5] px-5 sm:px-6 pt-3 flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("syllabus")}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "syllabus"
                      ? "border-[#14233c] text-[#14233c]"
                      : "border-transparent text-[#64748b] hover:text-[#14233c]"
                  }`}
                >
                  <LayersIcon className="size-3.5" />
                  <span>Syllabus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("outcomes")}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "outcomes"
                      ? "border-[#14233c] text-[#14233c]"
                      : "border-transparent text-[#64748b] hover:text-[#14233c]"
                  }`}
                >
                  <FileTextIcon className="size-3.5" />
                  <span>Learning Outcomes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("certificate")}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "certificate"
                      ? "border-[#14233c] text-[#14233c]"
                      : "border-transparent text-[#64748b] hover:text-[#14233c]"
                  }`}
                >
                  <AwardIcon className="size-3.5" />
                  <span>Certificate</span>
                </button>
              </div>

              {/* Stage Body Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-6">
                {activeTab === "syllabus" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8e653e]">
                        CURRICULUM MILESTONES
                      </span>
                    </div>

                    {/* Timeline Phases */}
                    {selectedProgram.structure && selectedProgram.structure.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedProgram.structure.map((item, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-[#ede3d5] bg-[#faf8f5] p-3.5 flex flex-col gap-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10.5px] font-bold text-[#8e653e] uppercase">
                                MILESTONE 0{i + 1}
                              </span>
                              <span className="size-1.5 rounded-full bg-[#8e653e]" />
                            </div>
                            <h4 className="text-xs font-bold text-[#14233c]">{item.title}</h4>
                            {item.detail !== item.title && (
                              <p className="text-[11.5px] text-[#596579] leading-relaxed">
                                {item.detail}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-[#64748b] border border-dashed border-[#d8cdbd] rounded-xl">
                        Milestone details will be provided upon enrollment.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "outcomes" && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8e653e]">
                      KEY COMPETENCIES MASTERED
                    </span>

                    {selectedProgram.learningOutcomes && selectedProgram.learningOutcomes.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {selectedProgram.learningOutcomes.map((outcome, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-[#ede3d5] bg-[#faf8f5] p-3 flex items-center gap-3 text-xs text-[#14233c]"
                          >
                            <CheckCircle2Icon className="size-4 text-[#a07142] shrink-0" />
                            <span className="font-medium text-[#334155]">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-[#64748b] border border-dashed border-[#d8cdbd] rounded-xl">
                        Learning outcomes not specified.
                      </div>
                    )}

                    {selectedProgram.whoItsFor && selectedProgram.whoItsFor.length > 0 && (
                      <div className="mt-2 rounded-xl border border-[#ede3d5] bg-[#fbf9f6] p-3.5 flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold uppercase text-[#14233c]">
                          Target Profile & Prerequisites
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProgram.whoItsFor.map((item, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-white border border-[#e2dcce] px-2 py-0.5 text-[11px] text-[#596579]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "certificate" && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8e653e]">
                      CREDENTIAL PREVIEW
                    </span>

                    {/* Mini Credential Card */}
                    <div className="rounded-xl border-2 border-[#d4af37]/50 bg-[#0e1f33] p-5 text-white shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between border-b border-white/15 pb-3">
                        <div className="flex items-center gap-2">
                          <AwardIcon className="size-5 text-[#d4af37]" />
                          <span className="font-mono text-xs uppercase tracking-widest text-slate-300">
                            THE ICONIC CAREER CERTIFICATE
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                          VERIFIED SECURE
                        </span>
                      </div>

                      <div className="py-4 flex flex-col gap-1">
                        <span className="text-[11px] text-slate-400">Awarded for Successful Completion of:</span>
                        <h4 className="font-heading text-lg font-bold text-white">
                          {selectedProgram.name}
                        </h4>
                        {selectedProgram.certificateNote && (
                          <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
                            {selectedProgram.certificateNote}
                          </p>
                        )}
                      </div>

                      <div className="border-t border-white/15 pt-3 flex items-center justify-between text-xs">
                        <div className="flex flex-col">
                          <span className="text-[9.5px] font-mono text-slate-400">Certificate Verification:</span>
                          <span className="font-mono text-xs font-bold text-[#f5d77f]">
                            QR Code Public Verification
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-300">
                          <QrCodeIcon className="size-5 text-[#d4af37]" />
                          <span className="text-[10.5px]">Includes Public QR Registry</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage Bottom Footer Strip: 3 Quality Assurances */}
                <div className="pt-4 border-t border-[#f0eae1] grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <CheckIcon className="size-3.5 text-[#8e653e] mb-0.5" />
                    <span className="text-[10.5px] font-semibold text-[#14233c]">Structured Milestones</span>
                    <span className="text-[9.5px] text-[#64748b]">Flexible Track</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-[#ede3d5]">
                    <UserCheck2Icon className="size-3.5 text-[#8e653e] mb-0.5" />
                    <span className="text-[10.5px] font-semibold text-[#14233c]">Mentorship</span>
                    <span className="text-[9.5px] text-[#64748b]">Supervisor Review</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <AwardIcon className="size-3.5 text-[#8e653e] mb-0.5" />
                    <span className="text-[10.5px] font-semibold text-[#14233c]">Certificate</span>
                    <span className="text-[9.5px] text-[#64748b]">Public QR Verify</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
