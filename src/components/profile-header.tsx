import {
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  BriefcaseBusiness,
  Code2,
  Download,
  GitBranch,
  Globe2,
  Mail,
  MapPin,
  Rss,
  Send,
} from "lucide-react"

import { portfolioConfig } from "@/config/portfolio"
import { externalLinkProps } from "@/lib/utils"
import { GlowCardFrame, GlowCardGrid } from "@/components/glow-card-grid"
import { ThemeAvatar } from "@/components/theme-avatar"
import { TypewriterRole } from "@/components/typewriter-role"

const profileFacts = [
  {
    label: "Role",
    value: portfolioConfig.person.role,
    icon: BriefcaseBusiness,
  },
  {
    label: "Location",
    value: portfolioConfig.person.location,
    icon: MapPin,
  },
  {
    label: "GitHub",
    value: portfolioConfig.person.username,
    href: `https://github.com/${portfolioConfig.person.username}`,
    icon: Code2,
  },
  {
    label: "Site",
    value: new URL(portfolioConfig.site.url).hostname,
    href: portfolioConfig.site.url,
    icon: Globe2,
  },
]

export function ProfileHeader() {
  return (
    <section
      id="hero"
      className="screen-line-bottom grid overflow-hidden border-x border-line sm:grid-cols-[11rem_minmax(0,1fr)]"
    >
      <aside className="flex items-center gap-3 border-b border-line p-3 sm:flex-col sm:items-start sm:justify-between sm:border-r sm:border-b-0">
        <GlowCardGrid className="block w-auto" cardRadius={16}>
          <GlowCardFrame className="rounded-2xl">
            <ThemeAvatar className="z-[90] shrink-0" />
          </GlowCardFrame>
        </GlowCardGrid>
        <p className="max-w-24 font-mono text-[0.65rem] leading-4 tracking-[0.16em] text-muted-foreground uppercase">
          Available for engineering roles
        </p>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-line px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h1 className="name-shimmer text-3xl font-semibold tracking-tight sm:text-4xl">
              {portfolioConfig.person.name}
            </h1>
            <BadgeCheck
              className="size-4.5 text-muted-foreground"
              aria-label="Verified profile"
            />
          </div>
          <TypewriterRole />
        </header>

        <p className="px-4 py-3 text-sm leading-6 text-muted-foreground sm:px-5 sm:text-base">
          {portfolioConfig.person.summary}
        </p>

        <div className="grid border-y border-line sm:grid-cols-2">
          {profileFacts.map((fact) => (
            <ProfileFact key={fact.label} fact={fact} />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap gap-1.5">
            {portfolioConfig.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                title={link.label}
                className="grid size-9 place-items-center rounded-lg border border-line bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noreferrer noopener"
                    : undefined
                }
              >
                <SocialIcon label={link.label} />
              </a>
            ))}
          </div>
          {portfolioConfig.person.resumeUrl ? (
            <a
              href={portfolioConfig.person.resumeUrl}
              className="panel-link ml-auto"
              {...externalLinkProps}
            >
              Resume
              <Download className="size-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function ProfileFact({ fact }: { fact: (typeof profileFacts)[number] }) {
  const Icon = fact.icon
  const content = (
    <>
      <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
      <span className="min-w-0">
        <span className="block font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground uppercase">
          {fact.label}
        </span>
        <span className="block truncate text-sm font-medium">{fact.value}</span>
      </span>
    </>
  )

  const className =
    "flex min-w-0 items-center gap-2.5 px-4 py-2.5 transition-colors sm:px-5 [&:nth-child(odd)]:border-b [&:nth-child(odd)]:border-line sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:border-b sm:[&:nth-child(n+3)]:border-t sm:[&:nth-child(n+3)]:border-line"

  if (fact.href) {
    return (
      <a href={fact.href} className={className} {...externalLinkProps}>
        {content}
        <ArrowUpRight
          className="ml-auto size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </a>
    )
  }

  return <div className={className}>{content}</div>
}

function SocialIcon({ label }: { label: string }) {
  const className = "size-4"

  if (label === "GitHub") {
    return <GitBranch className={className} aria-hidden="true" />
  }
  if (label === "Email") {
    return <Mail className={className} aria-hidden="true" />
  }
  if (label === "LinkedIn") {
    return <AtSign className={className} aria-hidden="true" />
  }
  if (label === "X") {
    return <Send className={className} aria-hidden="true" />
  }

  return <Rss className={className} aria-hidden="true" />
}
