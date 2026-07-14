import { BadgeCheck } from "lucide-react"

import { portfolioConfig } from "@/config/portfolio"

export function ProfileHeader() {
  return (
    <section
      id="hero"
      className="screen-line-bottom grid overflow-hidden border-x border-line sm:grid-cols-[13rem_1fr]"
    >
      <div className="flex min-h-24 items-center gap-3 border-b border-line p-4 sm:min-h-0 sm:flex-col sm:items-stretch sm:justify-end sm:border-r sm:border-b-0">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-muted font-mono text-base font-semibold tracking-tight sm:size-16 sm:text-xl">
          AJ
        </div>
        <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Available for engineering roles
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 px-4 pt-4 sm:px-5">
          <h1 className="text-[2.45rem]/none font-semibold tracking-tight sm:text-5xl">
            {portfolioConfig.person.name}
          </h1>
          <BadgeCheck
            className="mt-1 size-5 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <p className="border-t border-line px-4 py-3 font-mono text-sm text-muted-foreground sm:px-5">
          {portfolioConfig.person.role}
        </p>
        <p className="screen-line-top px-4 py-4 text-base leading-7 text-muted-foreground sm:px-5 sm:text-lg">
          {portfolioConfig.person.summary}
        </p>
      </div>
    </section>
  )
}
