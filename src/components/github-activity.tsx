import { ArrowUpRight, GitPullRequest } from "lucide-react"

import type {
  GitHubContributionCalendar,
  GitHubPortfolio,
} from "@/types/github"
import { cn, externalLinkProps, formatDate } from "@/lib/utils"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/panel"

const contributionLevelClasses = [
  "bg-muted",
  "bg-muted-foreground/20",
  "bg-muted-foreground/40",
  "bg-muted-foreground/60",
  "bg-muted-foreground/80",
] as const

export function GitHubActivity({
  activity,
}: {
  activity: GitHubPortfolio["activity"]
}) {
  const monthMarkers = getMonthMarkers(activity.calendar)

  return (
    <Panel id="github-activity">
      <PanelHeader>
        <PanelTitle>GitHub activity</PanelTitle>
      </PanelHeader>
      <PanelContent className="p-0">
        <div className="border-b border-line px-4 py-3 sm:px-5">
          <p className="sr-only">
            {activity.calendar.totalContributions.toLocaleString("en")} GitHub
            contributions in the past year.
          </p>
          <div className="no-scrollbar overflow-x-auto">
            <div className="min-w-[634px]">
              <div className="relative mb-1.5 h-3.5 font-mono text-[0.6rem] text-muted-foreground">
                {monthMarkers.map((marker) => (
                  <span
                    key={marker.label + "-" + marker.weekIndex}
                    className="absolute"
                    style={{ left: marker.weekIndex * 12 }}
                  >
                    {marker.label}
                  </span>
                ))}
              </div>
              <div
                className="grid auto-cols-[0.625rem] grid-flow-col grid-rows-7 gap-0.5"
                aria-hidden="true"
              >
                {activity.calendar.weeks.flatMap((week) =>
                  week.map((day) => (
                    <span
                      key={day.date}
                      title={
                        day.count +
                        " contribution" +
                        (day.count === 1 ? "" : "s") +
                        " on " +
                        formatDate(day.date)
                      }
                      className={cn(
                        "size-2.5 rounded-[2px]",
                        contributionLevelClasses[day.level]
                      )}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-xs text-muted-foreground sm:px-5">
          <p className="font-mono">
            {activity.calendar.totalContributions.toLocaleString("en")}{" "}
            contributions in the past year
          </p>
          <ContributionLegend />
        </div>

        {activity.pullRequests.length ? (
          <div className="border-t border-line">
            <h3 className="px-4 pt-3 font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase sm:px-5">
              Latest merged pull requests
            </h3>
            <div className="mt-3 divide-y divide-line">
              {activity.pullRequests.slice(0, 4).map((pullRequest) => (
                <a
                  key={pullRequest.id}
                  href={pullRequest.url}
                  className="group flex min-w-0 items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-5"
                  {...externalLinkProps}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-muted text-muted-foreground">
                    <GitPullRequest className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {pullRequest.title}
                    </span>
                    <span className="mt-1 block truncate font-mono text-xs text-muted-foreground">
                      {pullRequest.repositoryName} · #{pullRequest.number} ·
                      merged {formatDate(pullRequest.mergedAt)}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </PanelContent>
    </Panel>
  )
}

function ContributionLegend() {
  return (
    <div className="ml-auto flex items-center gap-1" aria-hidden="true">
      <span>Less</span>
      {contributionLevelClasses.map((className, index) => (
        <span key={index} className={cn("size-2.5 rounded-[2px]", className)} />
      ))}
      <span>More</span>
    </div>
  )
}

function getMonthMarkers(calendar: GitHubContributionCalendar) {
  let previousMonth = ""

  return calendar.weeks.flatMap((week, weekIndex) => {
    const firstDay = week[0]

    if (!firstDay) {
      return []
    }

    const label = new Intl.DateTimeFormat("en", { month: "short" }).format(
      new Date(firstDay.date)
    )

    if (label === previousMonth) {
      return []
    }

    previousMonth = label

    return { label, weekIndex }
  })
}
