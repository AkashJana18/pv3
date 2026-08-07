import { describe, expect, it } from "vitest"

import type { Fetcher } from "@/lib/http"
import {
  getLatestWritings,
  normalizeAndSortArticles,
  parseMediumFeed,
} from "@/lib/writings"
import type { ArticleLink } from "@/types/portfolio"

const mediumFeed = `
  <?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <item>
        <title><![CDATA[Building reliable programs]]></title>
        <link>https://medium.com/@example/reliable-programs</link>
        <pubDate>Fri, 07 Aug 2026 10:00:00 GMT</pubDate>
        <content:encoded><![CDATA[<p>A practical guide to reliable systems.</p>]]></content:encoded>
      </item>
    </channel>
  </rss>
`

describe("parseMediumFeed", () => {
  it("parses and sanitizes valid RSS items", () => {
    expect(parseMediumFeed(mediumFeed)[0]).toMatchObject({
      title: "Building reliable programs",
      description: "A practical guide to reliable systems.",
      platform: "Medium",
    })
  })

  it("returns an empty list for malformed XML", () => {
    expect(parseMediumFeed("<rss><channel><item>")).toEqual([])
  })
})

describe("getLatestWritings", () => {
  it("merges DEV.to and Medium responses newest-first", async () => {
    const fetcher: Fetcher = async (input) => {
      const url = String(input)

      if (url.includes("dev.to")) {
        return Response.json([
          {
            id: 1,
            title: "A DEV.to article",
            description: "A useful description",
            published_at: "2026-08-08T10:00:00Z",
            url: "https://dev.to/example/article",
          },
        ])
      }

      return new Response(mediumFeed, {
        headers: { "Content-Type": "application/rss+xml" },
      })
    }

    const result = await getLatestWritings({
      devToUsername: "example",
      mediumRssUrl: "https://medium.com/feed/@example",
      fallbackArticles: [],
      fetcher,
    })

    expect(result.source).toBe("live")
    expect(result.articles.map((article) => article.platform)).toEqual([
      "DEV.to",
      "Medium",
    ])
  })

  it("uses local fallback content when every upstream source fails", async () => {
    const fallbackArticles: ArticleLink[] = [
      {
        id: "fallback",
        title: "Saved writing",
        description: "Available during an outage",
        publishedAt: "2026-01-01T00:00:00Z",
        platform: "DEV.to",
        url: "https://dev.to/example/saved",
      },
    ]

    const result = await getLatestWritings({
      devToUsername: "example",
      mediumRssUrl: "https://medium.com/feed/@example",
      fallbackArticles,
      fetcher: async () => new Response("rate limited", { status: 429 }),
    })

    expect(result).toEqual({ articles: fallbackArticles, source: "fallback" })
  })
})

describe("normalizeAndSortArticles", () => {
  it("deduplicates tracking variants of the same URL", () => {
    const base: ArticleLink = {
      id: "1",
      title: "First",
      description: "",
      publishedAt: "2026-01-01T00:00:00Z",
      platform: "DEV.to",
      url: "https://example.com/post?utm_source=test",
    }
    const newer = {
      ...base,
      id: "2",
      publishedAt: "2026-02-01T00:00:00Z",
      url: "https://example.com/post",
    }

    expect(normalizeAndSortArticles([base, newer])).toEqual([newer])
  })
})
