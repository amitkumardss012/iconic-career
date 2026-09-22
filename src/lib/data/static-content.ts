import { programs } from "./programs"
import { internships } from "./internships"
import { faqItems } from "./faq"
import { services } from "./services"
import type { Program, Internship, FaqItem, ServiceItem } from "@/lib/types"

export function getStaticPrograms(): Program[] {
  return programs
}

export function getStaticProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug)
}

export function getStaticInternships(): Internship[] {
  return internships
}

export function getStaticInternshipBySlug(slug: string): Internship | undefined {
  return internships.find((i) => i.slug === slug)
}

export function getStaticInternshipForProgram(programSlug: string): Internship | undefined {
  return internships.find((i) => i.programSlug === programSlug)
}

export function getStaticServices(): ServiceItem[] {
  return services
}

export function getStaticFaqs(): FaqItem[] {
  return faqItems
}

export function getStaticFeaturedFaqs(): FaqItem[] {
  return faqItems.filter((item) => item.featured)
}
