export type ArticlePlatform = "DEV.to" | "Medium"

export type Article = {
  id: string
  title: string
  description: string
  publishedAt: string
  platform: ArticlePlatform
  tags: string[]
  coverImage?: string | null
  url: string
}

export type WritingResult = {
  articles: Article[]
}
