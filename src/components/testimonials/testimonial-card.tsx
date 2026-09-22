import type { Testimonial } from "@/lib/types"
import { QuoteIcon } from "lucide-react"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-card p-6 sm:p-8 relative">
      <QuoteIcon className="size-6 text-brass/40 mb-4 shrink-0" />
      <blockquote className="font-heading text-lg sm:text-xl text-foreground font-normal italic leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-foreground block">
            {testimonial.studentName}
          </span>
          <span className="text-muted-foreground font-mono">
            {testimonial.program}
            {testimonial.institution ? ` • ${testimonial.institution}` : ""}
          </span>
        </div>

        {testimonial.placeholder && (
          <span className="rounded bg-secondary/80 px-2 py-0.5 text-[0.65rem] font-mono text-muted-foreground">
            Consent in review
          </span>
        )}
      </div>
    </div>
  )
}
