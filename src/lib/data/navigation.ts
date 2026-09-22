import type { NavLink } from "@/lib/types"

export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/internships", label: "Internships" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

export const utilityNav: NavLink[] = [
  { href: "/verify", label: "Verify Certificate" },
  { href: "/login", label: "Login" },
]

export const footerGroups = {
  company: [
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/internships", label: "Internships" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],
  resources: [
    { href: "/faq", label: "FAQ" },
    { href: "/verify", label: "Certificate Verification" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
  ],
} satisfies Record<string, NavLink[]>
