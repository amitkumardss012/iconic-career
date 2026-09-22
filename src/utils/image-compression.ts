/**
 * Progressive Client-Side Image Compression Utility
 * Guarantees that any input image (from gallery, camera, or file picker)
 * is compressed to strictly UNDER 100 KB before upload to Cloud Storage.
 */

export interface CompressionResult {
  file: File
  base64: string
  originalSize: number
  compressedSize: number
  format: string
  width: number
  height: number
}

const MAX_TARGET_BYTES = 100 * 1024 // 100 KB (102,400 bytes)
const MAX_DIMENSION = 1600 // Max width/height bounding box

/**
 * Compress an image file to under 100 KB using Canvas API
 */
export async function compressImageUnder100KB(file: File): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith("image/")) {
      return reject(new Error("Selected file is not an image."))
    }

    const originalSize = file.size
    const reader = new FileReader()

    reader.onerror = () => reject(new Error("Failed to read image file."))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error("Failed to load image."))
      img.onload = async () => {
        try {
          let { width, height } = img

          // 1. Initial Scale down if dimensions exceed bounding box
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width)
              width = MAX_DIMENSION
            } else {
              width = Math.round((width * MAX_DIMENSION) / height)
              height = MAX_DIMENSION
            }
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")

          if (!ctx) {
            return reject(new Error("Failed to get canvas 2D context."))
          }

          // Render with smooth bicubic interpolation
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = "high"
          ctx.drawImage(img, 0, 0, width, height)

          // 2. Iterative Quality Adjustment to guarantee < 100 KB
          const preferredMime = "image/webp"
          let quality = 0.88
          let blob: Blob | null = await getCanvasBlob(canvas, preferredMime, quality)

          // Fallback to jpeg if webp is not supported
          let format = "webp"
          if (!blob) {
            format = "jpeg"
            blob = await getCanvasBlob(canvas, "image/jpeg", quality)
          }

          if (!blob) {
            return reject(new Error("Canvas blob conversion failed."))
          }

          // If still over 100 KB, decrease quality and resize proportionally
          let attempts = 0
          while (blob && blob.size > MAX_TARGET_BYTES && attempts < 8) {
            attempts++
            quality = Math.max(0.2, quality - 0.12)

            // Further scale down dimensions if still too large
            if (blob.size > MAX_TARGET_BYTES * 1.5) {
              canvas.width = Math.round(canvas.width * 0.85)
              canvas.height = Math.round(canvas.height * 0.85)
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            }

            blob = await getCanvasBlob(canvas, `image/${format}`, quality)
          }

          if (!blob) {
            return reject(new Error("Image compression produced an empty blob."))
          }

          // 3. Generate base64 data url and File object
          const base64 = await blobToBase64(blob)
          const newFileName = file.name.replace(/\.[^/.]+$/, "") + `.${format}`
          const compressedFile = new File([blob], newFileName, {
            type: `image/${format}`,
            lastModified: Date.now(),
          })

          resolve({
            file: compressedFile,
            base64,
            originalSize,
            compressedSize: blob.size,
            format,
            width: canvas.width,
            height: canvas.height,
          })
        } catch (err) {
          reject(err)
        }
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}

function getCanvasBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, quality)
  })
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

/**
 * Helper to format byte sizes into readable KB / MB
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
