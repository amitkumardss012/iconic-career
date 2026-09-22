import { siteConfig } from "@/lib/site"

export interface SeoMetaOptions {
  title?: string
  description?: string
  path?: string
  keywords?: string[]
}

export function createMetaTags({
  title,
  description = siteConfig.description,
  path = "",
  keywords = [
    "internship programs",
    "career platform",
    "student certification",
    "verifiable certificate",
    "professional internship",
    "practical career training",
  ],
}: SeoMetaOptions = {}) {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — Structured Internships & Certification`
  const canonicalUrl = new URL(path, siteConfig.url).toString()

  return [
    { title: fullTitle },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { name: "author", content: siteConfig.name },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "en_IN" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: siteConfig.name },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ]
}

export function createMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}) {
  return createMetaTags({ title, description, path })
}
