import { siteConfig } from "@/config/site"
import type { ArticleLink, Project } from "@/types/portfolio"

export function getStructuredData({
  projects,
  articles,
}: {
  projects: Project[]
  articles: ArticleLink[]
}) {
  const ids = {
    website: `${siteConfig.site.url}/#website`,
    person: `${siteConfig.site.url}/#person`,
    profile: `${siteConfig.site.url}/#profile`,
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": ids.person,
      name: siteConfig.person.name,
      givenName: siteConfig.person.givenName,
      familyName: siteConfig.person.familyName,
      jobTitle: siteConfig.person.role,
      description: siteConfig.person.summary,
      image: new URL(
        siteConfig.person.portraitUrl,
        siteConfig.site.url
      ).toString(),
      url: siteConfig.site.url,
      sameAs: siteConfig.socialLinks
        .filter((link) => link.sameAs)
        .map((link) => link.href),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": ids.website,
      name: siteConfig.site.name,
      url: siteConfig.site.url,
      description: siteConfig.site.description,
      author: { "@id": ids.person },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": ids.profile,
      url: siteConfig.site.url,
      name: siteConfig.site.title,
      description: siteConfig.site.description,
      mainEntity: { "@id": ids.person },
    },
    ...projects.map((project) => ({
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: project.displayName,
      description: project.description,
      codeRepository: project.url,
      url: project.homepageUrl ?? project.url,
      programmingLanguage: project.primaryLanguage ?? undefined,
      author: { "@id": ids.person },
    })),
    ...articles.map((article) => ({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      url: article.url,
      author: { "@id": ids.person },
    })),
  ]
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c")
}
