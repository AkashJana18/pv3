export const portfolioNavigation = [
  {
    id: "hero",
    label: "Home",
  },
  {
    id: "projects",
    label: "Projects",
  },
  {
    id: "github-activity",
    label: "Open Source",
  },
  {
    id: "writing",
    label: "Writing",
  },
  {
    id: "about",
    label: "About",
  },
  {
    id: "contact",
    label: "Contact",
  },
] as const

export type PortfolioSectionId = (typeof portfolioNavigation)[number]["id"]
