import { Link } from "@tanstack/react-router"
import { siteConfig } from "@/lib/site"
import { ShieldCheckIcon, QrCodeIcon, AwardIcon } from "lucide-react"

interface CertificatePreviewProps {
  studentName?: string
  programName?: string
  internshipName?: string
  duration?: string
  startDate?: string
  endDate?: string
  certificateId?: string
  issueDate?: string
  isInteractive?: boolean
}

export function CertificatePreview({
  studentName = "Aarav Sharma",
  programName = "Digital Practice",
  internshipName = "Digital Practice Internship",
  duration = "8 Weeks",
  startDate = "January 19, 2026",
  endDate = "March 13, 2026",
  certificateId = "IC-2026-8821",
  issueDate = "March 15, 2026",
  isInteractive = true,
}: CertificatePreviewProps) {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Physical Parchment Canvas with Subtle Ambient Shadow */}
      <div className="relative rounded-2xl border border-[#d8cbb8] bg-[#fcfbf9] p-6 sm:p-12 shadow-xl shadow-[#14233c]/5 transition-all">
        {/* Ornate Outer Gold Foil Border */}
        <div className="relative rounded-xl border-2 border-[#a07142]/40 bg-white/60 p-6 sm:p-10 shadow-inner">
          {/* Corner Filigree Ornaments */}
          <div className="absolute top-2 left-2 size-4 border-t-2 border-l-2 border-[#a07142]" />
          <div className="absolute top-2 right-2 size-4 border-t-2 border-r-2 border-[#a07142]" />
          <div className="absolute bottom-2 left-2 size-4 border-b-2 border-l-2 border-[#a07142]" />
          <div className="absolute bottom-2 right-2 size-4 border-b-2 border-r-2 border-[#a07142]" />

          {/* Certificate Header with Crest */}
          <div className="flex flex-col items-center text-center border-b border-[#e8dfd1] pb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#14233c] text-white shadow-xs">
                <AwardIcon className="size-5 text-[#c5a880]" />
              </div>
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#14233c]">
                {siteConfig.name}
              </span>
            </div>

            <span className="text-[10px] font-mono tracking-[0.25em] text-[#a07142] font-semibold uppercase">
              Official Credential Registry & Board of Evaluation
            </span>

            <h4 className="font-heading text-xl sm:text-3xl font-normal text-[#14233c] mt-3">
              Certificate of Completion
            </h4>
          </div>

          {/* Certificate Body */}
          <div className="py-8 sm:py-10 flex flex-col items-center text-center gap-3">
            <p className="text-xs uppercase tracking-widest text-[#64748b] font-mono">
              This is to certify that
            </p>

            <div className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c] border-b-2 border-[#a07142]/40 px-8 pb-1.5 min-w-[280px]">
              {studentName}
            </div>

            <p className="text-xs sm:text-sm text-[#556477] max-w-xl leading-relaxed mt-2 font-light">
              has satisfactorily completed all rigorous practical assignments, mentor-supervised code deliverables, and project milestones prescribed for the{" "}
              <span className="font-semibold text-[#14233c] font-heading">{internshipName}</span>, conducted under the curriculum oversight of{" "}
              <span className="font-semibold text-[#14233c] font-heading">{programName}</span>.
            </p>
          </div>

          {/* Certificate Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-[#e8dfd1] py-4 text-xs bg-[#faf8f5]/60 rounded-lg px-4">
            <div>
              <span className="text-[10px] uppercase text-[#64748b] font-mono block">
                Internship Period
              </span>
              <span className="font-medium text-[#14233c] text-xs block mt-1">
                {startDate} – {endDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#64748b] font-mono block">
                Duration
              </span>
              <span className="font-medium text-[#14233c] text-xs block mt-1">
                {duration}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#64748b] font-mono block">
                Certificate ID
              </span>
              <span className="font-mono font-bold text-[#a07142] text-xs block mt-1">
                {certificateId}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#64748b] font-mono block">
                Issuance Date
              </span>
              <span className="font-medium text-[#14233c] text-xs block mt-1">
                {issueDate}
              </span>
            </div>
          </div>

          {/* Signatures & Scannable QR Footnote */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            {/* QR Verification Seal */}
            <div className="flex items-center gap-3 rounded-xl border border-[#e8dfd1] bg-white p-3 shadow-2xs">
              <div className="size-12 bg-[#faf8f5] rounded-lg border border-[#e8dfd1] flex items-center justify-center text-[#14233c] shrink-0">
                <QrCodeIcon className="size-7 text-[#14233c]" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-[#14233c]">
                  <ShieldCheckIcon className="size-3 text-[#a07142]" />
                  <span>Digitally Verifiable</span>
                </div>
                <span className="text-[10px] font-mono text-[#64748b] mt-0.5">
                  /verify/{certificateId}
                </span>
              </div>
            </div>

            {/* Official Academic Signatory */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
              <div className="font-heading italic text-xl text-[#14233c] border-b border-[#14233c]/30 px-6 pb-0.5">
                Director of Academic Programs
              </div>
              <span className="text-[10px] uppercase text-[#64748b] font-mono tracking-wider mt-1.5">
                Authorized Evaluation Signatory
              </span>
            </div>
          </div>
        </div>
      </div>

      {isInteractive && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748b] px-2">
          <span>
            Standard specimen layout. Live public credentials can be verified by ID or QR scan.
          </span>
          <Link
            to="/verify/$certificateId" params={{ certificateId: certificateId }}
            className="font-medium text-[#a07142] hover:text-[#14233c] underline"
          >
            Audit this specimen credential →
          </Link>
        </div>
      )}
    </div>
  )
}
