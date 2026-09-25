import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button, buttonVariants } from "@/components/ui/button"
import { primaryNav } from "@/lib/data/navigation"
import { siteConfig } from "@/lib/site"
import { MenuIcon, ShieldCheckIcon } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Open Navigation Menu"
          />
        }
      >
        <MenuIcon className="size-4" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[85vw] max-w-sm flex flex-col justify-between p-6">
        <div>
          <SheetHeader className="p-0 pb-6 border-b border-border/60 text-left">
            <SheetTitle className="flex items-center gap-2">
              <img
                src="/logo/logo.png"
                alt={siteConfig.name}
                className="size-7 rounded-full object-contain shrink-0"
              />
              <span className="font-heading text-lg font-semibold">
                {siteConfig.name}
              </span>
            </SheetTitle>
            <p className="eyebrow text-[0.65rem] text-muted-foreground mt-1">
              Navigation Menu
            </p>
          </SheetHeader>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 py-6">
            {primaryNav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center rounded-md px-3.5 py-2.5 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-secondary font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="flex flex-col gap-3 pt-6 border-t border-border/60">
          <Link
            to="/verify"
            onClick={() => setOpen(false)}
            className={buttonVariants({
              variant: "outline",
              className: "w-full justify-center gap-2 text-sm",
            })}
          >
            <ShieldCheckIcon className="size-4 text-brass" />
            Verify Certificate
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={buttonVariants({
                variant: "ghost",
                className: "w-full justify-center text-sm",
              })}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className={buttonVariants({
                variant: "default",
                className: "w-full justify-center text-sm",
              })}
            >
              Register
            </Link>
          </div>

          <p className="text-[0.7rem] text-center text-muted-foreground mt-2">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
