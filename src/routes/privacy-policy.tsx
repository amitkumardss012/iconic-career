import { createFileRoute } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { privacySections } from "@/lib/data/legal"
import { siteConfig } from "@/lib/site"

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: createMetaTags({
      title: "Privacy Policy",
      description:
        "Review our privacy practices regarding candidate registration, academic records, and certificate verification.",
      path: "/privacy-policy",
    }),
  }),
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <div className="container-site py-12 md:py-16 max-w-4xl mx-auto">
      <div className="border-b border-border/60 pb-6 mb-8">
        <span className="eyebrow">LEGAL DOCUMENTATION</span>
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground mt-2">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-mono">
          Last Updated: March 2026 • {siteConfig.name} • CIN: {siteConfig.cin}
        </p>
      </div>

      <div className="flex flex-col gap-8 divide-y divide-border/60 text-sm leading-relaxed">
        {privacySections.map((sec, idx) => (
          <div key={sec.title} className="pt-6 first:pt-0 flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {idx + 1}. {sec.title}
            </h2>
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
