import "@/styles/globals.css"

import type { Metadata, Viewport } from "next"

import { portfolioConfig } from "@/config/portfolio"
import { fontVariables } from "@/lib/fonts"
import { getWritingRssLinks } from "@/lib/writing"
import { SiteDock } from "@/components/site-dock"
import { SiteFooter } from "@/components/site-footer"

const rssLinks = getWritingRssLinks()

const themeScript = String.raw`
  try {
    var saved = localStorage.getItem('theme');
    var dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (_) {}
`

export const metadata: Metadata = {
  metadataBase: new URL(portfolioConfig.site.url),
  title: {
    default: portfolioConfig.site.title,
    template: `%s — ${portfolioConfig.site.name}`,
  },
  description: portfolioConfig.site.description,
  applicationName: portfolioConfig.site.name,
  authors: [
    {
      name: portfolioConfig.person.name,
      url: portfolioConfig.site.url,
    },
  ],
  creator: portfolioConfig.person.name,
  alternates: {
    canonical: "/",
    types: rssLinks.length
      ? {
          "application/rss+xml": rssLinks.map((link) => ({
            url: link.href,
            title: link.title,
          })),
        }
      : undefined,
  },
  openGraph: {
    title: portfolioConfig.site.title,
    description: portfolioConfig.site.description,
    url: "/",
    siteName: portfolioConfig.site.name,
    locale: portfolioConfig.site.locale,
    type: "profile",
    firstName: portfolioConfig.person.givenName,
    lastName: portfolioConfig.person.familyName,
    username: portfolioConfig.person.username,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${portfolioConfig.person.name} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: portfolioConfig.site.title,
    description: portfolioConfig.site.description,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#09090b",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {rssLinks.map((link) => (
          <link
            key={link.href}
            rel="alternate"
            type="application/rss+xml"
            title={link.title}
            href={link.href}
          />
        ))}
      </head>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <div
          className="noise fixed inset-0 -z-10 opacity-[0.22]"
          aria-hidden="true"
        />
        <div className="mx-auto w-full max-w-3xl overflow-x-clip px-2 pt-2 pb-24 md:pt-4 md:pb-0">
          {children}
          <SiteFooter />
        </div>
        <SiteDock />
      </body>
    </html>
  )
}
