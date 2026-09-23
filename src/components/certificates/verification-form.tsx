import * as React from "react"
import { Link } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  verifyCertificatePublicFn,
  recordCertificateDownloadFn,
} from "@/lib/server/certificates"
import type { PublicVerificationResult } from "@/lib/services/certificates"
import {
  ProfessionalCertificateDocument,
  type ProfessionalCertificateData,
} from "@/components/certificates/professional-certificate-document"
import { exportCertificateToPdf } from "@/lib/utils/certificate-pdf-exporter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ShieldCheck,
  Search,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  QrCode,
  Copy,
  Check,
  Printer,
  ExternalLink,
  Sparkles,
  Lock,
  Unlock,
  Download,
  Loader2,
  AlertTriangle,
  Award,
  Calendar,
  Building,
  GraduationCap,
} from "lucide-react"

interface VerificationFormProps {
  initialId?: string
  autoVerify?: boolean
  className?: string
}

export function VerificationForm({
  initialId = "",
  autoVerify = false,
  className,
}: VerificationFormProps) {
  const [certificateId, setCertificateId] = React.useState(initialId)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [verificationResult, setVerificationResult] = React.useState<PublicVerificationResult | null>(null)
  const [copied, setCopied] = React.useState(false)

  // Verify certificate by ID
  const handleVerify = React.useCallback(
    async (idToVerify: string) => {
      const trimmed = idToVerify.trim().toUpperCase()
      if (!trimmed) {
        setVerificationResult({
          status: "INVALID",
          message: "Please enter a valid Certificate Identifier to query the public credential registry.",
        })
        return
      }

      setIsLoading(true)
      try {
        const res = await verifyCertificatePublicFn({
          data: { certificateNumber: trimmed },
        })
        setVerificationResult(res)
      } catch (err: any) {
        console.error("Verification failed:", err)
        setVerificationResult({
          status: "NOT_FOUND",
          message:
            err?.message ||
            "Unable to connect to the credential ledger. Please verify the ID or check the QR code.",
        })
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Auto-verify if initialId is passed (e.g. from /verify/$certificateId)
  React.useEffect(() => {
    if (!autoVerify || !initialId) return
    const trimmed = initialId.trim().toUpperCase()
    if (trimmed) {
      handleVerify(trimmed)
    }
  }, [autoVerify, initialId, handleVerify])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify(certificateId)
  }

  // Handle PDF Export
  const handleDownloadPdf = async () => {
    if (!verificationResult?.certificate) return

    const cert = verificationResult.certificate
    if (!cert.isDownloadAllowed) {
      toast.error("Download Restricted", {
        description: "Administrative hold is currently in place for downloading this certificate.",
      })
      return
    }

    try {
      setIsDownloading(true)
      const fileName = `${cert.certificateNumber}.pdf`

      // 1. Export PDF
      await exportCertificateToPdf({
        elementId: "certificate-render-canvas",
        fileName,
        scale: 2.5,
      })

      // 2. Record telemetry in background
      recordCertificateDownloadFn({
        data: { certificateNumber: cert.certificateNumber },
      }).catch((err) => console.error("Telemetry failed:", err))

      toast.success("Certificate Downloaded", {
        description: `Saved as ${fileName}`,
      })
    } catch (err: any) {
      console.error("Download PDF failed:", err)
      toast.error("Failed to generate PDF", {
        description: err?.message || "Please use the Print option as an alternative.",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Handle Print
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  // Copy Permalink
  const handleCopyLink = () => {
    if (typeof window === "undefined") return
    const activeId = verificationResult?.certificate?.certificateNumber || certificateId
    const url = `${window.location.origin}/verify/${activeId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      toast.success("Verification link copied to clipboard")
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <div className={`flex flex-col gap-8 ${className || ""}`}>
      {/* 01. Search Input Bar */}
      <div className="rounded-2xl border border-[#e8dfd1] bg-white p-6 sm:p-8 shadow-sm backdrop-blur-sm">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="certificate-id-input"
              className="text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] flex items-center justify-between"
            >
              <span>Enter Credential Identifier</span>
              <span className="text-[#a07142] text-[11px] font-normal lowercase">Format: IC-YYYY-XXXXX</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8a99ad]" />
                <Input
                  id="certificate-id-input"
                  type="text"
                  placeholder="e.g. IC-2026-00412"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                  className="pl-10 font-mono tracking-wider text-sm h-12 uppercase border-[#d8cbb8] focus-visible:ring-[#a07142] focus-visible:border-[#a07142] bg-[#faf8f5] font-medium"
                  disabled={isLoading}
                  aria-label="Certificate ID"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !certificateId.trim()}
                className="h-12 px-7 font-medium gap-2 shrink-0 bg-[#14233c] hover:bg-[#a07142] text-white transition-colors duration-200 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-white" />
                    <span>Verifying Ledger...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4 text-[#c5a880]" />
                    <span>Verify Credential</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Helper Subtext */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#f0e8dc] text-xs">
            <div className="flex items-center gap-2 text-[#64748b]">
              <QrCode className="size-3.5 text-[#a07142]" />
              <span>Enter the certificate number printed on your credential or scanned via QR code.</span>
            </div>
          </div>
        </form>
      </div>

      {/* 02. Verification Result Display */}
      {verificationResult && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* A. VALID STATE */}
          {verificationResult.status === "VALID" && verificationResult.certificate && (
            <div className="space-y-6">
              {/* Status Header Banner */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-white text-emerald-700 border border-emerald-200 shadow-xs shrink-0">
                    <CheckCircle2 className="size-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Authenticated Official Credential</span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl font-normal text-[#14233c] mt-0.5">
                      Certificate Standing Validated & Active
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-white text-[#14233c] border border-emerald-200 shadow-2xs">
                    {verificationResult.certificate.certificateNumber}
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-[#e8dfd1] bg-white shadow-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Download PDF Button */}
                  <Button
                    onClick={handleDownloadPdf}
                    disabled={isDownloading || !verificationResult.certificate.isDownloadAllowed}
                    className={`gap-2 h-10 px-5 text-xs font-bold shadow-xs ${
                      verificationResult.certificate.isDownloadAllowed
                        ? "bg-[#14233c] hover:bg-[#a07142] text-white"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-[#d4af37]" />
                        <span>Rendering PDF...</span>
                      </>
                    ) : verificationResult.certificate.isDownloadAllowed ? (
                      <>
                        <Download className="size-4 text-[#d4af37]" />
                        <span>Download Official PDF</span>
                      </>
                    ) : (
                      <>
                        <Lock className="size-4" />
                        <span>Download Locked by Admin</span>
                      </>
                    )}
                  </Button>

                  {/* Print Button */}
                  <Button
                    variant="outline"
                    onClick={handlePrint}
                    className="gap-2 h-10 px-4 text-xs font-semibold border-[#d8cbb8] text-[#14233c] hover:bg-[#faf8f5]"
                  >
                    <Printer className="size-4 text-[#a07142]" />
                    <span>Print Certificate</span>
                  </Button>

                  {/* Copy Link Button */}
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="gap-2 h-10 px-4 text-xs font-semibold border-[#d8cbb8] text-[#14233c] hover:bg-[#faf8f5]"
                  >
                    {copied ? (
                      <>
                        <Check className="size-4 text-emerald-600" />
                        <span className="text-emerald-700">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-4 text-[#a07142]" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>
                </div>

                <Link
                  to="/verify/$certificateId"
                  params={{ certificateId: verificationResult.certificate.certificateNumber }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#a07142] hover:text-[#14233c] transition-colors"
                >
                  <span>Direct Permalink</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>

              {/* Download Restriction Alert if not allowed */}
              {!verificationResult.certificate.isDownloadAllowed && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
                  <Lock className="size-4.5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-amber-950">Certificate Download on Administrative Hold</h5>
                    <p className="mt-0.5 leading-relaxed text-amber-800">
                      While your credential verification record is authentic and confirmed in our registry, PDF
                      download generation has been temporarily restricted by the academic administration. Please contact
                      administration or support for clearance.
                    </p>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* MODULAR CERTIFICATE CANVAS (SEPARATE COMPONENT)          */}
              {/* ======================================================== */}
              <div className="pt-2">
                <div className="text-center mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#64748b]">
                    Official Rendered Credential Document
                  </span>
                </div>
                <ProfessionalCertificateDocument
                  data={verificationResult.certificate as ProfessionalCertificateData}
                />
              </div>

              {/* Academic Specification Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-[#e8dfd1] shadow-2xs">
                  <span className="text-[10px] text-[#64748b] uppercase font-mono block">Recipient</span>
                  <span className="font-bold text-[#14233c] block mt-1 truncate">
                    {verificationResult.certificate.recipientName}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#e8dfd1] shadow-2xs">
                  <span className="text-[10px] text-[#64748b] uppercase font-mono block">Program Track</span>
                  <span className="font-bold text-[#14233c] block mt-1 truncate">
                    {verificationResult.certificate.programTitle}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#e8dfd1] shadow-2xs">
                  <span className="text-[10px] text-[#64748b] uppercase font-mono block">Duration</span>
                  <span className="font-bold text-[#14233c] block mt-1">
                    {verificationResult.certificate.durationText}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#e8dfd1] shadow-2xs">
                  <span className="text-[10px] text-[#64748b] uppercase font-mono block">Issue Date</span>
                  <span className="font-bold text-[#14233c] block mt-1">
                    {verificationResult.certificate.issueDate}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* B. REVOKED STATE */}
          {verificationResult.status === "REVOKED" && (
            <div className="rounded-2xl border border-rose-300 bg-rose-50/90 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-rose-800">
                <div className="size-12 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-6 text-rose-600" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-rose-700">
                    Official Revocation Notice
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-rose-950">
                    Certificate Has Been Officially Revoked
                  </h3>
                </div>
              </div>

              <p className="text-sm text-rose-900 leading-relaxed">
                This credential was revoked by the academic board and is no longer valid.
              </p>

              {verificationResult.certificate?.revocationReason && (
                <div className="rounded-xl border border-rose-200 bg-white p-4 text-xs space-y-1">
                  <strong className="text-rose-900 block font-mono uppercase">Official Revocation Reason:</strong>
                  <p className="text-slate-700">{verificationResult.certificate.revocationReason}</p>
                </div>
              )}
            </div>
          )}

          {/* C. SUSPENDED STATE */}
          {verificationResult.status === "SUSPENDED" && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-center space-y-3">
              <AlertCircle className="size-8 text-amber-600 mx-auto" />
              <h4 className="font-heading text-xl font-bold text-amber-950">Credential Under Administrative Hold</h4>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                This certificate is currently in a suspended state. Please contact evaluation support for status
                inquiries.
              </p>
            </div>
          )}

          {/* D. NOT FOUND / INVALID STATE */}
          {(verificationResult.status === "NOT_FOUND" || verificationResult.status === "INVALID") && (
            <div className="rounded-2xl border border-[#e8dfd1] bg-white p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 mx-auto">
                <AlertCircle className="size-7 text-amber-600" />
              </div>

              <div className="space-y-1">
                <h4 className="font-heading text-xl font-medium text-[#14233c]">
                  {verificationResult.status === "NOT_FOUND"
                    ? "Credential Not Located in Registry"
                    : "Invalid Credential Format"}
                </h4>
                <p className="text-sm text-[#64748b] max-w-md mx-auto leading-relaxed">
                  {verificationResult.message}
                </p>
              </div>

              <div className="max-w-md mx-auto text-xs text-[#556477] bg-[#faf8f5] p-3.5 rounded-lg border border-[#e8dfd1] text-left space-y-1.5">
                <div className="font-semibold text-[#14233c] font-mono">Troubleshooting checklist:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Ensure hyphens and digits are typed accurately (e.g. <span className="font-mono font-bold">IC-2026-00412</span>).</li>
                  <li>Scan the security QR code on the physical certificate using your mobile phone camera.</li>
                  <li>Verify if your enrollment has been certified by an administrator in the admin console.</li>
                </ul>
              </div>

              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setVerificationResult(null)
                    setCertificateId("")
                  }}
                  className="text-xs gap-1.5 border-[#d8cbb8] text-[#14233c]"
                >
                  <RotateCcw className="size-3.5 text-[#a07142]" />
                  <span>Try Another Identifier</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
