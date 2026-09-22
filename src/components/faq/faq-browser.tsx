import * as React from "react"
import type { FaqItem, FaqCategory } from "@/lib/types"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, XIcon, HelpCircleIcon, FilterIcon, ChevronRightIcon } from "lucide-react"

const CATEGORIES: { label: string; value: FaqCategory | "all" }[] = [
  { label: "All Topics", value: "all" },
  { label: "General", value: "general" },
  { label: "Registration", value: "registration" },
  { label: "Programs", value: "programs" },
  { label: "Internships", value: "internships" },
  { label: "Payments", value: "payments" },
  { label: "Certificates", value: "certificates" },
  { label: "Verification", value: "verification" },
  { label: "Extensions", value: "extensions" },
]

interface FaqBrowserProps {
  initialFaqs: FaqItem[]
}

export function FaqBrowser({ initialFaqs }: FaqBrowserProps) {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState<FaqCategory | "all">("all")

  // Counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: initialFaqs.length }
    CATEGORIES.forEach((cat) => {
      if (cat.value !== "all") {
        counts[cat.value] = initialFaqs.filter(
          (f) => f.category === cat.value
        ).length
      }
    })
    return counts
  }, [initialFaqs])

  const filtered = React.useMemo(() => {
    return initialFaqs.filter((item) => {
      const matchesCategory =
        category === "all" || item.category === category
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)

      return matchesCategory && matchesSearch
    })
  }, [initialFaqs, search, category])

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col gap-8">
      {/* Console Bar: Search & Category Capsules */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e4dccf] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(20,35,60,0.03)]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8e653e]" />
            <Input
              type="text"
              placeholder="Search questions by topic, keyword, or process (e.g. certificate, payment, duration)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 h-11 text-sm bg-[#faf8f5] border-[#e2dcce] rounded-xl text-[#14233c] placeholder:text-[#94a3b8] focus-visible:ring-[#14233c]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e653e] hover:text-[#14233c] transition-colors"
                aria-label="Clear search"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#8e653e] shrink-0">
            <FilterIcon className="size-3.5" />
            <span className="uppercase tracking-wider text-[10px]">Filter Category:</span>
          </div>
        </div>

        {/* Category Pills Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#f0eae1]">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.value] ?? 0
            const isActive = category === cat.value

            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#14233c] text-white shadow-2xs"
                    : "bg-[#f5eee4] text-[#596579] hover:bg-[#ebe3d7] hover:text-[#14233c]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#e5dcd0] text-[#7388a1]"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Meta Bar */}
      <div className="flex items-center justify-between text-xs text-[#64748b] font-mono px-1">
        <span>
          Showing <strong className="text-[#14233c]">{filtered.length}</strong> of {initialFaqs.length} verified questions
        </span>
        {(search || category !== "all") && (
          <button
            onClick={() => {
              setSearch("")
              setCategory("all")
            }}
            className="text-[#a07142] hover:text-[#14233c] hover:underline font-semibold"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Accordion Results */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          <Accordion>
            {filtered.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-2xl border border-[#e4dccf] bg-white px-5 sm:px-6 py-1 mb-3 transition-all hover:border-[#14233c] shadow-[0_2px_12px_rgba(20,35,60,0.02)]"
              >
                <AccordionTrigger className="text-left font-heading text-base sm:text-lg font-bold text-[#14233c] hover:text-[#a07142] py-4">
                  <div className="flex items-center gap-3 pr-2">
                    <span className="inline-flex items-center rounded-md bg-[#f6eee3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8e653e] font-mono shrink-0">
                      {faq.category}
                    </span>
                    <span className="leading-snug">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[#475569] leading-relaxed pl-1 pt-1 pb-4 border-t border-[#f0eae1] mt-1 font-normal">
                  <p className="max-w-3xl">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e4dccf] bg-white p-12 text-center shadow-xs">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#f6eee3] text-[#8e653e] mb-4">
            <HelpCircleIcon className="size-6" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#14233c]">
            No matching questions found
          </h3>
          <p className="text-sm text-[#596579] max-w-md mt-1.5 leading-relaxed font-normal">
            We couldn&apos;t find any questions matching &ldquo;{search}&rdquo;. Try another search keyword or contact our admissions desk.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("")
              setCategory("all")
            }}
            className="mt-5 rounded-lg border-[#14233c] text-[#14233c] hover:bg-[#14233c] hover:text-white text-xs font-semibold"
          >
            Clear Search & Filters
          </Button>
        </div>
      )}
    </section>
  )
}
