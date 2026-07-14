import type {
  CreativeWork,
  Person,
  ProfilePage,
  SoftwareSourceCode,
  WebSite,
  WithContext,
} from "schema-dts"

import type { GitHubRepository } from "@/types/github"
import type { Article } from "@/types/writing"
import { portfolioConfig } from "@/config/portfolio"

const ids = {
  website: `${portfolioConfig.site.url}/#website`,
  person: `${portfolioConfig.site.url}/#person`,
  profile: `${portfolioConfig.site.url}/#profile`,
}

export function getStructuredData({
  projects,
  articles,
}: {
  projects: GitHubRepository[]
  articles: Article[]
}) {
  const person: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": ids.person,
    name: portfolioConfig.person.name,
    givenName: portfolioConfig.person.givenName,
    familyName: portfolioConfig.person.familyName,
    jobTitle: portfolioConfig.person.role,
    description: portfolioConfig.person.summary,
    image: portfolioConfig.person.avatarUrl,
    url: portfolioConfig.site.url,
    sameAs: portfolioConfig.socialLinks
      .filter((link) => link.sameAs)
      .map((link) => link.href),
  }

  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ids.website,
    name: portfolioConfig.site.name,
    url: portfolioConfig.site.url,
    description: portfolioConfig.site.description,
    author: {
      "@id": ids.person,
    },
  }

  const profilePage: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": ids.profile,
    url: portfolioConfig.site.url,
    name: portfolioConfig.site.title,
    description: portfolioConfig.site.description,
    mainEntity: {
      "@id": ids.person,
    },
  }

  const projectSchemas: WithContext<SoftwareSourceCode>[] = projects.map(
    (project) => ({
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: project.displayName ?? project.name,
      description: project.description,
      codeRepository: project.url,
      url: project.homepageUrl ?? project.url,
      programmingLanguage: project.primaryLanguage?.name,
      author: {
        "@id": ids.person,
      },
    })
  )

  const articleSchemas: WithContext<CreativeWork>[] = articles.map(
    (article) => ({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      url: article.url,
      author: {
        "@id": ids.person,
      },
    })
  )

  return [person, website, profilePage, ...projectSchemas, ...articleSchemas]
}
