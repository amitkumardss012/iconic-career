import * as React from "react"
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react"
import { toast } from "sonner"
import type { ImageType } from "@/lib/types/programs"
import { resolveImageUrl } from "@/lib/types/programs"
import { compressImageUnder100KB, formatBytes } from "@/utils/image-compression"
import { uploadImageFn } from "@/lib/server/storage"

interface ImageUploadPickerProps {
  value: ImageType | string | null | undefined
  onChange: (image: ImageType | null) => void
  label: string
  aspectRatio?: "16:9" | "4:3" | "1:1" | "21:9" | "auto"
  folder?: string
  recommendedSizeText?: string
  helperText?: string
  disabled?: boolean
}

export function ImageUploadPicker({
  value,
  onChange,
  label,
  aspectRatio = "16:9",
  folder = "programs",
  recommendedSizeText,
  helperText,
  disabled = false,
}: ImageUploadPickerProps) {
  const displayHelperText =
    helperText || recommendedSizeText || "Recommended: 1200×675 (Auto-compressed to < 100 KB)"
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [isCompressing, setIsCompressing] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [compressionMetrics, setCompressionMetrics] = React.useState<{
    originalSize: number
    compressedSize: number
  } | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const currentUrl = resolveImageUrl(value)
  const isStructured = value && typeof value === "object" && "id" in value
  const structuredImage = isStructured ? (value as ImageType) : null

  const handleFileSelection = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).")
      return
    }

    try {
      setIsCompressing(true)
      setCompressionMetrics(null)

      // 1. Client-Side Progressive Compression (< 100 KB)
      const compressed = await compressImageUnder100KB(file)
      setCompressionMetrics({
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
      })

      setIsCompressing(false)
      setIsUploading(true)

      // 2. Upload to Cloud Storage Provider (Cloudinary / AWS S3)
      const res = await uploadImageFn({
        data: {
          base64: compressed.base64,
          fileName: compressed.file.name,
          fileType: compressed.file.type,
          folder,
        },
      })

      if (res?.success && res.image) {
        onChange(res.image)
        toast.success(
          `Image compressed (${formatBytes(compressed.originalSize)} ➔ ${formatBytes(compressed.compressedSize)}) & uploaded!`
        )
      } else {
        throw new Error("Upload failed to return asset.")
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      toast.error(err.message || "Failed to process image upload.")
    } finally {
      setIsCompressing(false)
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isCompressing || isUploading) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setCompressionMetrics(null)
  }

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-video"
      case "4:3":
        return "aspect-4/3"
      case "1:1":
        return "aspect-square max-w-[200px]"
      case "21:9":
        return "aspect-[21/9]"
      default:
        return "min-h-[160px]"
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[0.68rem] font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <span className="text-[0.65rem] text-slate-400">{displayHelperText}</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        disabled={disabled || isCompressing || isUploading}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0])
          }
        }}
      />

      {/* Upload Zone / Preview Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isCompressing && !isUploading && !currentUrl) {
            fileInputRef.current?.click()
          }
        }}
        className={`relative overflow-hidden rounded-xl border-2 transition-all ${
          isDragging
            ? "border-[#b8864d] bg-[#b8864d]/10 scale-[0.99]"
            : currentUrl
            ? "border-slate-200 bg-slate-900/5 hover:border-slate-300"
            : "border-dashed border-slate-300 bg-slate-50/70 hover:border-[#14233c] hover:bg-slate-100/60 cursor-pointer"
        } ${getAspectClass()} flex flex-col items-center justify-center`}
      >
        {/* State 1: Active Processing (Compressing or Uploading) */}
        {(isCompressing || isUploading) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xs p-4 text-center">
            <div className="size-8 animate-spin rounded-full border-3 border-[#14233c] border-t-transparent mb-2.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 block">
                {isCompressing ? "Compressing (< 100 KB)..." : "Uploading to Storage..."}
              </span>
              <p className="text-[0.68rem] text-slate-500">
                {isCompressing
                  ? "Adaptive client-side canvas optimization"
                  : "Streaming to cloud storage provider"}
              </p>
            </div>
          </div>
        )}

        {/* State 2: Preview Mode */}
        {currentUrl ? (
          <div className="group relative size-full">
            <img
              src={currentUrl}
              alt={label}
              className="size-full object-cover"
              loading="lazy"
            />

            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end gap-1.5">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/90 transition-colors"
                  title="View full resolution"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="size-3.5" />
                </a>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/90 transition-colors cursor-pointer"
                  title="Replace Image"
                >
                  <RefreshCw className="size-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-lg bg-rose-600/80 p-1.5 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {/* Metadata Badges */}
              <div className="flex items-center justify-between text-[0.65rem] text-white">
                <div className="flex items-center gap-1.5">
                  {structuredImage ? (
                    <>
                      <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono">
                        {formatBytes(structuredImage.bytes)}
                      </span>
                      <span className="rounded bg-[#b8864d]/80 px-1.5 py-0.5 font-bold uppercase">
                        {structuredImage.provider}
                      </span>
                      <span className="rounded bg-white/20 px-1.5 py-0.5 uppercase">
                        {structuredImage.format}
                      </span>
                    </>
                  ) : (
                    <span className="rounded bg-white/20 px-1.5 py-0.5">Custom URL</span>
                  )}
                </div>

                <span className="text-slate-300">Click to change</span>
              </div>
            </div>
          </div>
        ) : (
          /* State 3: Empty Pick Dropzone */
          <div className="p-6 text-center space-y-2 select-none">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 text-[#14233c]">
              <UploadCloud className="size-5 text-[#b8864d]" />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Choose Image from Gallery
              </span>
              <p className="text-[0.68rem] text-slate-500 mt-0.5">
                Drag and drop, or <strong className="text-[#8e653e] font-semibold underline">browse</strong>
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-700 border border-emerald-200">
              <Sparkles className="size-2.5" /> Auto-compressed &lt; 100 KB
            </div>
          </div>
        )}
      </div>

      {/* Metrics Feedback Banner */}
      {compressionMetrics && (
        <div className="flex items-center justify-between text-[0.65rem] bg-slate-50 rounded-lg px-2.5 py-1 border border-slate-200 text-slate-600">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>Compressed:</span>
            <strong className="text-slate-900 font-mono">{formatBytes(compressionMetrics.originalSize)}</strong>
            <span>➔</span>
            <strong className="text-emerald-700 font-mono">{formatBytes(compressionMetrics.compressedSize)}</strong>
          </span>
          <span className="text-[0.6rem] font-bold text-emerald-600 uppercase">Under 100 KB ✓</span>
        </div>
      )}
    </div>
  )
}
