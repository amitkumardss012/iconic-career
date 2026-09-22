import * as React from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowRightIcon,
  SparklesIcon,
  HelpCircleIcon,
  MessageSquareIcon,
  MailIcon,
  ChevronDownIcon,
  PlusIcon,
} from "lucide-react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

interface FaqItem {
  id: string
  question: string
  answer: string
}

interface FaqPreviewSectionProps {
  faqs: FaqItem[]
}

export function FaqPreviewSection({ faqs }: FaqPreviewSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-28 border-b border-[#ede7de]">
      {/* Mesh Pattern */}
      <div
        className="absolute inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d3c7b5 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Explanatory & Support Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
            <div>
              {/* Illuminated Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#fbf6ee] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e653e] shadow-2xs mb-4">
                <SparklesIcon className="size-3 text-[#d4af37]" />
                <span>CLARIFICATIONS & FAQ</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-normal leading-[1.08] tracking-tight text-[#14233c]">
                Clear Answers. <br />
                <span className="italic text-[#a07142]">Zero Ambiguity.</span>
              </h2>

              <p className="text-sm text-[#596579] leading-relaxed mt-3.5">
                Clear policies regarding program commitments, internship duration, supervisor reviews, and public certificate verification.
              </p>
            </div>

            {/* Direct Support Card */}
            <div className="rounded-2xl border border-[#d6cbba] bg-white p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#f6eee3] text-[#8e653e] flex items-center justify-center shrink-0">
                  <MessageSquareIcon className="size-4.5" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-bold text-[#14233c]">
                    Have a Specific Question?
                  </h4>
                  <span className="text-xs text-[#64748b]">
                    Degree credits or college approval
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#596579] leading-relaxed">
                Our academic advisors assist students with university documentation requirements, NOC letters, and syllabus matching.
              </p>

              <div className="pt-2 border-t border-[#f0eae1] flex items-center justify-between">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14233c] hover:text-[#a07142] transition-colors"
                >
                  <span>Contact Academic Desk</span>
                  <ArrowRightIcon className="size-3" />
                </Link>

                <Link
                  to="/faq"
                  className="text-xs font-mono font-semibold text-[#8e653e] hover:underline"
                >
                  All FAQs →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion Stage (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-[#d6cbba] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(20,35,60,0.05)]">
            <Accordion>
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-[#f0eae1] py-3 first:pt-0 last:border-b-0"
                >
                  <AccordionTrigger className="text-left font-heading text-[17px] font-bold text-[#14233c] hover:text-[#a07142] transition-colors leading-snug py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-[13.5px] text-[#596579] leading-relaxed pt-1 pb-3">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Bottom View All Link */}
            <div className="mt-6 pt-5 border-t border-[#f0eae1] flex items-center justify-between text-xs">
              <span className="text-[#64748b]">Looking for more detailed guidance?</span>
              <Link
                to="/faq"
                className="inline-flex items-center gap-1.5 font-bold text-[#14233c] hover:text-[#a07142] transition-colors"
              >
                <span>Read Complete Knowledgebase (20+)</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
