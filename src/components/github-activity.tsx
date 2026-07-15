import { ArrowUpRight, GitPullRequest } from "lucide-react"

import type { GitHubPortfolio } from "@/types/github"
import { portfolioConfig } from "@/config/portfolio"
import { externalLinkProps, formatDate } from "@/lib/utils"
import { GitHubContributions } from "@/components/github-contributions"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/panel"

export function GitHubActivity({
  activity,
}: {
  activity: GitHubPortfolio["activity"]
}) {
  const contributions = activity.calendar.weeks.flatMap((week) => week)

  return (
    <Panel id="github-activity">
      <PanelHeader>
        <PanelTitle>GitHub activity</PanelTitle>
      </PanelHeader>
      <PanelContent className="p-0">
        <div className="border-b border-line px-4 py-3 sm:px-5">
          {contributions.length ? (
            <GitHubContributions
              contributions={contributions}
              githubProfileUrl={`https://github.com/${portfolioConfig.github.username}`}
            />
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-medium">No public contributions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                GitHub activity will appear here when it is available.
              </p>
            </div>
          )}
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
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transition-none"
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
