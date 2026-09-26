import * as React from "react"
import { ShieldCheck, QrCode, CheckCircle2, Award } from "lucide-react"

export interface ProfessionalCertificateData {
  certificateNumber: string
  recipientName: string
  recipientEmail?: string | null
  college: string
  department?: string | null
  degree?: string | null
  programTitle: string
  programType: "COURSE" | "INTERNSHIP"
  durationText: string
  grade?: string | null
  percentage?: number | null
  issueDate: string
  validUntil?: string | null
  mentorName?: string | null
  enrollmentNumber?: string | null
  verificationUrl?: string
}

interface ProfessionalCertificateDocumentProps {
  data: ProfessionalCertificateData
  id?: string
  className?: string
}

/**
 * =====================================================================
 * PROFESSIONAL CERTIFICATE DOCUMENT (STANDALONE MODULAR UI COMPONENT)
 * =====================================================================
 * This component is completely isolated from verification logic.
 * You can modify, re-style, or replace this component's visual design
 * anytime in this single file.
 */
export const ProfessionalCertificateDocument = React.forwardRef<
  HTMLDivElement,
  ProfessionalCertificateDocumentProps
>(({ data, id = "certificate-render-canvas", className = "" }, ref) => {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://theiconiccareer.com"
  const qrVerificationUrl = data.verificationUrl || `${origin}/verify/${data.certificateNumber}`

  return (
    <div
      ref={ref}
      id={id}
      className={`relative mx-auto w-[960px] min-w-[960px] max-w-[960px] h-[679px] min-h-[679px] max-h-[679px] bg-[#fbf9f5] text-[#14233c] select-none shadow-2xl rounded-2xl overflow-hidden shrink-0 print:shadow-none print:rounded-none print:w-full print:max-w-none print:h-full ${className}`}
      style={{
        aspectRatio: "1.414 / 1",
        width: "960px",
        minWidth: "960px",
        maxWidth: "960px",
        height: "679px",
        minHeight: "679px",
        maxHeight: "679px",
      }}
    >
      {/* Outer Luxury Guilloché / Ornamental Border */}
      <div className="absolute inset-4 rounded-xl border-[3px] border-[#a07142] p-1.5 pointer-events-none">
        <div className="h-full w-full rounded-lg border border-[#a07142]/40 border-dashed" />
      </div>

      {/* 4 Corner Vintage Filigree Accents */}
      <div className="absolute top-4 left-4 size-8 border-t-[3px] border-l-[3px] border-[#a07142] pointer-events-none" />
      <div className="absolute top-4 right-4 size-8 border-t-[3px] border-r-[3px] border-[#a07142] pointer-events-none" />
      <div className="absolute bottom-4 left-4 size-8 border-b-[3px] border-l-[3px] border-[#a07142] pointer-events-none" />
      <div className="absolute bottom-4 right-4 size-8 border-b-[3px] border-r-[3px] border-[#a07142] pointer-events-none" />

      {/* Subtle Background Watermark Crest */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none"
        aria-hidden="true"
      >
        <img
          src="/logo/logo.png"
          alt=""
          className="size-96 object-contain"
        />
      </div>

      {/* Inner Certificate Content Container */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between p-12 text-center">
        {/* ======================================================== */}
        {/* 1. HEADER: BRANDING & CREDENTIAL TITLE */}
        {/* ======================================================== */}
        <div>
          {/* Organization Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <img
              src="/logo/logo.png"
              alt="The Iconic Career"
              className="size-8 rounded-full object-contain shrink-0"
            />
            <span className="font-heading text-xl font-bold tracking-tight text-[#14233c] uppercase">
              The Iconic Career
            </span>
          </div>

          <div className="text-[10px] font-mono tracking-[0.28em] text-[#a07142] uppercase font-semibold">
            Centre for Professional Excellence & Industry Internships • CIN: U85306BR2026PTC088381
          </div>

          {/* Certificate Main Title */}
          <div className="mt-3">
            <h1 className="font-heading text-4xl font-normal tracking-tight text-[#14233c]">
              {data.programType === "INTERNSHIP"
                ? "Certificate of Internship Completion"
                : "Certificate of Course Completion"}
            </h1>
            <div className="mx-auto mt-2 h-0.5 w-32 bg-gradient-to-r from-transparent via-[#a07142] to-transparent" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. RECIPIENT BODY & NARRATIVE */}
        {/* ======================================================== */}
        <div className="my-auto py-2 space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#64748b]">
            This is proudly presented to
          </p>

          {/* Candidate Name in Calligraphic / Serif Display */}
          <div className="inline-block relative">
            <h2 className="font-heading text-4xl font-medium text-[#14233c] tracking-tight px-6 pb-1">
              {data.recipientName}
            </h2>
            <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#a07142] to-transparent" />
          </div>

          {/* Academic Affiliation */}
          {data.college && (
            <p className="text-sm text-[#475569] font-medium max-w-lg mx-auto leading-snug">
              of <span className="text-[#14233c] font-semibold">{data.college}</span>
              {data.department ? ` (${data.department})` : ""}
            </p>
          )}

          {/* Completion Description */}
          <p className="text-[13px] text-[#556477] max-w-2xl mx-auto leading-relaxed font-light px-4">
            for successfully fulfilling all rigorous curriculum requirements, practical assignments, and supervised
            project milestones in{" "}
            <span className="font-semibold text-[#14233c] font-heading underline decoration-[#a07142]/40 underline-offset-4">
              {data.programTitle}
            </span>{" "}
            over a structured tenure of{" "}
            <span className="font-semibold text-[#14233c] font-mono">{data.durationText}</span>.
          </p>

          {/* Academic Distinction Badge (if grade/percentage exists) */}
          {(data.grade || data.percentage !== null) && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-[#faf8f5] px-4 py-1 shadow-2xs">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span className="text-[11px] font-mono font-bold text-[#14233c]">
                Standing:{" "}
                <span className="text-[#a07142]">
                  {data.grade ? `Grade ${data.grade}` : ""}
                  {data.grade && data.percentage ? " • " : ""}
                  {data.percentage ? `${data.percentage}% Aggregate` : ""}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. FOOTER: VERIFICATION QR, METRICS & SIGNATURES */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-[#e8dfd1]/80">
          <div className="grid grid-cols-3 items-end gap-4 text-left">
            {/* Left: Verification Seal & QR Code */}
            <div className="flex items-center gap-3">
              <div className="size-16 rounded-xl bg-white p-1 border border-[#e2dcce] shadow-xs flex items-center justify-center shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    qrVerificationUrl
                  )}`}
                  alt="QR Code"
                  className="size-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="flex flex-col text-left space-y-0.5">
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  <ShieldCheck className="size-3" />
                  <span>Verifiable</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#14233c]">
                  {data.certificateNumber}
                </span>
                <span className="text-[9px] text-[#64748b] font-mono truncate max-w-[180px]">
                  Issued: {data.issueDate}
                </span>
              </div>
            </div>

            {/* Center: Official Embossed Gold Seal */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="size-16 rounded-full border-2 border-[#a07142] bg-gradient-to-tr from-[#f3e7d3] via-[#fdfbf7] to-[#ebd9be] flex flex-col items-center justify-center shadow-md p-1">
                <Award className="size-6 text-[#a07142]" />
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#14233c] mt-0.5">
                  Official
                </span>
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-[#a07142] font-semibold mt-1">
                Verified Seal
              </span>
            </div>

            {/* Right: Academic Signatures */}
            <div className="flex flex-col items-end text-right">
              <div className="w-44 text-center">
                {/* Script Font / Signature Representation */}
                <div className="font-heading italic text-xl text-[#14233c] tracking-wide border-b border-[#14233c]/40 pb-0.5 font-serif">
                  A. R. Mitchell
                </div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#14233c] block mt-1 tracking-wider">
                  Director of Academic Programs
                </span>
                <span className="text-[8px] text-[#64748b] font-mono block">
                  The Iconic Career Board
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

ProfessionalCertificateDocument.displayName = "ProfessionalCertificateDocument"
