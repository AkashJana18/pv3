"use client"

import { lazy, Suspense, useCallback, useEffect, useState } from "react"
import {
  BookOpen,
  BriefcaseBusiness,
  CircleUserRound,
  FolderGit2,
  GitPullRequest,
  House,
  Mail,
  Menu,
  Moon,
  Search,
  SunMedium,
  Target,
} from "lucide-react"
import { motion, MotionConfig, useReducedMotion } from "motion/react"

import {
  portfolioNavigation,
  type PortfolioSectionId,
} from "@/config/navigation"
import { cn } from "@/lib/utils"

const PortfolioCommandMenu = lazy(
  () => import("@/components/portfolio-command-menu")
)

type Theme = "light" | "dark"
type DockOrientation = "desktop" | "mobile"

const DOCK_VISIBILITY_KEY = "portfolio-dock-hidden"
const mobileSectionIds: PortfolioSectionId[] = [
  "hero",
  "github-activity",
  "projects",
  "experience",
]

export function SiteDock() {
  const [activeSection, setActiveSection] = useState<PortfolioSectionId>("hero")
  const [dockHidden, setDockHidden] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")
  const reduceMotion = useReducedMotion()

  const setDockVisibility = useCallback((visible: boolean) => {
    setDockHidden(!visible)
    localStorage.setItem(DOCK_VISIBILITY_KEY, String(!visible))
  }, [])

  useEffect(() => {
    const initializePreferences = window.setTimeout(() => {
      const savedTheme = localStorage.getItem("theme")
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
      const nextTheme =
        savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light"

      applyTheme(nextTheme)
      setTheme(nextTheme)
      setDockHidden(localStorage.getItem(DOCK_VISIBILITY_KEY) === "true")
    }, 0)

    return () => window.clearTimeout(initializePreferences)
  }, [])

  useEffect(() => {
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.38
      let nextSection: PortfolioSectionId = "hero"

      for (const item of portfolioNavigation) {
        const section = document.getElementById(item.id)

        if (section && section.offsetTop <= scrollPosition) {
          nextSection = item.id
        }
      }

      setActiveSection(nextSection)
    }

    const updateFromHash = () => {
      const hash = window.location.hash.slice(1) as PortfolioSectionId

      if (portfolioNavigation.some((item) => item.id === hash)) {
        setActiveSection(hash)
      }
    }

    let frame = 0
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updateActiveSection)
    }

    updateFromHash()
    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("hashchange", updateFromHash)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("hashchange", updateFromHash)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null

      if (target?.closest("input, textarea, [contenteditable='true']")) {
        return
      }

      const isModifierShortcut = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()

      if (isModifierShortcut && key === "b") {
        event.preventDefault()
        setDockVisibility(dockHidden)
        return
      }

      if (isModifierShortcut && key === "k") {
        event.preventDefault()
        setPaletteOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dockHidden, setDockVisibility])

  const navigateToSection = useCallback(
    (sectionId: PortfolioSectionId) => {
      const section = document.getElementById(sectionId)

      if (!section) {
        return
      }

      setActiveSection(sectionId)
      window.history.replaceState(null, "", `#${sectionId}`)
      section.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: sectionId === "footer" ? "end" : "start",
      })
    },
    [reduceMotion]
  )

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark"

    localStorage.setItem("theme", nextTheme)
    applyTheme(nextTheme)
    setTheme(nextTheme)
  }, [theme])

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed top-1/2 right-[max(1rem,calc((100vw-48rem)/2-4.5rem))] z-50 hidden -translate-y-1/2 md:block">
        <DockNavigation
          activeSection={activeSection}
          hidden={dockHidden}
          onNavigate={navigateToSection}
          onOpenPalette={() => setPaletteOpen(true)}
          onToggleTheme={toggleTheme}
          orientation="desktop"
          theme={theme}
        />
      </div>

      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-1/2 z-50 -translate-x-1/2 md:hidden">
        <DockNavigation
          activeSection={activeSection}
          hidden={dockHidden}
          onNavigate={navigateToSection}
          onOpenPalette={() => setPaletteOpen(true)}
          onToggleTheme={toggleTheme}
          orientation="mobile"
          theme={theme}
        />
      </div>

      {dockHidden ? (
        <motion.button
          type="button"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
          className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-50 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-card px-3 text-sm font-medium shadow-md transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:top-4 md:right-4 md:bottom-auto"
          onClick={() => setDockVisibility(true)}
        >
          <Menu className="size-4" aria-hidden="true" />
          Show navigation
        </motion.button>
      ) : null}

      {paletteOpen ? (
        <Suspense fallback={null}>
          <PortfolioCommandMenu
            theme={theme}
            onClose={() => setPaletteOpen(false)}
            onNavigate={navigateToSection}
            onToggleTheme={toggleTheme}
          />
        </Suspense>
      ) : null}
    </MotionConfig>
  )
}

function DockNavigation({
  activeSection,
  hidden,
  onNavigate,
  onOpenPalette,
  onToggleTheme,
  orientation,
  theme,
}: {
  activeSection: PortfolioSectionId
  hidden: boolean
  onNavigate: (sectionId: PortfolioSectionId) => void
  onOpenPalette: () => void
  onToggleTheme: () => void
  orientation: DockOrientation
  theme: Theme
}) {
  const isDesktop = orientation === "desktop"
  const items = isDesktop
    ? portfolioNavigation
    : portfolioNavigation.filter((item) => mobileSectionIds.includes(item.id))

  return (
    <motion.nav
      aria-hidden={hidden}
      aria-label="Site navigation"
      animate={{
        opacity: hidden ? 0 : 1,
        y: hidden && !isDesktop ? 96 : 0,
        x: hidden && isDesktop ? 96 : 0,
      }}
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
      className={cn("pointer-events-auto", hidden && "pointer-events-none")}
      inert={hidden}
    >
      <div
        className={cn(
          "flex border border-line bg-background/90 p-1.5 shadow-md backdrop-blur-md",
          isDesktop ? "flex-col rounded-2xl" : "flex-row rounded-2xl"
        )}
      >
        {items.map((item) => (
          <DockButton
            key={item.id}
            active={activeSection === item.id}
            label={item.label}
            orientation={orientation}
            onClick={() => onNavigate(item.id)}
          >
            <NavigationIcon sectionId={item.id} />
          </DockButton>
        ))}
        <span
          className={cn(
            "bg-line",
            isDesktop ? "mx-1 my-1 h-px" : "mx-1 my-1 w-px"
          )}
          aria-hidden="true"
        />
        <DockButton
          label="Open command menu"
          orientation={orientation}
          onClick={onOpenPalette}
        >
          <Search className="size-4.5" aria-hidden="true" />
        </DockButton>
        <DockButton
          label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          orientation={orientation}
          onClick={onToggleTheme}
        >
          {theme === "dark" ? (
            <SunMedium className="size-4.5" aria-hidden="true" />
          ) : (
            <Moon className="size-4.5" aria-hidden="true" />
          )}
        </DockButton>
      </div>
    </motion.nav>
  )
}

function DockButton({
  active = false,
  children,
  label,
  orientation,
  onClick,
}: {
  active?: boolean
  children: React.ReactNode
  label: string
  orientation: DockOrientation
  onClick: () => void
}) {
  const reduceMotion = useReducedMotion()
  const tooltipId = `dock-tooltip-${label.toLowerCase().replaceAll(" ", "-")}`

  return (
    <motion.button
      type="button"
      aria-current={active ? "location" : undefined}
      aria-describedby={tooltipId}
      aria-label={label}
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 460, damping: 24 }}
      className="group relative grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onClick={onClick}
    >
      {active ? (
        <motion.span
          layoutId={`dock-active-${orientation}`}
          className="absolute inset-0 rounded-xl bg-foreground"
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        />
      ) : null}
      <span className={cn("relative z-10", active && "text-background")}>
        {children}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute top-1/2 right-[calc(100%+0.65rem)] z-20 -translate-y-1/2 rounded-md border border-line bg-card px-2 py-1 text-xs whitespace-nowrap text-foreground opacity-0 shadow-md transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none max-md:top-auto max-md:right-auto max-md:bottom-[calc(100%+0.65rem)] max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0"
      >
        {label}
      </span>
    </motion.button>
  )
}

function NavigationIcon({ sectionId }: { sectionId: PortfolioSectionId }) {
  if (sectionId === "hero") {
    return <House className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "about") {
    return <CircleUserRound className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "github-activity") {
    return <GitPullRequest className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "projects") {
    return <FolderGit2 className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "blog") {
    return <BookOpen className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "currently") {
    return <Target className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "experience") {
    return <BriefcaseBusiness className="size-4.5" aria-hidden="true" />
  }

  return <Mail className="size-4.5" aria-hidden="true" />
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#09090b" : "#ffffff")
  window.dispatchEvent(
    new CustomEvent("portfolio-theme-change", { detail: theme })
  )
}
