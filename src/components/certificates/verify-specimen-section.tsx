import React from "react"
import { AwardIcon } from "lucide-react"
import { CertificatePreview } from "@/components/certificates/certificate-preview"

export function VerifySpecimenSection() {
  return (
    <section className="py-16 md:py-24 bg-[#faf8f5] border-b border-[#e8dfd1] relative">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-white px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[#14233c] mb-3">
            <AwardIcon className="size-3.5 text-[#a07142]" />
            <span>Institutional Credential Standard</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-normal text-[#14233c]">
            Official Specimen <br />
            <span className="italic text-[#a07142]">Certificate Architecture</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#556477] leading-relaxed">
            Every credential issued by The Iconic Career embodies strict academic typography, serialized identifiers, authorized signatory marks, and an immutable cryptographic verification seal.
          </p>
        </div>

        <CertificatePreview isInteractive={true} />
      </div>
    </section>
  )
}
