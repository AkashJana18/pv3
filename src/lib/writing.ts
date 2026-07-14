import { unstable_cache } from "next/cache"

import type { Article, ArticlePlatform, WritingResult } from "@/types/writing"
import { portfolioConfig } from "@/config/portfolio"
import { fetchWithTimeout } from "@/lib/fetch"

type DevToArticle = {
  id: number
  title: string
  description: string
  published_at: string
  tag_list: string[]
  cover_image: string | null
  social_image: string | null
  url: string
}

export const getLatestWriting = unstable_cache(
  async (): Promise<WritingResult> => {
    return getUncachedLatestWriting()
  },
  [
    "portfolio-writing",
    portfolioConfig.writing.devToUsername ?? "",
    portfolioConfig.writing.mediumRssUrl ?? "",
  ],
  {
    revalidate: portfolioConfig.external.revalidateSeconds,
  }
)

async function getUncachedLatestWriting(): Promise<WritingResult> {
  const [devTo, medium] = await Promise.all([
    getDevToArticles(),
    getMediumArticles(),
  ])

  const articles = normalizeAndSortArticles([...devTo, ...medium]).slice(0, 5)

  if (articles.length) {
    return {
      articles,
    }
  }

  const fallbackArticles = portfolioConfig.writing.fallbackArticles

  return {
    articles: fallbackArticles,
  }
}

export function normalizeAndSortArticles(articles: Article[]) {
  const byKey = new Map<string, Article>()

  for (const article of articles) {
    const key = normalizeArticleKey(article)
    const existing = byKey.get(key)

    if (!existing || article.publishedAt > existing.publishedAt) {
      byKey.set(key, article)
    }
  }

  return Array.from(byKey.values()).sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() -
      new Date(left.publishedAt).getTime()
  )
}

export function parseMediumFeed(xml: string): Article[] {
  return matchAll(xml, /<item>([\s\S]*?)<\/item>/g).flatMap((item, index) => {
    const title = decodeXml(stripCdata(getTag(item, "title"))).trim()
    const link = decodeXml(stripCdata(getTag(item, "link"))).trim()
    const date = new Date(decodeXml(stripCdata(getTag(item, "pubDate"))).trim())

    if (!title || !link || Number.isNaN(date.getTime())) {
      return []
    }

    const content =
      stripCdata(getTag(item, "content:encoded")) ||
      stripCdata(getTag(item, "description"))
    const description = stripHtml(decodeXml(content)).trim()
    const tags = matchAll(item, /<category>([\s\S]*?)<\/category>/g)
      .map((tag) => decodeXml(stripCdata(tag)).trim())
      .filter(Boolean)

    return {
      id: `medium-${link || index}`,
      title,
      description: truncate(description || title, 160),
      publishedAt: date.toISOString(),
      platform: "Medium",
      tags,
      coverImage: extractImage(content),
      url: link,
    }
  })
}

async function getDevToArticles(): Promise<Article[]> {
  const username = portfolioConfig.writing.devToUsername

  if (!username) {
    return []
  }

  try {
    const url = new URL("https://dev.to/api/articles")
    url.searchParams.set("username", username)
    url.searchParams.set("per_page", "6")

    const response = await fetchWithTimeout(url, {
      headers: portfolioConfig.writing.devToApiKey
        ? {
            "api-key": portfolioConfig.writing.devToApiKey,
          }
        : undefined,
      next: {
        revalidate: portfolioConfig.external.revalidateSeconds,
      },
    })

    if (!response.ok) {
      return []
    }

    const articles = ((await response.json()) as DevToArticle[]).map(
      normalizeDevToArticle
    )

    return articles
  } catch {
    return []
  }
}

async function getMediumArticles(): Promise<Article[]> {
  const rssUrl = portfolioConfig.writing.mediumRssUrl

  if (!rssUrl) {
    return []
  }

  try {
    const response = await fetchWithTimeout(rssUrl, {
      next: {
        revalidate: portfolioConfig.external.revalidateSeconds,
      },
    })

    if (!response.ok) {
      return []
    }

    const articles = parseMediumFeed(await response.text())

    return articles
  } catch {
    return []
  }
}

function normalizeDevToArticle(article: DevToArticle): Article {
  return {
    id: `devto-${article.id}`,
    title: article.title,
    description: article.description,
    publishedAt: new Date(article.published_at).toISOString(),
    platform: "DEV.to",
    tags: article.tag_list,
    coverImage: article.cover_image ?? article.social_image,
    url: article.url,
  }
}

function normalizeArticleKey(article: Article) {
  try {
    const url = new URL(article.url)
    url.search = ""
    url.hash = ""

    return url.toString().toLowerCase()
  } catch {
    return `${article.platform}:${article.title}`.toLowerCase()
  }
}

function getTag(xml: string, tag: string) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = new RegExp(
    `<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`
  ).exec(xml)

  return match?.[1] ?? ""
}

function extractImage(html: string) {
  const media =
    /<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["'][^>]*>/i.exec(
      html
    )?.[1] ?? /<img[^>]+src=["']([^"']+)["'][^>]*>/i.exec(html)?.[1]

  return media ? decodeXml(media) : null
}

function stripCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "")
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trim()}…`
}

function matchAll(value: string, regex: RegExp) {
  return Array.from(value.matchAll(regex), (match) => match[1] ?? "")
}

export function getWritingRssLinks() {
  const links: {
    title: string
    href: string
    platform: ArticlePlatform
  }[] = []

  if (portfolioConfig.writing.devToUsername) {
    links.push({
      title: "Akash Jana on DEV.to",
      href: `https://dev.to/feed/${portfolioConfig.writing.devToUsername}`,
      platform: "DEV.to",
    })
  }

  if (portfolioConfig.writing.mediumRssUrl) {
    links.push({
      title: "Akash Jana on Medium",
      href: portfolioConfig.writing.mediumRssUrl,
      platform: "Medium",
    })
  }

  return links
}
