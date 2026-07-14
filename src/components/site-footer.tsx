import { portfolioConfig } from "@/config/portfolio"

export function SiteFooter() {
  return (
    <footer className="border-x border-t border-line px-4 py-8 text-sm text-muted-foreground sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {portfolioConfig.person.name}
        </p>
        <p className="font-mono text-xs">
          Built with Next.js, server-side data, and restrained motion.
        </p>
      </div>
    </footer>
  )
}
