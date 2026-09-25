import { Link } from "@tanstack/react-router"
import { footerGroups } from "@/lib/data/navigation"
import { siteConfig } from "@/lib/site"
import { ShieldCheckIcon, MailIcon, PhoneIcon, ClockIcon } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-paper-deep text-foreground">
      {/* Primary Footer Content */}
      <div className="container-site py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-4 lg:col-span-5 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo/logo.png"
                alt={siteConfig.name}
                className="size-8.5 rounded-full object-contain shrink-0"
              />
              <span className="font-heading text-xl font-semibold tracking-tight">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>

            {/* Quick Verification Banner */}
            <div className="mt-2 rounded-md border border-border/80 bg-background/60 p-3.5 max-w-sm">
              <div className="flex items-start gap-2.5">
                <ShieldCheckIcon className="size-4 text-brass shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-foreground">
                    Public Certificate Verification
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Organizations and academic evaluators can instantly verify issued credentials.
                  </p>
                  <Link
                    to="/verify"
                    className="text-xs font-medium text-primary hover:underline mt-0.5"
                  >
                    Verify a credential →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-3">
            <span className="eyebrow text-xs font-semibold">Company</span>
            <ul className="flex flex-col gap-2">
              {footerGroups.company.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-3">
            <span className="eyebrow text-xs font-semibold">Resources</span>
            <ul className="flex flex-col gap-2">
              {footerGroups.resources.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-3">
            <span className="eyebrow text-xs font-semibold">Inquiries & Hours</span>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MailIcon className="size-3.5 text-muted-foreground shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="size-3.5 text-muted-foreground shrink-0" />
                <span>{siteConfig.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <ClockIcon className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <span className="text-border">•</span>
              <a
                href={siteConfig.social.x}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                X / Twitter
              </a>
              <span className="text-border">•</span>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/70 py-6 text-xs text-muted-foreground">
        <div className="container-site flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerGroups.legal.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
