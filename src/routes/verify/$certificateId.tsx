import { createFileRoute, Link } from "@tanstack/react-router"
import { createMetaTags } from "@/lib/seo"
import { VerificationForm } from "@/components/certificates/verification-form"
import { ArrowLeftIcon, ShieldCheckIcon, QrCodeIcon, LockIcon } from "lucide-react"

export const Route = createFileRoute("/verify/$certificateId")({
  loader: ({ params }) => {
    const decodedId = decodeURIComponent(params.certificateId).toUpperCase()
    return { decodedId }
  },
  head: ({ params }) => {
    const normalized = decodeURIComponent(params.certificateId).toUpperCase()
    return {
      meta: createMetaTags({
        title: `Credential Verification — ${normalized}`,
        description: `Public verification status record and completion details for certificate ${normalized}.`,
        path: `/verify/${normalized}`,
      }),
    }
  },
  component: VerifyCertificatePage,
})

function VerifyCertificatePage() {
  const data = Route.useLoaderData()
  const { decodedId } = data as { decodedId: string }

  return (
    <div className="relative min-h-screen bg-[#faf8f5] py-12 md:py-20">
      {/* Background Dot Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#c5b8a5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="container-site relative z-10 max-w-4xl mx-auto flex flex-col gap-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/verify"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#64748b] hover:text-[#14233c] mb-6 px-3 py-1.5 rounded-lg border border-[#e8dfd1] bg-white/80 transition-colors"
          >
            <ArrowLeftIcon className="size-3 text-[#a07142]" />
            <span>Return to Public Registry Search</span>
          </Link>

          {/* Eyebrow & Status Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-white border border-[#d8cbb8]">
              <QrCodeIcon className="size-3.5 text-[#a07142]" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#a07142] font-semibold">
              Direct Cryptographic Query • QR Scan Resolved
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c] tracking-tight">
            Credential Record: <span className="font-mono text-[#a07142] font-semibold">{decodedId}</span>
          </h1>

          <p className="mt-2 text-sm text-[#556477] leading-relaxed">
            Reviewing verified completion standing, supervised track, and date of issuance retrieved directly from the public registry.
          </p>
        </div>

        {/* Auto-Triggered Verification Form */}
        <VerificationForm initialId={decodedId} autoVerify={true} />

        {/* Audit Disclaimer Footer */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#e8dfd1] bg-white/80 text-xs text-[#64748b]">
          <div className="flex items-center gap-2 font-mono">
            <LockIcon className="size-3.5 text-[#a07142]" />
            <span>Immutable Ledger Record</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#556477]">
            <ShieldCheckIcon className="size-3 text-emerald-600" />
            <span>Audited by The Iconic Career</span>
          </div>
        </div>
      </div>
    </div>
  )
}
