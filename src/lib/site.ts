export const siteConfig = {
  name: "The Iconic Career",
  shortName: "Iconic Career",
  tagline: "Structured internships, professional documentation, and verifiable certificates.",
  description:
    "The Iconic Career is an internship and student management organization. Students discover programs, enroll in structured internships, complete their journey, and receive certificates designed for verification.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://theiconiccareer.com",
  email: "hello@theiconiccareer.com",
  phone: "+91 00000 00000",
  address: "Office address to be published",
  hours: "Monday–Friday, 10:00–18:00 IST",
  social: {
    linkedin: "https://www.linkedin.com",
    instagram: "https://www.instagram.com",
    x: "https://x.com",
  },
} as const
