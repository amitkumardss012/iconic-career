import React from "react"
import { FileSearchIcon, QrCodeIcon, ShieldCheckIcon, SmartphoneIcon, LaptopIcon, CheckCircle2Icon } from "lucide-react"

export function VerifyDualMethodsSection() {
  return (
    <section className="py-16 md:py-24 border-b border-[#e8dfd1] bg-white relative">
      <div className="container-site">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-[#faf8f5] px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] mb-3">
            <ShieldCheckIcon className="size-3.5 text-[#a07142]" />
            <span>Audit Architecture</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c]">
            Two Seamless Pathways for <br />
            <span className="italic text-[#a07142]">Instant Credential Validation</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#556477] leading-relaxed">
            Engineered for corporate hiring panels, university review boards, and prospective employers seeking immediate, zero-friction proof of program completion.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Method 01: Certificate ID Query */}
          <div className="rounded-2xl border border-[#e8dfd1] bg-[#faf8f5] p-6 sm:p-10 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-4 right-6 font-mono text-4xl font-bold text-[#e8dfd1] pointer-events-none select-none group-hover:text-[#d8cbb8] transition-colors">
              01
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white border border-[#e8dfd1] text-[#a07142] shadow-xs">
                  <FileSearchIcon className="size-6 text-[#a07142]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#a07142] font-semibold block">
                    Alphanumeric Registry Lookup
                  </span>
                  <h3 className="font-heading text-xl font-medium text-[#14233c]">
                    Method 1: Certificate ID Query
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#556477] leading-relaxed mb-6">
                Every issued certificate features a permanent serial code printed directly on the lower margin. Simply enter the identifier into our public terminal to retrieve the immutable record.
              </p>

              <div className="rounded-xl border border-[#e8dfd1] bg-white p-4 mb-6 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-mono text-[#64748b] mb-1.5">
                  <span>Sample Serial Format</span>
                  <span className="text-emerald-700 font-semibold">Active Example</span>
                </div>
                <div className="font-mono text-base font-bold text-[#14233c] tracking-wider bg-[#faf8f5] p-2.5 rounded border border-[#e8dfd1]">
                  IC-2026-8821
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#556477]">
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-3.5 text-[#a07142] shrink-0" />
                  <span>Zero user login or sign-up required for public inquiries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-3.5 text-[#a07142] shrink-0" />
                  <span>Instant retrieval of student name, program track, and completion date</span>
                </li>
                <li className="flex items-center gap-2">
                  <LaptopIcon className="size-3.5 text-[#a07142] shrink-0" />
                  <span>Optimized for recruiter desktop review and background checking</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Method 02: Real-Time QR Scan */}
          <div className="rounded-2xl border border-[#e8dfd1] bg-[#faf8f5] p-6 sm:p-10 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-4 right-6 font-mono text-4xl font-bold text-[#e8dfd1] pointer-events-none select-none group-hover:text-[#d8cbb8] transition-colors">
              02
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white border border-[#e8dfd1] text-[#a07142] shadow-xs">
                  <QrCodeIcon className="size-6 text-[#a07142]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#a07142] font-semibold block">
                    Direct Mobile Deep-Link
                  </span>
                  <h3 className="font-heading text-xl font-medium text-[#14233c]">
                    Method 2: Direct QR Scan
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#556477] leading-relaxed mb-6">
                Scan the cryptographic security QR code on either the digital PDF or printed parchment document using any modern smartphone camera to automatically load the verified ledger state.
              </p>

              <div className="rounded-xl border border-[#e8dfd1] bg-white p-4 mb-6 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-mono text-[#64748b] mb-1.5">
                  <span>Cryptographic URL Target</span>
                  <span className="text-emerald-700 font-semibold">SSL Secured</span>
                </div>
                <div className="font-mono text-xs font-medium text-[#14233c] tracking-tight bg-[#faf8f5] p-2.5 rounded border border-[#e8dfd1] truncate">
                  theiconiccareer.com/verify/IC-2026-8821
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-[#556477]">
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-3.5 text-[#a07142] shrink-0" />
                  <span>Works with native iOS & Android camera applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-3.5 text-[#a07142] shrink-0" />
                  <span>Direct auto-query without having to copy-paste serial strings</span>
                </li>
                <li className="flex items-center gap-2">
                  <SmartphoneIcon className="size-3.5 text-[#a07142] shrink-0" />
                  <span>Ideal for on-site hiring events and interviewer device checks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
