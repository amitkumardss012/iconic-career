import { Link } from "@tanstack/react-router"
import type { Program } from "@/lib/types"
import { buttonVariants } from "@/components/ui/button"
import { ClockIcon, AwardIcon, BriefcaseIcon, ArrowRightIcon } from "lucide-react"

interface ProgramCardProps {
  program: Program
  featured?: boolean
}

export function ProgramCard({ program, featured = false }: ProgramCardProps) {
  return (
    <div
      className={`group flex flex-col justify-between rounded-lg border border-border/80 bg-card overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm ${
        featured ? "ring-1 ring-primary/20" : ""
      }`}
    >
      <div>
        {/* Card Header & Media */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={program.image.src}
            alt={program.image.alt}
            className="object-cover image-editorial transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-sm bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-xs border border-border/60">
              {program.categoryLabel}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3.5 text-brass" />
              {program.durationOptions.join(" • ")}
            </span>
            {program.certificateAvailable && (
              <span className="flex items-center gap-1">
                <AwardIcon className="size-3.5 text-brass" />
                Certificate
              </span>
            )}
          </div>

          <h3 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            <Link to="/programs/$slug" params={{ slug: program.slug }}>
              {program.name}
            </Link>
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {program.summary}
          </p>

          {/* Internship Pair Banner */}
          {program.internshipAvailable && (
            <div className="mt-1 flex items-start gap-2 rounded-md bg-secondary/60 p-2.5 text-xs text-secondary-foreground border border-border/40">
              <BriefcaseIcon className="size-3.5 text-brass shrink-0 mt-0.5" />
              <p className="line-clamp-2 leading-relaxed">
                Includes linked internship track with verified completion file.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 sm:p-6 pt-0 border-t border-border/40 mt-4 flex items-center justify-between gap-3">
        <Link
          to="/programs/$slug" params={{ slug: program.slug }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View Program Details
          <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          to="/register"
          className={buttonVariants({
            variant: "outline",
            size: "xs",
            className: "text-xs font-medium",
          })}
        >
          Enroll Now
        </Link>
      </div>
    </div>
  )
}
