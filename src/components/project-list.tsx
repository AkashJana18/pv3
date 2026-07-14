import Image from "next/image"
import { ArrowUpRight, ChevronDown, GitFork, Star } from "lucide-react"

import type { GitHubRepository } from "@/types/github"
import { externalLinkProps } from "@/lib/utils"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/panel"

export function ProjectList({
  repositories,
}: {
  repositories: GitHubRepository[]
}) {
  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle count={repositories.length}>Featured projects</PanelTitle>
      </PanelHeader>
      <PanelContent className="p-0">
        <div className="divide-y divide-line">
          {repositories.map((project, index) => (
            <details
              key={project.id}
              className="group/project"
              open={index < 2}
            >
              <summary className="flex min-w-0 cursor-pointer list-none items-center hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
                <div className="grid size-14 shrink-0 place-items-center sm:size-16">
                  <div className="grid size-8 place-items-center rounded-lg border border-line bg-muted font-mono text-xs font-semibold text-muted-foreground ring-1 ring-line ring-offset-1 ring-offset-background">
                    {(project.displayName ?? project.name).slice(0, 2)}
                  </div>
                </div>
                <div className="min-w-0 flex-1 border-l border-dashed border-line px-4 py-3">
                  <h3 className="truncate font-semibold tracking-tight">
                    {project.displayName ?? project.name}
                  </h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                <div className="hidden items-center gap-3 px-3 font-mono text-xs text-muted-foreground sm:flex">
                  {project.primaryLanguage?.name ? (
                    <span>{project.primaryLanguage.name}</span>
                  ) : null}
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5" aria-hidden="true" />
                    {project.stars}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="size-3.5" aria-hidden="true" />
                    {project.forks}
                  </span>
                </div>
                <ChevronDown className="mr-4 size-4 shrink-0 text-muted-foreground transition-transform group-open/project:rotate-180 motion-reduce:transition-none" />
              </summary>

              <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-[1fr_14rem] sm:p-5">
                <div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.primaryLanguage?.name ? (
                      <Tag>{project.primaryLanguage.name}</Tag>
                    ) : null}
                    {project.topics.map((topic) => (
                      <Tag key={topic}>{topic}</Tag>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      className="panel-link"
                      href={project.url}
                      {...externalLinkProps}
                    >
                      Repository
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                    {project.homepageUrl ? (
                      <a
                        className="panel-link"
                        href={project.homepageUrl}
                        {...externalLinkProps}
                      >
                        Demo
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="relative aspect-[1200/630] overflow-hidden rounded-xl border border-line bg-muted">
                  <Image
                    src={project.openGraphImageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="224px"
                    className="object-cover opacity-90 transition duration-300 group-hover/project:opacity-100 motion-reduce:transition-none"
                  />
                </div>
              </div>
            </details>
          ))}
        </div>
      </PanelContent>
    </Panel>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
      {children}
    </span>
  )
}
