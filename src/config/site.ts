import { env } from "@/lib/env"
import type { SiteConfig, SocialLink } from "@/types/portfolio"

const optionalSocialLinks: SocialLink[] = [
  {
    label: "Email",
    href: env.contactEmail ? `mailto:${env.contactEmail}` : "",
    handle: env.contactEmail,
  },
  {
    label: "LinkedIn",
    href: env.linkedInUrl ?? "",
    sameAs: true,
  },
  {
    label: "X",
    href: env.xUrl ?? "",
    sameAs: true,
  },
  {
    label: "DEV.to",
    href: env.devToUrl ?? "",
    sameAs: true,
  },
  {
    label: "Medium",
    href: env.mediumUrl ?? "",
    sameAs: true,
  },
].filter((link) => Boolean(link.href))

export const siteConfig = {
  site: {
    name: "Akash Jana",
    title: "Akash Jana — Full-Stack Developer",
    description:
      "Portfolio of Akash Jana, a full-stack developer building web products, developer tools, and open-source software with TypeScript, Rust, and Solana.",
    url: env.siteUrl,
    locale: "en_IN",
  },
  person: {
    name: "Akash Jana",
    givenName: "Akash",
    familyName: "Jana",
    role: "Full-Stack Developer · Rust & Solana",
    summary:
      "I build practical, reliable products end to end—from interfaces and APIs to systems tooling. Rust and Solana are part of my toolkit, not the boundary of what I work on.",
    location: "India",
    timeZone: "Asia/Kolkata",
    githubUsername: env.githubUsername,
    portraitUrl: "/formal-me.jpg",
    resumeUrl: env.resumeUrl,
  },
  summary: [
    "Full-stack developer working across frontend, backend, infrastructure, and developer tooling.",
    "I work comfortably with TypeScript and modern web stacks, with deeper systems work in Rust and hands-on experience in the Solana ecosystem.",
    "I care about useful open-source software, precise technical writing, and products that stay simple under pressure.",
  ],
  experience: [
    {
      organization: "Independent",
      role: "Full-Stack Developer",
      period: "Current",
      description:
        "Building web products, trading infrastructure, and developer tools, using Rust and Solana where they are the right fit.",
    },
    {
      organization: "Superteam",
      organizationUrl: "https://superteam.fun/",
      role: "Solana Fellow",
      period: "Community",
      description:
        "Building and learning with the global Solana community through a focused fellowship.",
    },
    {
      organization: "Protocol Labs Dev Guild",
      organizationUrl: "https://protocol.ai/",
      role: "Open-source Contributor",
      period: "Community",
      description:
        "Contributing to open developer tooling and community-led technical work.",
    },
    {
      organization: "Storacha",
      organizationUrl: "https://storacha.network/",
      role: "Community Manager",
      period: "Former",
      description:
        "Supported developer and community operations for decentralized storage.",
    },
  ],
  socialLinks: [
    {
      label: "GitHub",
      href: `https://github.com/${env.githubUsername}`,
      handle: `@${env.githubUsername}`,
      sameAs: true,
    },
    ...optionalSocialLinks,
  ],
  fallbackProjects: [
    {
      id: "edgerunner",
      name: "edgerunner",
      displayName: "EdgeRunner",
      description:
        "Rust-first trading infrastructure focused on fast, reliable execution paths.",
      primaryLanguage: "Rust",
      topics: ["rust", "trading", "infrastructure"],
      stars: 0,
      forks: 0,
      url: "https://github.com/AkashJana18/edgerunner",
      homepageUrl: null,
    },
    {
      id: "perplab",
      name: "perplab",
      displayName: "PerpLab",
      description:
        "A compact central limit order book perpetual futures exchange built in Rust.",
      primaryLanguage: "TypeScript",
      topics: ["orderbook", "rust"],
      stars: 0,
      forks: 0,
      url: "https://github.com/AkashJana18/perplab",
      homepageUrl: null,
    },
    {
      id: "herdr-scratch",
      name: "herdr-scratch",
      displayName: "herdr-scratch",
      description:
        "Persistent scratchpads for Herdr, paving the way for floating utility panes.",
      primaryLanguage: "Rust",
      topics: ["cli", "rust"],
      stars: 0,
      forks: 0,
      url: "https://github.com/AkashJana18/herdr-scratch",
      homepageUrl: null,
    },
    {
      id: "glyphix",
      name: "glyphix",
      displayName: "Glyphix",
      description: "A GIF-to-ASCII terminal renderer written in Rust.",
      primaryLanguage: "Rust",
      topics: ["cli", "rust", "terminal"],
      stars: 1,
      forks: 0,
      url: "https://github.com/AkashJana18/glyphix",
      homepageUrl: "https://youtu.be/Fd0-qCSlU10?si=rOt4YK5eRtzltAYl",
    },
  ],
  fallbackArticles: [],
} satisfies SiteConfig
