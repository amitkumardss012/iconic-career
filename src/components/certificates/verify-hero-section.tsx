import React from "react"
import { ShieldCheckIcon, LockIcon, EyeOffIcon, AwardIcon } from "lucide-react"
import { VerificationForm } from "@/components/certificates/verification-form"

interface VerifyHeroSectionProps {
  initialId?: string
  autoVerify?: boolean
}

export function VerifyHeroSection({
  initialId = "",
  autoVerify = false,
}: VerifyHeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#e8dfd1]">
      {/* Background Architectural Dot Grid & Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: "radial-gradient(#c5b8a5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-br from-[#a07142]/10 via-[#c5a880]/5 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        {/* Header Capsule & Display Headline */}
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
          {/* Illuminated Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur-md mb-6">
            <ShieldCheckIcon className="size-3.5 text-[#a07142]" />
            <span className="text-[11px] font-mono tracking-widest text-[#14233c] font-semibold uppercase">
              Public Credential Registry • Cryptographic Audit Console
            </span>
          </div>

          {/* Two-Tone Serif Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#14233c] leading-[1.12]">
            Verify a Certificate.
            <br />
            <span className="italic text-[#a07142] font-normal">
              Instant Authenticity & Proof of Completion.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#556477] leading-relaxed max-w-2xl font-light">
            Confirm the active standing, supervised duration, and documented completion of any official student credential issued by The Iconic Career via unique ID or QR code.
          </p>

          {/* 4 Trust & Assurance Capsules */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-[#e8dfd1] bg-white/80 px-3 py-2 text-xs font-medium text-[#14233c] shadow-xs">
              <ShieldCheckIcon className="size-3.5 text-[#a07142] shrink-0" />
              <span>Public Ledger</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-[#e8dfd1] bg-white/80 px-3 py-2 text-xs font-medium text-[#14233c] shadow-xs">
              <LockIcon className="size-3.5 text-[#a07142] shrink-0" />
              <span>Tamper-Evident</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-[#e8dfd1] bg-white/80 px-3 py-2 text-xs font-medium text-[#14233c] shadow-xs">
              <EyeOffIcon className="size-3.5 text-[#a07142] shrink-0" />
              <span>Privacy Preserved</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-[#e8dfd1] bg-white/80 px-3 py-2 text-xs font-medium text-[#14233c] shadow-xs">
              <AwardIcon className="size-3.5 text-[#a07142] shrink-0" />
              <span>Employer Audit-Ready</span>
            </div>
          </div>
        </div>

        {/* Verification Terminal Core */}
        <div className="mx-auto max-w-2xl mt-10 md:mt-12">
          <VerificationForm initialId={initialId} autoVerify={autoVerify} />
        </div>
      </div>
    </section>
  )
}
