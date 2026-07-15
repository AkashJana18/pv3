import type { PortfolioConfig, SocialLink } from "@/types/portfolio"
import { env } from "@/lib/env"

const optionalLinks: SocialLink[] = [
  {
    label: "Email",
    href: env.CONTACT_EMAIL ? `mailto:${env.CONTACT_EMAIL}` : "",
    handle: env.CONTACT_EMAIL,
  },
  {
    label: "LinkedIn",
    href: env.PROFILE_LINKEDIN_URL ?? "",
    sameAs: true,
  },
  {
    label: "X",
    href: env.PROFILE_X_URL ?? "",
    sameAs: true,
  },
  {
    label: "DEV.to",
    href: env.PROFILE_DEVTO_URL ?? "",
    handle: env.DEVTO_USERNAME ? `@${env.DEVTO_USERNAME}` : undefined,
    sameAs: true,
  },
  {
    label: "Medium",
    href: env.PROFILE_MEDIUM_URL ?? "",
    sameAs: true,
  },
].filter((link) => link.href)

export const portfolioConfig = {
  site: {
    name: "Akash Jana",
    title: "Akash Jana — Rust Engineer and Solana Developer",
    description:
      "Portfolio of Akash Jana, a Rust engineer and Solana developer building trading infrastructure, developer tools, and open-source software.",
    url: env.SITE_URL,
    locale: "en_US",
  },
  person: {
    name: "Akash Jana",
    givenName: "Akash",
    familyName: "Jana",
    username: env.GITHUB_USERNAME,
    role: "Rust Engineer · Solana Developer",
    summary:
      "Building high-performance trading infrastructure, developer tools, and open-source software. Currently exploring Solana security and low-latency systems.",
    location: "India",
    avatarUrl: "/okarun.jpg",
    resumeUrl: env.RESUME_URL,
  },
  about: [
    "I build systems where correctness, latency, and developer ergonomics matter. Most of my current work sits around Rust, Solana, trading infrastructure, and tools that make technical workflows sharper.",
    "Security is an active learning direction for me, especially in Solana programs and protocol design. I keep the portfolio focused on shipped work, open-source contributions, and the systems I am building now.",
  ],
  currentFocus: [
    "Building EdgeRunner",
    "Exploring Solana security",
    "Learning low-latency trading systems",
    "Looking for Rust and Solana engineering opportunities",
  ],
  experience: [
    {
      title: "Superteam Solana Fellowship",
      description: "Building and learning in the Solana ecosystem.",
    },
    {
      title: "Protocol Labs Dev Guild contributor",
      description: "Contributing to open developer tooling and community work.",
    },
    {
      title: "Former Community Manager at Storacha",
      description: "Supported developer/community operations.",
    },
    {
      title: "Devcon volunteer",
      description: "Helped support the Ethereum developer community event.",
    },
    {
      title: "Open-source contributor",
      description:
        "Maintaining and publishing experiments across Rust and Web3.",
    },
  ],
  socialLinks: [
    {
      label: "GitHub",
      href: `https://github.com/${env.GITHUB_USERNAME}`,
      handle: env.GITHUB_USERNAME,
      sameAs: true,
    },
    ...optionalLinks,
  ],
  github: {
    username: env.GITHUB_USERNAME,
    token: env.GITHUB_TOKEN,
    fallbackProjects: [
      {
        id: "edgerunner",
        name: "edgerunner",
        displayName: "EdgeRunner",
        description:
          "Rust-first trading infrastructure experiment focused on fast, reliable execution paths.",
        primaryLanguage: {
          name: "Rust",
          color: "#dea584",
        },
        topics: ["rust", "trading", "infrastructure"],
        stars: 0,
        forks: 0,
        url: "https://github.com/AkashJana18/edgerunner",
        homepageUrl: null,
        openGraphImageUrl: "/project-placeholder.svg",
      },
      {
        id: "perplab",
        name: "perplab",
        displayName: "PerpLab",
        description:
          "A mini Central Limit Order Book (CLOB) based perpetual futures exchange built in Rust.",
        primaryLanguage: {
          name: "TypeScript",
          color: "#3178c6",
        },
        topics: ["orderbook", "rust"],
        stars: 0,
        forks: 0,
        url: "https://github.com/AkashJana18/perplab",
        homepageUrl: null,
        openGraphImageUrl: "/project-placeholder.svg",
      },
      {
        id: "herdr-scratch",
        name: "herdr-scratch",
        displayName: "herdr-scratch",
        description:
          "Persistent scratchpads for Herdr, paving the way for floating utility panes.",
        primaryLanguage: {
          name: "Rust",
          color: "#dea584",
        },
        topics: ["cli", "herdr", "herdr-plugin", "rust", "scratchpad"],
        stars: 0,
        forks: 0,
        url: "https://github.com/AkashJana18/herdr-scratch",
        homepageUrl: null,
        openGraphImageUrl: "/project-placeholder.svg",
      },
      {
        id: "glyphix",
        name: "glyphix",
        displayName: "Glyphix",
        description: "GIF to ASCII terminal renderer CLI in Rust.",
        primaryLanguage: {
          name: "Rust",
          color: "#dea584",
        },
        topics: ["cli", "rust", "terminal-based"],
        stars: 1,
        forks: 0,
        url: "https://github.com/AkashJana18/glyphix",
        homepageUrl: "https://youtu.be/Fd0-qCSlU10?si=rOt4YK5eRtzltAYl",
        openGraphImageUrl: "/project-placeholder.svg",
      },
    ],
  },
  writing: {
    devToApiKey: env.DEVTO_API_KEY,
    devToUsername: env.DEVTO_USERNAME,
    mediumRssUrl: env.MEDIUM_RSS_URL,
    fallbackArticles: [],
  },
  external: {
    revalidateSeconds: 60 * 60 * 6,
  },
} satisfies PortfolioConfig
