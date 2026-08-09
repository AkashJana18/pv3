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

export const siteConfig: SiteConfig = {
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
      "Hi, I’m Akash—a full-stack developer building web products, developer tools, and trading infrastructure. I work across TypeScript and modern web stacks, with deeper systems experience in Rust and hands-on work in the Solana ecosystem.",
    location: "India",
    timeZone: "Asia/Kolkata",
    githubUsername: env.githubUsername,
    portraitUrl: "/formal-me.jpg",
    resumeUrl: env.resumeUrl,
  },
  summary: [
    [
      { text: "I’ve earned " },
      {
        text: "$7.2k+ through open-source work and technical bounties",
        emphasis: true,
      },
      { text: "." },
    ],
    [
      {
        text: "Currently building independently across web, trading infrastructure, and developer tooling.",
      },
    ],
    [
      { text: "Solana Fellow at " },
      {
        text: "Superteam",
        href: "https://superteam.fun/",
        emphasis: true,
      },
      {
        text: ", building and learning with the global Solana community.",
      },
    ],
    [
      { text: "Open-source contributor with " },
      {
        text: "Protocol Labs Dev Guild",
        href: "https://protocol.ai/",
        emphasis: true,
      },
      {
        text: ", working on developer tooling and community-led technical projects.",
      },
    ],
    [
      {
        text: "Previously supported developer and community operations at ",
      },
      {
        text: "Storacha",
        href: "https://storacha.network/",
        emphasis: true,
      },
      { text: "." },
    ],
    [
      {
        text: "I care about useful software, precise technical writing, and products that stay simple under pressure.",
      },
    ],
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
}
