import * as React from "react"
import type { Internship } from "@/lib/types"
import {
  ClockIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  StarIcon,
  BriefcaseIcon,
} from "lucide-react"

interface InternshipCardProps {
  internship: Internship
}

export function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#e4dccf] bg-white transition-all duration-300 hover:border-[#14233c] hover:shadow-[0_12px_32px_rgba(20,35,60,0.09)] hover:-translate-y-1 overflow-hidden">
      <div>
        {/* Header Image */}
        <div className="relative h-44 w-full overflow-hidden bg-[#14233c]">
          {internship.image?.src ? (
            <img
              src={internship.image.src}
              alt={internship.image.alt || internship.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#14233c] to-[#1e3a5f]">
              <BriefcaseIcon className="size-12 text-white/20" />
            </div>
          )}
          {/* Subtle Dark Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1726]/90 via-[#0e1726]/30 to-transparent" />

          {/* Top Metadata Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {internship.categoryLabel ? (
              <span className="inline-flex items-center rounded-md bg-[#14233c]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d4af37] backdrop-blur-md border border-[#d4af37]/30 shadow-xs">
                {internship.categoryLabel}
              </span>
            ) : <div />}

            {internship.badge && (
              <span className="inline-flex items-center rounded-md bg-[#d4af37] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#14233c] shadow-xs">
                {internship.badge}
              </span>
            )}
          </div>

          {/* Bottom Overlay Info inside Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-[11px] font-mono">
            {internship.defaultDuration && (
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                <ClockIcon className="size-3 text-[#d4af37]" />
                <span>{internship.defaultDuration}</span>
              </div>
            )}

            {internship.rating && (
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 text-[#d4af37]">
                <StarIcon className="size-3 fill-[#d4af37]" />
                <span className="font-sans font-bold text-white text-[10.5px]">{internship.rating}</span>
                {internship.reviewsCount && (
                  <span className="text-white/60 text-[9.5px]">({internship.reviewsCount})</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="font-heading text-lg font-bold text-[#14233c] group-hover:text-[#a07142] transition-colors line-clamp-1 leading-snug">
            {internship.name}
          </h3>

          {internship.summary && (
            <p className="text-xs text-[#596579] line-clamp-2 leading-relaxed">
              {internship.summary}
            </p>
          )}

          {/* Structured Deliverable Chips */}
          {internship.structure && internship.structure.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {internship.structure.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[11.5px] text-[#334155]">
                  <CheckCircle2Icon className="size-3.5 text-[#a07142] shrink-0" />
                  <span className="truncate">{item.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Pricing Callout */}
          {internship.formattedPrice && (
            <div className="mt-2 pt-3 border-t border-[#ede7de] flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-[#14233c] tracking-tight font-sans">
                    {internship.formattedPrice}
                  </span>
                  {internship.formattedOriginalPrice && (
                    <span className="text-xs text-[#94a3b8] line-through font-mono">
                      {internship.formattedOriginalPrice}
                    </span>
                  )}
                  {internship.discountPercentage && (
                    <span className="inline-flex items-center rounded-md bg-[#f6eee3] px-1.5 py-0.5 text-[9.5px] font-bold text-[#8e653e] border border-[#d4af37]/30">
                      {internship.discountPercentage}
                    </span>
                  )}
                </div>
                {internship.certificateAvailable && (
                  <p className="text-[10px] text-[#64748b] mt-0.5">
                    Includes Verifiable QR Credential
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions (No redirect) */}
      <div className="p-4 pt-3 bg-[#faf8f5] border-t border-[#ede7de] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#14233c] hover:text-[#a07142] transition-colors cursor-pointer"
        >
          <span>Role Details</span>
          <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
        </button>

        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center justify-center rounded-lg bg-[#14233c] hover:bg-[#a07142] text-white px-3.5 py-2 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}
