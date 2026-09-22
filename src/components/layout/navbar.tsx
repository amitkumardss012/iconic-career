import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SearchIcon, ArrowRightIcon } from "lucide-react"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programmes" },
  { href: "/internships", label: "Internships" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
]

function IconicLogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Precision origami diamond ribbon logo matching mockup */}
      <path
        d="M20 4L33 12.5L20 21L7 12.5L20 4Z"
        fill="#182d46"
      />
      <path
        d="M7 12.5L20 21V36L7 27.5V12.5Z"
        fill="#101f33"
      />
      <path
        d="M33 12.5L20 21V36L33 27.5V12.5Z"
        fill="#213a5a"
      />
      <path
        d="M20 21L29 15L25.5 25.5L20 29V21Z"
        fill="#b8864d"
      />
      <path
        d="M20 21L11 15L14.5 25.5L20 29V21Z"
        fill="#986c3b"
      />
      <circle cx="20" cy="21" r="2" fill="#e4b574" />
    </svg>
  )
}

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled
          ? "border-b border-[#e5e7eb] bg-white/95 shadow-xs backdrop-blur-md"
          : "border-b border-[#f1f3f5] bg-white/90 backdrop-blur-xs"
      }`}
    >
      <div className="container-site flex h-17 items-center justify-between gap-4">
        {/* Brand Mark & Title */}
        <Link
          to="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-95"
        >
          <IconicLogoMark className="size-8.5 shrink-0 transition-transform group-hover:scale-105" />
          <div className="flcex flex-col leading-tight">
            <span className="font-heading text-lg font-bold tracking-tight text-[#14233c] sm:text-[1.2rem]">
              The Iconic Career
            </span>
            <span className="text-[0.68rem] font-medium text-[#64748b] tracking-wider uppercase">
              Learn • Intern • Grow
            </span>
          </div>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#14233c] font-semibold"
                    : "text-[#475569] hover:text-[#14233c]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-3.5 left-3.5 right-3.5 h-[2.5px] rounded-full bg-[#8e653e]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Area */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Search Trigger */}
          <button
            type="button"
            aria-label="Search"
            className="rounded-full p-1.5 text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
          >
            <SearchIcon className="size-4.5" />
          </button>

          <Link
            to="/verify"
            className="text-xs font-medium text-[#334155] hover:text-[#0f172a] transition-colors"
          >
            Verify Certificate
          </Link>

          <Link
            to="/login"
            className="text-xs font-medium text-[#334155] hover:text-[#0f172a] transition-colors"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-md bg-[#8e653e] hover:bg-[#7b542e] text-white px-4 py-2 text-xs font-medium shadow-xs transition-colors"
          >
            <span>Register Now</span>
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Search"
            className="rounded-full p-1.5 text-[#334155] hover:bg-[#f1f5f9]"
          >
            <SearchIcon className="size-4" />
          </button>
          <Link
            to="/register"
            className="rounded bg-[#8e653e] px-2.5 py-1 text-[0.75rem] font-medium text-white"
          >
            Register
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
