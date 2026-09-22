import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { storageService } from "@/utils/storage/storage.service"
import type { ImageType, DocumentType } from "@/lib/types/programs"

const uploadImageSchema = z.object({
  base64: z.string().min(1, "Base64 payload is required"),
  fileName: z.string().min(1, "Filename is required"),
  fileType: z.string().min(1, "File MIME type is required"),
  folder: z.string().optional().default("programs"),
})

const uploadDocumentSchema = z.object({
  base64: z.string().min(1, "Base64 payload is required"),
  fileName: z.string().min(1, "Filename is required"),
  fileType: z.string().min(1, "File MIME type is required"),
  folder: z.string().optional().default("student_consent_letters"),
})

/**
 * Server function to upload compressed image to active Storage Provider (Cloudinary / AWS S3)
 * Returns standardized ImageType JSON payload: { id, url, bytes, format, provider }
 */
export const uploadImageFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => uploadImageSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Strip data URL header if present
    const base64Data = data.base64.replace(/^data:image\/[a-z0-9+]+;base64,/, "")
    const fileBuffer = Buffer.from(base64Data, "base64")

    if (fileBuffer.length === 0) {
      throw new Error("Invalid image data provided for upload.")
    }

    // 2. Upload via StorageService facade
    const uploadResult = await storageService.upload(
      {
        buffer: fileBuffer,
        originalname: data.fileName,
        mimetype: data.fileType,
        size: fileBuffer.length,
      },
      {
        folder: data.folder,
        resourceType: "image",
      }
    )

    // 3. Return standardized ImageType structure
    const imagePayload: ImageType = {
      id: uploadResult.publicId,
      url: uploadResult.secureUrl || uploadResult.url,
      bytes: uploadResult.bytes,
      format: uploadResult.format,
      provider: uploadResult.provider as "CLOUDINARY" | "AWS_S3" | "LOCAL",
    }

    return {
      success: true,
      image: imagePayload,
    }
  })

/**
 * Server function to upload PDF / document assets to active Storage Provider (Cloudinary / AWS S3)
 * Returns standardized DocumentType JSON payload: { id, url, bytes, format, provider, fileName }
 */
export const uploadDocumentFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => uploadDocumentSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Strip data URL header if present
    const base64Data = data.base64.replace(/^data:[^;]+;base64,/, "")
    const fileBuffer = Buffer.from(base64Data, "base64")

    if (fileBuffer.length === 0) {
      throw new Error("Invalid document data provided for upload.")
    }

    // 2. Upload via StorageService facade with auto resourceType
    const uploadResult = await storageService.upload(
      {
        buffer: fileBuffer,
        originalname: data.fileName,
        mimetype: data.fileType,
        size: fileBuffer.length,
      },
      {
        folder: data.folder,
        resourceType: "auto",
      }
    )

    const documentPayload: DocumentType = {
      id: uploadResult.publicId,
      url: uploadResult.secureUrl || uploadResult.url,
      bytes: uploadResult.bytes,
      format: uploadResult.format || "pdf",
      provider: uploadResult.provider as "CLOUDINARY" | "AWS_S3" | "LOCAL",
      fileName: data.fileName,
    }

    return {
      success: true,
      document: documentPayload,
    }
  })

/**
 * Server function to delete an asset by its storage ID
 */
export const deleteImageFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ publicId: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const success = await storageService.delete(data.publicId)
    return { success }
  })
