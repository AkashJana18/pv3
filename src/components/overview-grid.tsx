import { BriefcaseBusiness, Code2, Globe2, MapPin } from "lucide-react"

import { portfolioConfig } from "@/config/portfolio"
import { externalLinkProps } from "@/lib/utils"
import { Panel, PanelContent } from "@/components/panel"

const overviewItems = [
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

export function OverviewGrid() {
  return (
    <Panel>
      <h2 className="sr-only">Overview</h2>
      <PanelContent className="relative grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {overviewItems.map((item) => (
          <OverviewItem key={item.label} item={item} />
        ))}
        <div className="pointer-events-none absolute top-px bottom-0 left-1/2 -z-1 hidden w-px -translate-x-px bg-[linear-gradient(to_bottom,var(--line)_4px,transparent_2px)] bg-size-[1px_6px] bg-repeat-y sm:block" />
      </PanelContent>
    </Panel>
  )
}

function OverviewItem({ item }: { item: (typeof overviewItems)[number] }) {
  const Icon = item.icon
  const content = (
    <>
      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase">
          {item.label}
        </span>
        <span className="block truncate text-sm font-medium">{item.value}</span>
      </span>
    </>
  )

  if (item.href) {
    return (
      <a
        href={item.href}
        className="flex min-h-12 min-w-0 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        {...externalLinkProps}
      >
        {content}
      </a>
    )
  }

  return (
    <div className="flex min-h-12 min-w-0 items-center gap-3 rounded-xl px-2 py-2">
      {content}
    </div>
  )
}
