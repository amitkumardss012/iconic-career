import * as React from "react"
import type { Internship } from "@/lib/types"
import { InternshipCard } from "@/components/internships/internship-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, XIcon, BriefcaseIcon, FilterIcon, ChevronDownIcon } from "lucide-react"

interface InternshipsCatalogProps {
  initialInternships: Internship[]
  initialSearch?: string
  initialCategory?: string
}

export function InternshipsCatalog({
  initialInternships,
  initialSearch = "",
  initialCategory = "all",
}: InternshipsCatalogProps) {
  const [search, setSearch] = React.useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = React.useState(initialSearch)
  const [category, setCategory] = React.useState<string>(initialCategory || "all")

  React.useEffect(() => {
    if (initialSearch !== undefined) {
      setSearch(initialSearch)
      setDebouncedSearch(initialSearch)
    }
  }, [initialSearch])

  React.useEffect(() => {
    if (initialCategory !== undefined) {
      setCategory(initialCategory || "all")
    }
  }, [initialCategory])

  // Debounce search input to prevent unnecessary re-filtering on rapid keystrokes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 250)

    return () => {
      clearTimeout(timer)
    }
  }, [search])

  // Extract unique categories dynamically from the loaded internships
  const availableCategories = React.useMemo(() => {
    const map = new Map<string, string>()
    initialInternships.forEach((i) => {
      const slug =
        typeof i.category === "object" && i.category !== null
          ? (i.category as any).slug
          : String(i.category || "").trim()
      const label =
        i.categoryLabel ||
        (typeof i.category === "object" && (i.category as any).name) ||
        slug

      if (slug && label) {
        map.set(slug, label)
      }
    })
    return [
      { label: "All Tracks", value: "all" },
      ...Array.from(map.entries()).map(([value, label]) => ({ label, value })),
    ]
  }, [initialInternships])

  const filtered = React.useMemo(() => {
    return initialInternships.filter((intn) => {
      // 1. Category check
      const intnCategorySlug = (
        typeof intn.category === "object" && intn.category !== null
          ? (intn.category as any).slug || (intn.category as any).name
          : String(intn.category || "")
      ).toLowerCase()
      const intnCategoryLabel = (intn.categoryLabel || "").toLowerCase()
      const selectedCat = category.toLowerCase()

      const matchesCategory =
        selectedCat === "all" ||
        intnCategorySlug === selectedCat ||
        intnCategoryLabel === selectedCat

      if (!matchesCategory) return false

      // 2. Search query check
      const q = debouncedSearch.toLowerCase().trim()
      if (!q) return true

      // Tokenize search query by spaces to support multi-keyword queries (e.g., "digital operations", "marketing analytics")
      const searchTerms = q.split(/\s+/).filter(Boolean)
      if (searchTerms.length === 0) return true

      // Construct comprehensive searchable text pool
      const searchableParts: string[] = []
      if (intn.name) searchableParts.push(intn.name)
      if (intn.slug) searchableParts.push(intn.slug.replace(/-/g, " "))
      if (intn.summary) searchableParts.push(intn.summary)
      if (intn.overview) searchableParts.push(intn.overview)
      if (intn.categoryLabel) searchableParts.push(intn.categoryLabel)
      if (intnCategorySlug) searchableParts.push(intnCategorySlug.replace(/-/g, " "))

      if (Array.isArray(intn.eligibility)) {
        searchableParts.push(...intn.eligibility)
      }
      if (Array.isArray(intn.whoItsFor)) {
        searchableParts.push(...intn.whoItsFor)
      }
      if (Array.isArray(intn.learningOutcomes)) {
        searchableParts.push(...intn.learningOutcomes)
      }
      if (Array.isArray(intn.structure)) {
        intn.structure.forEach((s) => {
          if (s.title) searchableParts.push(s.title)
          if (s.detail) searchableParts.push(s.detail)
        })
      }
      if (intn.defaultDuration) searchableParts.push(intn.defaultDuration)
      if (Array.isArray(intn.durationOptions)) {
        searchableParts.push(...intn.durationOptions)
      }
      if (intn.badge) searchableParts.push(intn.badge)

      const fullSearchableText = searchableParts.join(" ").toLowerCase()

      // Every word in the search query must match somewhere in the internship data
      return searchTerms.every((term) => fullSearchableText.includes(term))
    })
  }, [initialInternships, debouncedSearch, category])

  return (
    <section className="container-site py-10 sm:py-14 flex flex-col gap-8">
      {/* Console Bar: Search & Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-[#e4dccf] bg-white p-3.5 sm:p-5 shadow-[0_4px_20px_rgba(20,35,60,0.03)]">
        {/* Search Box */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8e653e]" />
          <Input
            type="text"
            placeholder="Search internship tracks by role, area, or deliverables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10 h-11 text-xs sm:text-sm bg-[#faf8f5] border-[#e2dcce] rounded-xl text-[#14233c] placeholder:text-[#94a3b8] focus-visible:ring-[#14233c]"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("")
                setDebouncedSearch("")
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e653e] hover:text-[#14233c] transition-colors cursor-pointer"
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

      {/* Meta Bar */}
      <div className="flex items-center justify-between text-xs text-[#64748b] font-mono px-1">
        <span>
          Showing <strong className="text-[#14233c]">{filtered.length}</strong> of {initialInternships.length} active internship opportunities
        </span>
        {(search || debouncedSearch || category !== "all") && (
          <button
            onClick={() => {
              setSearch("")
              setDebouncedSearch("")
              setCategory("all")
            }}
            className="text-[#a07142] hover:text-[#14233c] hover:underline font-semibold cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Internships Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((intn) => (
            <InternshipCard key={intn.id} internship={intn} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dccf] bg-white p-12 text-center shadow-xs">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#f6eee3] text-[#8e653e] mb-4">
            <BriefcaseIcon className="size-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#14233c]">
            No internships found
          </h3>
          <p className="text-sm text-[#596579] max-w-md mt-1.5 leading-relaxed font-normal">
            {debouncedSearch
              ? `We couldn't find any internship tracks matching "${debouncedSearch}".`
              : "There are currently no internship programs published in the database."}
          </p>
          {(search || debouncedSearch || category !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("")
                setDebouncedSearch("")
                setCategory("all")
              }}
              className="mt-5 rounded-lg border-[#14233c] text-[#14233c] hover:bg-[#14233c] hover:text-white text-xs font-semibold cursor-pointer"
            >
              Clear Search & Filters
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
