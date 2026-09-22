import { createFileRoute, Link } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { getStaticServices } from "@/lib/data/static-content"
import { SectionHeader } from "@/components/common/section-header"
import { buttonVariants } from "@/components/ui/button"
import {
  BriefcaseIcon,
  GraduationCapIcon,
  AwardIcon,
  FileCheckIcon,
  RotateCwIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "lucide-react"

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: createMetaTags({
      title: "Platform Services",
      description:
        "Explore the comprehensive services provided across the student lifecycle: internship programs, career training, documentation, extensions, and verification.",
      path: "/services",
    }),
  }),
  loader: () => {
    const services = getStaticServices()
    return { services }
  },
  component: ServicesPage,
})

const iconMap = {
  "internship-programs": BriefcaseIcon,
  "career-oriented-training": GraduationCapIcon,
  "student-certification": AwardIcon,
  "internship-documentation": FileCheckIcon,
  "internship-extension": RotateCwIcon,
  "certificate-verification": ShieldCheckIcon,
}

function ServicesPage() {
  const { services } = Route.useLoaderData()
  const primaryServices = services.filter((s) => s.emphasis === "primary")
  const secondaryServices = services.filter((s) => s.emphasis === "secondary")

  return (
    <div className="flex flex-col gap-16 md:gap-24 py-10 md:py-16">
      {/* 01. HERO */}
      <section className="container-site">
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center gap-4">
          <span className="eyebrow">COMPREHENSIVE CAPABILITIES</span>
          <h1 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
            Structured Services for the Student Lifecycle
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            From initial track selection to final credential inspection, our platform provides formal services designed to ensure clarity, supervision, and verifiable integrity at every step.
          </p>
        </div>
      </section>

      {/* 02. PRIMARY CORE SERVICES (EDITORIAL SPOTLIGHTS) */}
      <section className="container-site">
        <SectionHeader
          eyebrow="CORE PLATFORM PILLARS"
          title="Primary Program Services"
          description="The essential service offerings that anchor every student enrollment and institutional partnership."
          className="mb-10"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {primaryServices.map((service, idx) => {
            const Icon = iconMap[service.slug as keyof typeof iconMap] || BriefcaseIcon
            const isVerification = service.slug === "certificate-verification"

            return (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-xl border-2 border-primary/20 bg-card p-6 sm:p-8 shadow-xs transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="size-5 text-brass" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-brass">
                      Pillar 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground">
                    {service.name}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.summary}
                  </p>

                  <p className="text-xs text-muted-foreground/90 leading-relaxed border-t border-border/50 pt-3">
                    {service.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Link
                    to={
                      isVerification
                        ? "/verify"
                        : service.slug === "internship-programs"
                        ? "/internships"
                        : "/programs"
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>
                      {isVerification ? "Go to Verification" : "Learn More"}
                    </span>
                    <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 03. SUPPORTING & OPERATIONAL SERVICES */}
      <section className="border-y border-border/80 bg-paper-deep/50 py-16">
        <div className="container-site">
          <SectionHeader
            eyebrow="STUDENT SUCCESS & RECORD KEEPING"
            title="Operational & Extension Services"
            description="The administrative systems and lifecycle support mechanisms that maintain student records and handle time extensions."
            className="mb-10"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {secondaryServices.map((service) => {
              const Icon = iconMap[service.slug as keyof typeof iconMap] || FileCheckIcon

              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between rounded-lg border border-border/80 bg-card p-6"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="size-4 text-brass" />
                      </div>
                      <h4 className="font-heading text-lg font-semibold text-foreground">
                        {service.name}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {service.summary}
                    </p>

                    <div className="rounded bg-paper-deep/80 p-3 text-xs text-muted-foreground leading-relaxed border border-border/40 mt-1">
                      {service.detail}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="font-mono text-[0.65rem] text-muted-foreground uppercase">
                      Documented Service
                    </span>
                    <Link
                      to="/contact"
                      className="font-medium text-primary hover:underline"
                    >
                      Inquire →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 04. INTEGRATION ASSURANCE */}
      <section className="container-site">
        <div className="rounded-xl border border-border/80 bg-card p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-8 flex flex-col gap-3">
              <span className="eyebrow">PLATFORM INTEGRITY</span>
              <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
                Built to Support Future Student & Admin Management
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Every service documented here corresponds to a planned backend capability. As administrative and student portals come online, candidates will track these services directly through their authenticated dashboard.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <Link
                to="/register"
                className={buttonVariants({
                  variant: "default",
                  className: "w-full justify-center text-xs",
                })}
              >
                Register Candidate
              </Link>
              <Link
                to="/contact"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full justify-center text-xs",
                })}
              >
                Institutional Inquiries
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
