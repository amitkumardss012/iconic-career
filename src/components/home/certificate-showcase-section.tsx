import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  AwardIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  SparklesIcon,
  CheckCircle2Icon,
  FileCheckIcon,
  ExternalLinkIcon,
  LockIcon,
  CheckIcon,
} from "lucide-react"
import { CertificatePreview } from "@/components/certificates/certificate-preview"

const securityFeatures = [
  {
    title: "Tamper-Evident QR Code",
    detail: "Instant optical verification routing to the secure public registry verification page.",
  },
  {
    title: "Immutable Registry ID",
    detail: "Every certificate receives a permanent, non-reusable alphanumeric identifier.",
  },
  {
    title: "Documented Supervision Record",
    detail: "Confirms real duration, curriculum completion, and supervisor evaluations.",
  },
  {
    title: "Institutional Acceptance",
    detail: "Structured for university credit validation and employer background checks.",
  },
]

export function CertificateShowcaseSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0a1526] text-white py-16 sm:py-20 lg:py-28 border-y border-white/10">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial from-[#d4af37]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10 sm:gap-14">
        {/* Section Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/15">
          <div className="max-w-2xl">
            {/* Illuminated Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0e2238] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f5d77f] shadow-2xs mb-4">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>SOVEREIGN CREDENTIAL STANDARDS</span>
              <span className="h-2 w-px bg-white/20" />
              <span className="text-[10px] text-slate-300 tracking-normal font-medium">
                Built for Independent Inspection
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.08] tracking-tight text-white">
              Verifiable Credentials. <br />
              <span className="italic text-[#f5d77f]">Documented Real Experience.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mt-3.5 font-normal">
              Every certificate carries an immutable public identifier and tamper-evident cryptographic metadata so employers and academic institutions can independently verify fulfillment.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="text-right hidden lg:block">
              <div className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-[#7388a1]">
                IMMUTABLE RECORD • QR AUTHENTICATED • PUBLIC LEDGER
              </div>
            </div>

            <Link
              to="/verify"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] hover:bg-[#c59b63] text-[#0a1526] font-bold px-5 py-2.5 text-xs sm:text-sm transition-all shadow-md group"
            >
              <span>Test Public Verification Tool</span>
              <ExternalLinkIcon className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Certificate Display Stage + Security Specification Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Stage: Realistic Certificate Preview on Pedestal (7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div className="rounded-2xl border-2 border-[#d4af37]/40 bg-[#0e1f33] p-3 sm:p-5 shadow-2xl relative">
              {/* Corner Security Accents */}
              <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-[#d4af37]" />
              <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-[#d4af37]" />
              <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-[#d4af37]" />
              <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-[#d4af37]" />

              {/* Certificate Inner Preview */}
              <CertificatePreview isInteractive />
            </div>

            {/* Interactive Inspection Callout Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[#f5d77f] font-mono text-[11px]">
                <QrCodeIcon className="size-4" />
                Live QR Code: Routes directly to verification API
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                SAMPLE RECORD: IC-2026-8821
              </span>
            </div>
          </div>

          {/* Right Column: Institutional Security Architecture (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-[#f5d77f] uppercase">
                SECURITY ARCHITECTURE
              </span>
              <h3 className="font-heading text-2xl font-bold text-white">
                Why Employers & Universities Trust Our Certificates
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlike generic course certificates generated on completion of video quizzes, The Iconic Career documents recorded participation, duration, and supervisor deliverables.
              </p>
            </div>

            {/* 4 Security Pillars */}
            <div className="flex flex-col gap-3">
              {securityFeatures.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3.5 hover:border-[#d4af37]/50 transition-colors"
                >
                  <div className="size-7 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] shrink-0 mt-0.5">
                    <CheckIcon className="size-4 stroke-[3]" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Verification Prompt */}
            <div className="rounded-xl bg-[#0e2238] border border-white/15 p-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <LockIcon className="size-4 text-[#d4af37] shrink-0" />
                <span>Zero login needed for recruiters to verify.</span>
              </div>
              <Link
                to="/verify"
                className="font-bold text-[#f5d77f] hover:underline shrink-0"
              >
                Try Search →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
