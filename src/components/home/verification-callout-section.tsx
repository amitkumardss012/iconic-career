import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  ShieldCheckIcon,
  SearchIcon,
  CheckCircle2Icon,
  SparklesIcon,
  FileCheckIcon,
  ArrowRightIcon,
  KeyRoundIcon,
} from "lucide-react"
import { VerificationForm } from "@/components/certificates/verification-form"

export function VerificationCalloutSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-24 border-b border-[#ede7de]">
      {/* Mesh Grid */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Explanatory Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs max-w-fit">
              <SparklesIcon className="size-3 text-[#d4af37]" />
              <span>PUBLIC REGISTRY LOOKUP</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#14233c] leading-[1.12]">
              Instant Verification. <br />
              <span className="italic text-[#a07142]">No Login Required.</span>
            </h2>

            <p className="text-sm text-[#596579] leading-relaxed">
              Third parties, HR departments, and university registrars can authenticate any issued document directly on our ledger using the printed Certificate ID or optical QR link.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                <CheckCircle2Icon className="size-4 text-[#8e653e] shrink-0" />
                <span>Authenticates student identity, program track, and recorded dates</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                <CheckCircle2Icon className="size-4 text-[#8e653e] shrink-0" />
                <span>Immediate validation without delays or administrative emails</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                <CheckCircle2Icon className="size-4 text-[#8e653e] shrink-0" />
                <span>Secured by tamper-evident registry checksums</span>
              </div>
            </div>
          </div>

          {/* Right Console: Verification Form Card (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-[#d6cbba] bg-white p-6 sm:p-8 shadow-[0_12px_36px_rgba(20,35,60,0.06)] flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#f0eae1] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[#0e1f33] text-[#d4af37] flex items-center justify-center">
                  <KeyRoundIcon className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#14233c]">
                    Official Credential Search
                  </h4>
                  <span className="text-[11px] text-[#64748b]">Enter the ID printed on the document</span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                LEDGER ONLINE
              </span>
            </div>

            {/* Embedded Live Verification Form */}
            <VerificationForm />

            {/* Quick-Fill Sample Banner */}
            <div className="pt-2 border-t border-[#f0eae1] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748b]">
              <span className="text-[11px] font-medium">Try our sample credential ID:</span>
              <code className="rounded bg-[#f5eee3] px-2 py-0.5 font-mono text-[11px] font-bold text-[#8e653e] select-all">
                IC-2026-8821
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
