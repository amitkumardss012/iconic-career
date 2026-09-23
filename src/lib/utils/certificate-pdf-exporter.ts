import { toPng } from "html-to-image"
import jsPDF from "jspdf"

interface ExportPdfOptions {
  elementId?: string
  fileName?: string
  pixelRatio?: number
  scale?: number
}

/**
 * High-Resolution Client-Side PDF Exporter
 * Uses html-to-image (native browser SVG foreignObject rendering)
 * to natively support all modern CSS functions (oklch, color-mix, CSS variables)
 * and generates an official landscape A4 PDF.
 */
export async function exportCertificateToPdf({
  elementId = "certificate-render-canvas",
  fileName = "Certificate.pdf",
  pixelRatio,
  scale = 2.5,
}: ExportPdfOptions = {}): Promise<boolean> {
  const finalPixelRatio = pixelRatio ?? scale ?? 2.5
  const element = document.getElementById(elementId)

  if (!element) {
    throw new Error(`Target certificate element #${elementId} not found in the DOM.`)
  }

  try {
    // 1. Capture element using html-to-image which natively supports oklch & Tailwind v4
    const imgData = await toPng(element, {
      quality: 1.0,
      pixelRatio: finalPixelRatio,
      backgroundColor: "#fbf9f5",
      cacheBust: true,
      style: {
        transform: "none",
        margin: "0",
      },
    })

    // 2. Initialize Landscape A4 PDF (297mm x 210mm)
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    const pdfWidth = 297
    const pdfHeight = 210

    // 3. Render image to fill page
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST")

    // 4. Download file
    const safeFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`
    pdf.save(safeFileName)

    return true
  } catch (error) {
    console.error("PDF generation failed:", error)
    throw error
  }
}
