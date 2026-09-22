import * as React from "react"
import type { Program } from "@/lib/types"
import {
  SearchIcon,
  XIcon,
  StarIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  FilterIcon,
  RotateCcwIcon,
  BookOpenIcon,
  ChevronDownIcon,
} from "lucide-react"

interface ProgramsCatalogProps {
  initialPrograms: Program[]
}

export function ProgramsCatalog({ initialPrograms }: ProgramsCatalogProps) {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState<string>("all")

  // Extract unique categories dynamically from the loaded programs
  const availableCategories = React.useMemo(() => {
    const map = new Map<string, string>()
    initialPrograms.forEach((p) => {
      if (p.category && p.categoryLabel) {
        map.set(String(p.category), p.categoryLabel)
      }
    })
    return [
      { label: "All Disciplines", value: "all" },
      ...Array.from(map.entries()).map(([value, label]) => ({ label, value })),
    ]
  }, [initialPrograms])

  const filtered = React.useMemo(() => {
    return initialPrograms.filter((prog) => {
      const matchesCategory =
        category === "all" || String(prog.category) === category
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        prog.name.toLowerCase().includes(q) ||
        prog.summary.toLowerCase().includes(q) ||
        prog.categoryLabel.toLowerCase().includes(q)

      return matchesCategory && matchesSearch
    })
  }, [initialPrograms, search, category])

  const handleReset = () => {
    setSearch("")
    setCategory("all")
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14 flex flex-col gap-8">
      {/* Discovery Terminal: Search Input + Category Dropdown Menu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-[#d6cbba] bg-white p-3 sm:p-4 shadow-sm">
        {/* Search Console */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8e653e]" />
          <input
            type="text"
            placeholder="Search courses by discipline, skills, or curriculum keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 h-11 text-xs sm:text-sm rounded-xl border border-[#e2dcce] bg-[#faf8f5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 transition-all text-[#14233c] placeholder:text-[#94a3b8]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#14233c] cursor-pointer"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown Filter */}
        <div className="relative shrink-0 sm:w-64">
          <FilterIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8e653e] pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-10 pr-9 h-11 text-xs sm:text-sm font-semibold rounded-xl border border-[#e2dcce] bg-[#faf8f5] text-[#14233c] hover:bg-[#f0eae1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 transition-all appearance-none cursor-pointer"
          >
            {availableCategories.map((cat) => (
              <option key={cat.value} value={cat.value} className="text-[#14233c] bg-white font-medium py-1">
                {cat.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8e653e] pointer-events-none" />
        </div>
      </div>

      {/* Results Metadata Bar */}
      <div className="flex items-center justify-between text-xs text-[#64748b] px-1 font-mono">
        <span className="font-semibold text-[#14233c]">
          SHOWING {filtered.length} OF {initialPrograms.length} COURSES
        </span>
        {(search || category !== "all") && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[#8e653e] hover:underline font-bold cursor-pointer"
          >
            <RotateCcwIcon className="size-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Programs Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filtered.map((prog) => {
            return (
              <div
                key={prog.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#e2dcce] bg-white overflow-hidden shadow-[0_2px_16px_rgba(20,35,60,0.04)] hover:shadow-[0_16px_36px_rgba(20,35,60,0.1)] hover:border-[#a07142]/70 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Media Header (~168px Height) */}
                  <div className="relative h-42 sm:h-44 w-full overflow-hidden bg-[#e8e2d9]">
                    {prog.image?.src ? (
                      <img
                        src={prog.image.src}
                        alt={prog.image.alt || prog.name}
                        className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0e1f33] to-[#1a365d] flex items-center justify-center">
                        <BookOpenIcon className="size-12 text-white/10" />
                      </div>
                    )}

                    {/* Dark Cinematic Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1f33]/90 via-[#0e1f33]/30 to-black/30 pointer-events-none" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between">
                      {prog.categoryLabel && (
                        <span className="inline-flex items-center rounded-md bg-[#0e2238]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                          {prog.categoryLabel}
                        </span>
                      )}

                      {prog.rating && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-bold text-[#14233c] shadow-2xs backdrop-blur-md">
                          <StarIcon className="size-3 fill-amber-400 text-amber-400" />
                          <span>{prog.rating}</span>
                          {prog.reviewsCount && (
                            <span className="text-[9.5px] text-[#64748b] font-normal">
                              ({prog.reviewsCount})
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Bottom Duration & Cohort Strip */}
                    <div className="absolute bottom-2.5 inset-x-3 z-10 flex items-center justify-between text-[11px] text-white">
                      {prog.defaultDuration && (
                        <span className="inline-flex items-center gap-1.5 font-medium backdrop-blur-xs bg-black/40 px-2.5 py-0.5 rounded-md border border-white/10">
                          <ClockIcon className="size-3 text-[#d4af37]" />
                          {prog.defaultDuration}
                        </span>
                      )}

                      {prog.cohortDate && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-300">
                          <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                          Starts: {prog.cohortDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col gap-3">
                    <h3 className="font-heading text-[19px] font-bold text-[#14233c] group-hover:text-[#a07142] transition-colors leading-snug line-clamp-1">
                      {prog.name}
                    </h3>

                    {prog.summary && (
                      <p className="text-xs text-[#596579] line-clamp-2 leading-relaxed">
                        {prog.summary}
                      </p>
                    )}

                    {/* Key Skill / Tags Chips */}
                    {prog.tags && prog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {prog.tags.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-md bg-[#faf6f0] border border-[#ede3d5] px-2 py-0.5 text-[10.5px] font-medium text-[#7c5631]"
                          >
                            <CheckCircle2Icon className="size-2.5 text-[#a07142]" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Price & Action Footer */}
                <div className="px-5 py-3.5 border-t border-[#f0eae1] bg-[#fdfbf9] flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    {prog.formattedPrice ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-sans text-[20px] font-extrabold text-[#14233c] leading-none">
                          {prog.formattedPrice}
                        </span>
                        {prog.formattedOriginalPrice && (
                          <span className="text-xs text-[#94a3b8] line-through font-normal">
                            {prog.formattedOriginalPrice}
                          </span>
                        )}
                        {prog.discountPercentage && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-1 py-0.2 rounded">
                            {prog.discountPercentage}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-[#14233c]">
                        Enrollment Open
                      </span>
                    )}
                    {prog.certificateAvailable && (
                      <span className="text-[10px] text-[#8e653e] font-semibold mt-1">
                        Includes Verified Certificate
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs font-semibold text-[#14233c] hover:text-[#a07142] transition-colors hidden sm:inline-block px-1 cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center justify-center rounded-xl bg-[#14233c] hover:bg-[#8e653e] text-white px-3.5 py-2 text-xs font-semibold transition-all shadow-xs gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Enroll</span>
                      <ArrowRightIcon className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border-2 border-dashed border-[#d6cbba] bg-[#faf8f5] p-12 text-center flex flex-col items-center gap-4">
          <div className="size-12 rounded-full bg-[#f5eee3] text-[#8e653e] flex items-center justify-center">
            <FilterIcon className="size-6" />
          </div>
          <div className="max-w-md">
            <h3 className="font-heading text-xl font-bold text-[#14233c]">
              No courses found
            </h3>
            <p className="text-xs text-[#596579] mt-1 leading-relaxed">
              {search
                ? `We couldn't find any courses matching your search "${search}".`
                : "There are currently no courses published in the database."}
            </p>
          </div>
          {(search || category !== "all") && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#14233c] text-white px-4 py-2 text-xs font-semibold hover:bg-[#a07142] transition-colors cursor-pointer"
            >
              <RotateCcwIcon className="size-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
