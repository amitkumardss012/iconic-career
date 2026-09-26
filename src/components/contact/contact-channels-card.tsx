import * as React from "react"
import { Link } from "@tanstack/react-router"
import { siteConfig } from "@/lib/site"
import {
  MailIcon,
  PhoneIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  GlobeIcon,
} from "lucide-react"

export function ContactChannelsCard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Institutional Profile Header Card */}
      <div className="rounded-3xl border border-[#e4dccf] bg-white p-7 sm:p-8 shadow-[0_12px_40px_rgba(20,35,60,0.05)] flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf6ee] border border-[#d4af37]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8e653e] mb-2 font-mono">
            <span>OFFICIAL DESK</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#14233c]">
            Communication Directory
          </h2>
          <p className="text-xs sm:text-sm text-[#596579] mt-1 leading-relaxed">
            Direct coordination channels for candidates, university faculties, and recruiting partners.
          </p>
        </div>

        {/* 4 Communication Channels */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#faf8f5] border border-[#ede7de] transition-colors hover:border-[#14233c]/30">
            <div className="size-9 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 mt-0.5">
              <MailIcon className="size-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] font-mono block">
                Email Inquiries
              </span>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-sm font-semibold text-[#14233c] hover:text-[#a07142] transition-colors mt-0.5 block"
              >
                {siteConfig.email}
              </a>
              <span className="text-[10.5px] text-[#7388a1] mt-0.5 block">
                Documented response within 1 business day
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#faf8f5] border border-[#ede7de] transition-colors hover:border-[#14233c]/30">
            <div className="size-9 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 mt-0.5">
              <PhoneIcon className="size-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] font-mono block">
                Admissions Telephone
              </span>
              <span className="text-sm font-semibold text-[#14233c] mt-0.5 block font-mono">
                {siteConfig.phone}
              </span>
              <span className="text-[10.5px] text-[#7388a1] mt-0.5 block">
                Direct coordinator assistance
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#faf8f5] border border-[#ede7de] transition-colors hover:border-[#14233c]/30">
            <div className="size-9 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 mt-0.5">
              <ClockIcon className="size-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] font-mono block">
                Operating Schedule
              </span>
              <span className="text-sm font-semibold text-[#14233c] mt-0.5 block">
                {siteConfig.hours}
              </span>
              <span className="text-[10.5px] text-[#7388a1] mt-0.5 block">
                Excludes recognized national public holidays
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#faf8f5] border border-[#ede7de] transition-colors hover:border-[#14233c]/30">
            <div className="size-9 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 mt-0.5">
              <MapPinIcon className="size-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] font-mono block">
                Administrative Headquarters
              </span>
              <span className="text-sm font-semibold text-[#14233c] mt-0.5 block">
                {siteConfig.address}
              </span>
              <span className="text-[10.5px] text-[#7388a1] mt-0.5 block">
                By prior appointment for institutional delegates
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#faf8f5] border border-[#ede7de] transition-colors hover:border-[#14233c]/30">
            <div className="size-9 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheckIcon className="size-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] font-mono block">
                Corporate Identification Number (CIN)
              </span>
              <span className="text-sm font-semibold text-[#14233c] mt-0.5 block font-mono">
                {siteConfig.cin}
              </span>
              <span className="text-[10.5px] text-[#7388a1] mt-0.5 block">
                Registered Corporate Entity • Ministry of Corporate Affairs
              </span>
            </div>
          </div>
        </div>

        {/* Social Channels Strip */}
        <div className="pt-4 border-t border-[#ede7de] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider text-[10.5px]">
            Official Channels:
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#faf8f5] border border-[#e2dcce] text-xs font-bold text-[#14233c] hover:bg-[#14233c] hover:text-white transition-all"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#faf8f5] border border-[#e2dcce] text-xs font-bold text-[#14233c] hover:bg-[#14233c] hover:text-white transition-all"
            >
              X (Twitter)
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#faf8f5] border border-[#e2dcce] text-xs font-bold text-[#14233c] hover:bg-[#14233c] hover:text-white transition-all"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Sovereign Verification Bypass Notice */}
      <div className="rounded-2xl border border-[#d4af37]/40 bg-[#fbf6ee] p-5 text-xs text-[#8e653e] flex items-start gap-3.5 shadow-2xs">
        <div className="size-8 rounded-lg bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheckIcon className="size-4" />
        </div>
        <div>
          <span className="font-bold text-[#14233c] text-sm block">
            Verifying an Issued Credential?
          </span>
          <p className="text-xs text-[#596579] mt-0.5 leading-relaxed">
            Employers and academic evaluators do not need to wait for email responses. Use our public registry for real-time certificate authentication.
          </p>
          <Link
            to="/verify"
            className="inline-flex items-center gap-1 font-bold text-[#14233c] hover:text-[#a07142] hover:underline mt-2 text-xs"
          >
            <span>Open Public Verification Console</span>
            <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
