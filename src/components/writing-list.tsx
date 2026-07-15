import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import type { WritingResult } from "@/types/writing"
import { externalLinkProps, formatDate } from "@/lib/utils"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/panel"

export function WritingList({ result }: { result: WritingResult }) {
  return (
    <Panel id="blog">
      <PanelHeader>
        <PanelTitle count={result.articles.length}>Latest blog posts</PanelTitle>
      </PanelHeader>
      <PanelContent className="p-0">
        {result.articles.length ? (
          <div className="divide-y divide-line">
            {result.articles.map((article) => (
              <article
                key={article.id}
                className="grid gap-4 p-4 transition-colors hover:bg-muted/50 sm:grid-cols-[6rem_1fr] sm:p-5"
              >
                {article.coverImage ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-muted sm:aspect-square">
                    <Image
                      src={article.coverImage}
                      alt=""
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="grid aspect-video place-items-center rounded-lg border border-line bg-muted font-mono text-xs text-muted-foreground sm:aspect-square">
                    {article.platform}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span>{article.platform}</span>
                    <span aria-hidden="true">/</span>
                    <time dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">
                    <a
                      href={article.url}
                      className="inline-flex items-center gap-1 rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      {...externalLinkProps}
                    >
                      {article.title}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {article.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <p className="rounded-xl border border-dashed border-line bg-muted/40 p-5 text-sm text-muted-foreground">
              No articles available right now.
            </p>
          </div>
        )}
      </PanelContent>
    </Panel>
  )
}
