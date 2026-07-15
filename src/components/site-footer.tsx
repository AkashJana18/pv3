import { portfolioConfig } from "@/config/portfolio"

export function SiteFooter() {
  return (
    <footer
      id="footer"
      className="border-x border-t border-line px-4 py-5 text-sm text-muted-foreground sm:px-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p>
            © {new Date().getFullYear()} {portfolioConfig.person.name}
          </p>
          <p className="mt-1 font-mono text-xs">
            Built with Next.js, server-side data, and restrained motion.
          </p>
        </div>
        <nav
          aria-label="Social links"
          className="flex flex-wrap gap-x-3 gap-y-2"
        >
          {portfolioConfig.socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-sm text-xs transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noreferrer noopener" : undefined
              }
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
