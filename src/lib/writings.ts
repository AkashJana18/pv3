import { XMLParser } from "fast-xml-parser"
import { z } from "astro/zod"

import { fetchWithTimeout, safeHttpUrl, type Fetcher } from "@/lib/http"
import type { ArticleLink, WritingResult } from "@/types/portfolio"

const devToArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().default(""),
  published_at: z.string(),
  url: z.string(),
})

const devToResponseSchema = z.array(devToArticleSchema)

type WritingOptions = {
  devToUsername?: string | undefined
  devToApiKey?: string | undefined
  mediumRssUrl?: string | undefined
  fallbackArticles: ArticleLink[]
  fetcher?: Fetcher
  timeoutMs?: number
}

export async function getLatestWritings({
  devToUsername,
  devToApiKey,
  mediumRssUrl,
  fallbackArticles,
  fetcher = fetch,
  timeoutMs = 4500,
}: WritingOptions): Promise<WritingResult> {
  const [devTo, medium] = await Promise.all([
    fetchDevToArticles({
      username: devToUsername,
      apiKey: devToApiKey,
      fetcher,
      timeoutMs,
    }),
    fetchMediumArticles({ url: mediumRssUrl, fetcher, timeoutMs }),
  ])

  const articles = normalizeAndSortArticles([...devTo, ...medium]).slice(0, 6)

  return articles.length
    ? { articles, source: "live" }
    : { articles: fallbackArticles, source: "fallback" }
}

type DevToOptions = {
  username?: string | undefined
  apiKey?: string | undefined
  fetcher: Fetcher
  timeoutMs: number
}

async function fetchDevToArticles({
  username,
  apiKey,
  fetcher,
  timeoutMs,
}: DevToOptions): Promise<ArticleLink[]> {
  if (!username) return []

  try {
    const url = new URL("https://dev.to/api/articles")
    url.searchParams.set("username", username)
    url.searchParams.set("per_page", "8")

    const requestInit: RequestInit = apiKey
      ? { headers: { "api-key": apiKey } }
      : {}
    const response = await fetchWithTimeout(
      url,
      requestInit,
      timeoutMs,
      fetcher
    )

    if (!response.ok) return []

    const parsed = devToResponseSchema.safeParse(await response.json())
    if (!parsed.success) return []

    return parsed.data.flatMap((article) => {
      const articleUrl = safeHttpUrl(article.url)
      const publishedAt = new Date(article.published_at)
      if (!articleUrl || Number.isNaN(publishedAt.getTime())) return []

      return {
        id: `devto-${article.id}`,
        title: article.title.trim(),
        description: truncate(article.description.trim(), 180),
        publishedAt: publishedAt.toISOString(),
        platform: "DEV.to",
        url: articleUrl,
      } satisfies ArticleLink
    })
  } catch {
    return []
  }
}

type MediumOptions = {
  url?: string | undefined
  fetcher: Fetcher
  timeoutMs: number
}

async function fetchMediumArticles({
  url,
  fetcher,
  timeoutMs,
}: MediumOptions): Promise<ArticleLink[]> {
  const feedUrl = safeHttpUrl(url)
  if (!feedUrl) return []

  try {
    const response = await fetchWithTimeout(feedUrl, {}, timeoutMs, fetcher)
    return response.ok ? parseMediumFeed(await response.text()) : []
  } catch {
    return []
  }
}

export function parseMediumFeed(xml: string): ArticleLink[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      processEntities: false,
      trimValues: true,
    })
    const parsed = parser.parse(xml) as {
      rss?: { channel?: { item?: unknown | unknown[] } }
    }
    const rawItems = parsed.rss?.channel?.item
    const items = Array.isArray(rawItems)
      ? rawItems
      : rawItems
        ? [rawItems]
        : []

    return items.flatMap((raw, index) => normalizeMediumItem(raw, index))
  } catch {
    return []
  }
}

function normalizeMediumItem(raw: unknown, index: number): ArticleLink[] {
  if (!raw || typeof raw !== "object") return []

  const item = raw as Record<string, unknown>
  const title = asText(item.title).trim()
  const url = safeHttpUrl(asText(item.link))
  const publishedAt = new Date(asText(item.pubDate))
  const content = asText(item["content:encoded"] || item.description)

  if (!title || !url || Number.isNaN(publishedAt.getTime())) return []

  return [
    {
      id: `medium-${index}-${url}`,
      title,
      description: truncate(stripHtml(content), 180),
      publishedAt: publishedAt.toISOString(),
      platform: "Medium",
      url,
    },
  ]
}

function asText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value)
  }
  return ""
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trim()}…`
}

export function normalizeAndSortArticles(articles: ArticleLink[]) {
  const unique = new Map<string, ArticleLink>()

  for (const article of articles) {
    const key = normalizeArticleKey(article)
    const existing = unique.get(key)

    if (!existing || article.publishedAt > existing.publishedAt) {
      unique.set(key, article)
    }
  }

  return Array.from(unique.values()).sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() -
      new Date(left.publishedAt).getTime()
  )
}

function normalizeArticleKey(article: ArticleLink) {
  const url = new URL(article.url)
  url.search = ""
  url.hash = ""
  return url.toString().toLowerCase()
}
