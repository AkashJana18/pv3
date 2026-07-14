import { describe, expect, it } from "vitest"

import type { Article } from "@/types/writing"
import { normalizeAndSortArticles, parseMediumFeed } from "@/lib/writing"

describe("writing normalization", () => {
  it("deduplicates by canonical URL and sorts newest first", () => {
    const articles: Article[] = [
      {
        id: "a",
        title: "Older",
        description: "Older",
        publishedAt: "2026-01-01T00:00:00.000Z",
        platform: "DEV.to",
        tags: [],
        url: "https://example.com/post?utm_source=x",
      },
      {
        id: "b",
        title: "Newer",
        description: "Newer",
        publishedAt: "2026-02-01T00:00:00.000Z",
        platform: "Medium",
        tags: [],
        url: "https://example.com/post",
      },
    ]

    expect(normalizeAndSortArticles(articles)).toEqual([articles[1]])
  })

  it("parses Medium RSS items", () => {
    const articles = parseMediumFeed(`
      <rss>
        <channel>
          <item>
            <title><![CDATA[Test Post]]></title>
            <link>https://medium.com/@akash/test-post</link>
            <pubDate>Mon, 01 Jun 2026 10:00:00 GMT</pubDate>
            <category>rust</category>
            <content:encoded><![CDATA[<p>Post excerpt</p><img src="https://miro.medium.com/test.png" />]]></content:encoded>
          </item>
        </channel>
      </rss>
    `)

    expect(articles[0]).toMatchObject({
      title: "Test Post",
      platform: "Medium",
      tags: ["rust"],
      coverImage: "https://miro.medium.com/test.png",
    })
  })
})
