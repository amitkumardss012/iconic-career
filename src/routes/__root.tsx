import * as React from "react"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  Link,
  useRouterState,
} from "@tanstack/react-router"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/sonner"
import { buttonVariants } from "@/components/ui/button"
import { createMetaTags } from "@/lib/seo"
import { ArrowLeftIcon, CompassIcon, AlertTriangleIcon, RotateCcwIcon } from "lucide-react"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#222a36" },
      ...createMetaTags(),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  notFoundComponent: RootNotFound,
  errorComponent: RootErrorComponent,
  component: RootComponent,
})

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s?.location?.pathname ?? "" })
  const isPortal = pathname.startsWith("/admin") || pathname.startsWith("/student")

  return (
    <RootDocument>
      {!isPortal && <Navbar />}

      <main className={isPortal ? "min-h-screen flex flex-col bg-[#f8fafc]" : "flex-1 flex flex-col pt-17"}>
        <Outlet />
      </main>

      {!isPortal && <Footer />}

      <Toaster position="bottom-right" richColors />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootNotFound() {
  return (
    <div className="container-site py-24 flex flex-1 items-center justify-center">
      <div className="mx-auto max-w-md text-center flex flex-col items-center gap-4 rounded-xl border border-border/80 bg-card p-8 sm:p-10 shadow-xs">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-brass">
          Error 404
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-foreground">
          Page Not Located
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The requested address could not be found in our public registry. It may have moved or been updated.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "gap-1.5 text-xs font-medium",
            })}
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to Home
          </Link>

          <Link
            to="/programs"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-1.5 text-xs font-medium",
            })}
          >
            <CompassIcon className="size-3.5 text-brass" />
            Explore Programs
          </Link>
        </div>
      </div>
    </div>
  )
}

function RootErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  React.useEffect(() => {
    console.error("System error boundary caught:", error)
  }, [error])

  return (
    <div className="container-site py-24 flex flex-1 items-center justify-center">
      <div className="mx-auto max-w-md text-center flex flex-col items-center gap-4 rounded-xl border border-border/80 bg-card p-8 sm:p-10 shadow-xs">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangleIcon className="size-6" />
        </div>
        <span className="eyebrow text-destructive text-xs">UNEXPECTED EXCEPTION</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
          System Interruption
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          An unexpected error interrupted this view. Our operational team has been notified. You can attempt to reload the view.
        </p>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "text-xs gap-1.5 font-medium cursor-pointer",
            })}
          >
            <RotateCcwIcon className="size-3.5" />
            Retry Action
          </button>
          <Link
            to="/"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "text-xs font-medium",
            })}
          >
            Return to Safety
          </Link>
        </div>
      </div>
    </div>
  )
}
