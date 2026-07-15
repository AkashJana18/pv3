export const portfolioNavigation = [
  {
    id: "hero",
    label: "Home",
  },
  {
    id: "github-activity",
    label: "GitHub activity",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "blog",
    label: "Blog",
  },
  {
    id: "experience",
    label: "Experience",
  },
  {
    id: "footer",
    label: "Contact",
  },
] as const

export type PortfolioSectionId = (typeof portfolioNavigation)[number]["id"]
