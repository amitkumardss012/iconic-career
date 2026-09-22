import * as React from "react"
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileCheck,
} from "lucide-react"
import { toast } from "sonner"
import type { DocumentType } from "@/lib/types/programs"
import { resolveDocumentUrl } from "@/lib/types/programs"
import { formatBytes } from "@/utils/image-compression"
import { uploadDocumentFn } from "@/lib/server/storage"

interface PdfUploadPickerProps {
  value: DocumentType | string | null | undefined
  onChange: (document: DocumentType | null) => void
  label?: string
  folder?: string
  helperText?: string
  disabled?: boolean
}

export function PdfUploadPicker({
  value,
  onChange,
  label = "Parental Consent Letter (PDF)",
  folder = "student_consent_letters",
  helperText = "Accepted: PDF document up to 10 MB (Stored securely in Cloud Storage)",
  disabled = false,
}: PdfUploadPickerProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)

  const currentUrl = resolveDocumentUrl(value)
  const isStructured = value && typeof value === "object" && "url" in value
  const structuredDoc = isStructured ? (value as DocumentType) : null

  const handleFileSelection = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a valid PDF document.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10 MB limit. Please select a smaller PDF.")
      return
    }

    try {
      setIsUploading(true)

      // Convert file to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (err) => reject(err)
      })
      reader.readAsDataURL(file)
      const base64Data = await base64Promise

      // Upload to Cloud Storage
      const res = await uploadDocumentFn({
        data: {
          base64: base64Data,
          fileName: file.name,
          fileType: file.type || "application/pdf",
          folder,
        },
      })

      if (res?.success && res.document) {
        onChange(res.document)
        toast.success(`Consent letter (${file.name}) uploaded to cloud storage!`)
      } else {
        throw new Error("Upload failed to return cloud document asset.")
      }
    } catch (err: any) {
      console.error("PDF upload error:", err)
      toast.error(err.message || "Failed to upload PDF document.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isUploading) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-[#b8864d]" />
          <span>{label}</span>
        </label>
        <span className="text-[0.65rem] text-slate-400">{helperText}</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0])
          }
        }}
      />

      {/* Upload Zone / Document Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isUploading && !currentUrl) {
            fileInputRef.current?.click()
          }
        }}
        className={`relative overflow-hidden rounded-xl border-2 transition-all ${
          isDragging
            ? "border-[#b8864d] bg-[#b8864d]/10 scale-[0.99]"
            : currentUrl
            ? "border-slate-200 bg-slate-50 p-4"
            : "border-dashed border-slate-300 bg-slate-50/70 hover:border-[#14233c] hover:bg-slate-100/60 cursor-pointer p-6"
        } flex flex-col items-center justify-center min-h-[120px]`}
      >
        {/* State 1: Active Uploading */}
        {isUploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xs p-4 text-center">
            <div className="size-8 animate-spin rounded-full border-3 border-[#14233c] border-t-transparent mb-2" />
            <span className="text-xs font-bold text-slate-900 block">Uploading PDF to Cloud Storage...</span>
            <p className="text-[0.68rem] text-slate-500">Streaming document securely to cloud repository</p>
          </div>
        )}

        {/* State 2: Document Attached / Preview Mode */}
        {currentUrl ? (
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs">
                <FileText className="size-6" />
              </div>

              <div className="flex flex-col truncate max-w-xs sm:max-w-sm">
                <span className="font-semibold text-xs text-slate-900 truncate">
                  {structuredDoc?.fileName || "Parental_Consent_Letter.pdf"}
                </span>
                <div className="flex items-center gap-2 mt-0.5 text-[0.65rem] text-slate-500">
                  {structuredDoc?.bytes ? (
                    <span className="font-mono">{formatBytes(structuredDoc.bytes)}</span>
                  ) : null}
                  {structuredDoc?.provider ? (
                    <span className="rounded bg-[#f5ecdf] text-[#8e653e] px-1.5 py-0.2 font-semibold uppercase text-[0.6rem] border border-[#b8864d]/30">
                      {structuredDoc.provider}
                    </span>
                  ) : (
                    <span className="rounded bg-slate-200 px-1.5 py-0.2 text-[0.6rem]">Cloud Stored</span>
                  )}
                  <span className="inline-flex items-center gap-0.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="size-3 text-emerald-600" /> Attached
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
                title="View PDF document in new tab"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="size-3.5 text-[#8e653e]" />
                <span>View PDF</span>
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
                title="Replace PDF"
              >
                <RefreshCw className="size-3.5 text-slate-500" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Remove Document"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* State 3: Empty PDF Dropzone */
          <div className="text-center space-y-2 select-none">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 text-[#14233c]">
              <UploadCloud className="size-5 text-[#b8864d]" />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Upload Signed Parental Consent Letter (PDF)
              </span>
              <p className="text-[0.68rem] text-slate-500 mt-0.5">
                Drag and drop PDF file here, or <strong className="text-[#8e653e] font-semibold underline">browse to select</strong>
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[0.62rem] font-medium text-slate-600 border border-slate-200">
              <FileCheck className="size-3 text-slate-500" /> Secure Cloud Storage
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
