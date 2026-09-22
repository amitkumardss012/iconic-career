import * as React from "react"
import { Link } from "@tanstack/react-router"
import { verifyCertificateById, SAMPLE_CERTIFICATE } from "@/lib/services/verification"
import type { VerificationResult, VerificationStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ShieldCheckIcon,
  SearchIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  QrCodeIcon,
  CopyIcon,
  CheckIcon,
  PrinterIcon,
  ExternalLinkIcon,
  SparklesIcon,
  LockIcon,
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
  const [status, setStatus] = React.useState<VerificationStatus>(
    autoVerify && initialId ? "loading" : "idle"
  )
  const [result, setResult] = React.useState<VerificationResult | null>(null)
  const [copied, setCopied] = React.useState(false)

  const handleVerify = React.useCallback(
    async (idToVerify: string) => {
      const trimmed = idToVerify.trim().toUpperCase()
      if (!trimmed) {
        setStatus("invalid")
        setResult({
          status: "invalid",
          message: "Please enter a valid Certificate ID to query the public credential registry.",
        })
        return
      }

      setStatus("loading")
      try {
        const res = await verifyCertificateById(trimmed)
        setResult(res)
        setStatus(res.status)
      } catch {
        setStatus("error")
        setResult({
          status: "error",
          message: "A communication error occurred while connecting to the credential ledger.",
        })
      }
    },
    []
  )

  React.useEffect(() => {
    if (!autoVerify || !initialId) return
    let isMounted = true
    const timer = setTimeout(async () => {
      const trimmed = initialId.trim().toUpperCase()
      if (!trimmed) return
      try {
        const res = await verifyCertificateById(trimmed)
        if (isMounted) {
          setResult(res)
          setStatus(res.status)
        }
      } catch {
        if (isMounted) {
          setStatus("error")
          setResult({
            status: "error",
            message: "A communication error occurred while connecting to the credential ledger.",
          })
        }
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [autoVerify, initialId])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify(certificateId)
  }

  const handleUseSample = () => {
    setCertificateId(SAMPLE_CERTIFICATE.certificateId)
    handleVerify(SAMPLE_CERTIFICATE.certificateId)
  }

  const handleCopyLink = () => {
    if (typeof window === "undefined") return
    const url = `${window.location.origin}/verify/${result?.certificate?.certificateId || certificateId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div className={`flex flex-col gap-6 ${className || ""}`}>
      {/* Verification Query Console */}
      <div className="rounded-2xl border border-[#e8dfd1] bg-white p-6 sm:p-8 shadow-sm backdrop-blur-sm">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="certificate-id-input"
              className="text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] flex items-center justify-between"
            >
              <span>Enter Credential Identifier</span>
              <span className="text-[#a07142] text-[11px] font-normal lowercase">Format: IC-YYYY-XXXX</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8a99ad]" />
                <Input
                  id="certificate-id-input"
                  type="text"
                  placeholder="e.g. IC-2026-8821"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                  className="pl-10 font-mono tracking-wider text-sm h-12 uppercase border-[#d8cbb8] focus-visible:ring-[#a07142] focus-visible:border-[#a07142] bg-[#faf8f5] font-medium"
                  disabled={status === "loading"}
                  aria-label="Certificate ID"
                />
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="h-12 px-7 font-medium gap-2 shrink-0 bg-[#14233c] hover:bg-[#a07142] text-white transition-colors duration-200 shadow-sm"
              >
                {status === "loading" ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Auditing Registry...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="size-4 text-[#c5a880]" />
                    <span>Verify Credential</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Demonstration Shortcut & Helper Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#f0e8dc] text-xs">
            <div className="flex items-center gap-2 text-[#64748b]">
              <QrCodeIcon className="size-3.5 text-[#a07142]" />
              <span>Public lookup supports paper certificates & digital QR codes</span>
            </div>

            <button
              type="button"
              onClick={handleUseSample}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#d8cbb8] bg-[#faf8f5] px-3 py-1 font-mono text-[11px] font-semibold text-[#14233c] hover:bg-[#f0e8dc] transition-colors"
            >
              <SparklesIcon className="size-3 text-[#a07142]" />
              <span>Test with sample ID:</span>
              <span className="text-[#a07142] underline">{SAMPLE_CERTIFICATE.certificateId}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Verification Ledger Output */}
      {status !== "idle" && (
        <div className="rounded-2xl border border-[#e8dfd1] bg-white p-6 sm:p-8 shadow-sm transition-all duration-300">
          {/* 1. Loading State */}
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <div className="relative">
                <span className="size-12 block animate-spin rounded-full border-3 border-[#e8dfd1] border-t-[#a07142]" />
                <LockIcon className="size-4 text-[#a07142] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-medium text-[#14233c]">
                  Querying Sovereign Ledger
                </h4>
                <p className="text-xs text-[#64748b] font-mono">
                  Validating cryptographic checksum for record #{certificateId}...
                </p>
              </div>
            </div>
          )}

          {/* 2. Authenticated Valid State */}
          {status === "valid" && result?.certificate && (
            <div className="flex flex-col gap-6">
              {/* Official Verified Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e8dfd1] pb-6">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs shrink-0">
                    <CheckCircle2Icon className="size-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Verified Public Credential • Status: Authenticated</span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl font-normal text-[#14233c] mt-0.5">
                      Certificate Standing Validated
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-[#faf8f5] text-[#14233c] border border-[#d8cbb8]">
                    {result.certificate.certificateId}
                  </span>
                </div>
              </div>

              {/* 4-Column Specification Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd1] flex flex-col justify-between">
                  <span className="text-[11px] text-[#64748b] uppercase font-mono tracking-wider">
                    Candidate Full Name
                  </span>
                  <span className="font-heading text-lg font-medium text-[#14233c] mt-1">
                    {result.certificate.studentName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd1] flex flex-col justify-between">
                  <span className="text-[11px] text-[#64748b] uppercase font-mono tracking-wider">
                    Program Track / Internship
                  </span>
                  <span className="font-heading text-lg font-medium text-[#14233c] mt-1">
                    {result.certificate.internshipName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd1] flex flex-col justify-between">
                  <span className="text-[11px] text-[#64748b] uppercase font-mono tracking-wider">
                    Supervised Duration
                  </span>
                  <span className="font-heading text-lg font-medium text-[#14233c] mt-1">
                    {result.certificate.duration}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8dfd1] flex flex-col justify-between">
                  <span className="text-[11px] text-[#64748b] uppercase font-mono tracking-wider">
                    Date of Official Issuance
                  </span>
                  <span className="font-heading text-lg font-medium text-[#14233c] mt-1">
                    {result.certificate.issueDate}
                  </span>
                </div>
              </div>

              {/* Security & Privacy Ledger Notice */}
              <div className="rounded-xl bg-gradient-to-r from-[#faf8f5] to-[#f4eee6] p-4 text-xs text-[#556477] border border-[#e8dfd1] flex flex-col gap-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#14233c] font-semibold">
                  <LockIcon className="size-3.5 text-[#a07142]" />
                  <span>Privacy Preserved & Regulatory Audit Compliant</span>
                </div>
                <p className="leading-relaxed">
                  In strict compliance with candidate privacy regulations, private contact records (such as mobile phone numbers and email addresses) are masked from public ledger inspection. Evaluators and hiring organizations may contact The Iconic Career administration for direct institutional endorsement.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f0e8dc]">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="text-xs gap-1.5 border-[#d8cbb8] text-[#14233c] hover:bg-[#faf8f5]"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="size-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="size-3.5 text-[#a07142]" />
                        <span>Copy Verification Link</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="text-xs gap-1.5 border-[#d8cbb8] text-[#14233c] hover:bg-[#faf8f5]"
                  >
                    <PrinterIcon className="size-3.5 text-[#a07142]" />
                    <span>Print Slip</span>
                  </Button>
                </div>

                <Link
                  to="/verify/$certificateId" params={{ certificateId: result.certificate.certificateId }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#a07142] hover:text-[#14233c] transition-colors"
                >
                  <span>Permalink Record</span>
                  <ExternalLinkIcon className="size-3" />
                </Link>
              </div>
            </div>
          )}

          {/* 3. Not Found / Invalid / Error State */}
          {(status === "not_found" || status === "invalid" || status === "error") && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircleIcon className="size-7 text-amber-600" />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-heading text-xl font-medium text-[#14233c]">
                  {status === "not_found"
                    ? "Credential Not Located in Registry"
                    : status === "invalid"
                    ? "Invalid Identifier Format"
                    : "Registry Connection Interrupted"}
                </h4>
                <p className="text-sm text-[#64748b] max-w-md mt-1 leading-relaxed">
                  {result?.message}
                </p>
              </div>

              {/* Troubleshooting Advice */}
              <div className="max-w-md text-xs text-[#556477] bg-[#faf8f5] p-3.5 rounded-lg border border-[#e8dfd1] text-left space-y-1.5">
                <div className="font-semibold text-[#14233c] font-mono">Troubleshooting checklist:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Verify characters on the printed credential (e.g. <span className="font-mono font-semibold">IC-2026-8821</span>).</li>
                  <li>Ensure hyphens are included properly between segments.</li>
                  <li>Scan the security QR code on the credential directly using a smartphone camera.</li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatus("idle")
                    setResult(null)
                  }}
                  className="text-xs gap-1.5 border-[#d8cbb8] text-[#14233c]"
                >
                  <RotateCcwIcon className="size-3.5 text-[#a07142]" />
                  <span>Try Another Identifier</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUseSample}
                  className="text-xs font-mono text-[#a07142] hover:text-[#14233c] hover:bg-[#faf8f5]"
                >
                  Load Sample Record ({SAMPLE_CERTIFICATE.certificateId})
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
