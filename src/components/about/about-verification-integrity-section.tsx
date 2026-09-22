import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  SparklesIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  AwardIcon,
  ExternalLinkIcon,
} from "lucide-react"

export function AboutVerificationIntegritySection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28 border-b border-[#ede7de]">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Media Stage: Image with Overlay Badge (6 Cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#d6cbba] bg-[#0e1f33] shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"
                alt="Student writing project notes and verifying deliverables"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1f33]/90 via-[#0e1f33]/30 to-transparent pointer-events-none" />

              {/* Floating Verification Badge */}
              <div className="absolute bottom-6 inset-x-6 z-10 rounded-xl bg-[#0e2238]/95 border border-white/15 p-4 text-white shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f]">
                      <QrCodeIcon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Public Verification Protocol
                      </h4>
                      <span className="text-[11px] text-slate-300">
                        Zero login required for university & HR audits
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Narrative: Verification Standards (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
                <SparklesIcon className="size-3 text-[#d4af37]" />
                <span>CREDENTIAL INTEGRITY</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-normal leading-[1.08] tracking-tight text-[#14233c]">
                A Public Credential Any <br />
                <span className="italic text-[#a07142]">Evaluator Can Independently Trust.</span>
              </h2>

              <p className="text-sm text-[#596579] leading-relaxed mt-3.5">
                In a digital workforce, credentials must withstand scrutiny. We maintain a public certificate verification service accessible to anyone without requiring account creation.
              </p>
              <p className="text-sm text-[#596579] leading-relaxed mt-2.5">
                Whether through our portal search or by scanning the physical QR code on the certificate, universities and recruiters can confirm student identity, program completion dates, and verified hours.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#e2dcce]">
              <div className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                <CheckCircle2Icon className="size-4 text-[#8e653e] shrink-0" />
                <span>Direct optical QR verification linking to immutable registry records</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                <CheckCircle2Icon className="size-4 text-[#8e653e] shrink-0" />
                <span>Non-reusable Certificate ID assigned at supervisor sign-off</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#334155] font-medium">
                <CheckCircle2Icon className="size-4 text-[#8e653e] shrink-0" />
                <span>Accepted by leading universities for degree credit validation</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/verify"
                className="inline-flex items-center gap-2 rounded-xl bg-[#14233c] hover:bg-[#a07142] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-all group"
              >
                <ShieldCheckIcon className="size-4 text-[#f5d77f]" />
                <span>Explore Public Certificate Verification</span>
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
