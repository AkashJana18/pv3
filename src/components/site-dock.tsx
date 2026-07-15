"use client"

import { lazy, Suspense, useCallback, useEffect, useState } from "react"
import {
  BookOpen,
  BriefcaseBusiness,
  FolderGit2,
  GitPullRequest,
  House,
  Mail,
  Moon,
  SunMedium,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react"

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
const DOCK_SHORTCUT_HINT_KEY = "portfolio-dock-shortcut-hint-seen"
const THEME_WIPE_DURATION = 420

export function SiteDock() {
  const [activeSection, setActiveSection] = useState<PortfolioSectionId>("hero")
  const [dockHidden, setDockHidden] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [shortcutHint, setShortcutHint] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")
  const [themeWipe, setThemeWipe] = useState<Theme | null>(null)
  const [reducedAudio, setReducedAudio] = useState(false)
  const reduceMotion = useReducedMotion()

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
      setSoundEnabled(localStorage.getItem("sound") === "on")
      setDockHidden(localStorage.getItem(DOCK_VISIBILITY_KEY) === "true")
      setReducedAudio(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          window.matchMedia("(prefers-reduced-data: reduce)").matches
      )
    }, 0)

    return () => window.clearTimeout(initializePreferences)
  }, [])

  useEffect(() => {
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.38
      let nextSection: PortfolioSectionId = "hero"
      let nearestSectionTop = Number.NEGATIVE_INFINITY

      for (const item of portfolioNavigation) {
        const section = document.getElementById(item.id)

        if (
          section &&
          section.offsetTop <= scrollPosition &&
          section.offsetTop >= nearestSectionTop
        ) {
          nextSection = item.id
          nearestSectionTop = section.offsetTop
        }
      }

      setActiveSection((current) =>
        current === nextSection ? current : nextSection
      )
    }

    let frame = 0
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updateActiveSection)
    }

    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModifierShortcut = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()

      if (isModifierShortcut && key === "b") {
        event.preventDefault()
        const nextHidden = !dockHidden

        setDockHidden(nextHidden)
        localStorage.setItem(DOCK_VISIBILITY_KEY, String(nextHidden))

        if (!localStorage.getItem(DOCK_SHORTCUT_HINT_KEY)) {
          localStorage.setItem(DOCK_SHORTCUT_HINT_KEY, "true")
          setShortcutHint(
            nextHidden
              ? "Navigation dock hidden. Press Cmd/Ctrl + B to bring it back."
              : "Navigation dock shown. Press Cmd/Ctrl + B to hide it."
          )
        }

        return
      }

      if (isModifierShortcut && key === "k") {
        event.preventDefault()
        setPaletteOpen(true)
        return
      }

      if (event.key === "Escape") {
        if (paletteOpen) {
          setPaletteOpen(false)
          return
        }

        if (!dockHidden) {
          setDockHidden(true)
          localStorage.setItem(DOCK_VISIBILITY_KEY, "true")
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dockHidden, paletteOpen])

  useEffect(() => {
    if (!shortcutHint) {
      return
    }

    const timeout = window.setTimeout(() => setShortcutHint(null), 3600)

    return () => window.clearTimeout(timeout)
  }, [shortcutHint])

  const navigateToSection = useCallback(
    (sectionId: PortfolioSectionId) => {
      const section = document.getElementById(sectionId)

      if (!section) {
        return
      }

      setActiveSection(sectionId)
      window.history.replaceState(null, "", "#" + sectionId)
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
    if (reduceMotion) {
      applyTheme(nextTheme)
      setTheme(nextTheme)
      return
    }

    window.dispatchEvent(
      new CustomEvent("portfolio-theme-change", { detail: nextTheme })
    )
    setThemeWipe(nextTheme)
    window.setTimeout(() => {
      applyTheme(nextTheme)
      setTheme(nextTheme)
      setThemeWipe(null)
    }, THEME_WIPE_DURATION)
    playClick(soundEnabled && !reducedAudio)
  }, [reduceMotion, reducedAudio, soundEnabled, theme])

  const toggleSound = useCallback(() => {
    if (reducedAudio) {
      return
    }

    const nextEnabled = !soundEnabled

    localStorage.setItem("sound", nextEnabled ? "on" : "off")
    setSoundEnabled(nextEnabled)
    playClick(nextEnabled)
  }, [reducedAudio, soundEnabled])

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed top-1/2 right-[max(1rem,calc((100vw-48rem)/2-4.5rem))] z-50 hidden -translate-y-1/2 md:block">
        <motion.nav
          aria-hidden={dockHidden}
          aria-label="Site navigation"
          animate={{
            opacity: dockHidden ? 0 : 1,
            x: dockHidden ? 96 : 0,
          }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className="pointer-events-auto"
          inert={dockHidden}
        >
          <DockSurface
            activeSection={activeSection}
            disabled={dockHidden}
            onNavigate={navigateToSection}
            onToggleTheme={toggleTheme}
            orientation="desktop"
            theme={theme}
          />
        </motion.nav>
      </div>

      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-1/2 z-50 -translate-x-1/2 md:hidden">
        <motion.nav
          aria-hidden={dockHidden}
          aria-label="Site navigation"
          animate={{
            opacity: dockHidden ? 0 : 1,
            y: dockHidden ? 96 : 0,
          }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          className="pointer-events-auto"
          inert={dockHidden}
        >
          <DockSurface
            activeSection={activeSection}
            disabled={dockHidden}
            onNavigate={navigateToSection}
            onToggleTheme={toggleTheme}
            orientation="mobile"
            theme={theme}
          />
        </motion.nav>
      </div>

      <AnimatePresence>
        {themeWipe ? (
          <motion.div
            key={themeWipe}
            aria-hidden="true"
            initial={{ clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            transition={{
              duration: THEME_WIPE_DURATION / 1000,
              ease: "easeOut",
            }}
            className="pointer-events-none fixed inset-0 z-[80]"
            style={{
              backgroundColor: themeWipe === "dark" ? "#09090b" : "#fff",
            }}
          />
        ) : null}
        {shortcutHint ? (
          <motion.p
            key="dock-shortcut-hint"
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            className="fixed top-4 right-4 z-[60] max-w-xs rounded-xl border border-line bg-card px-3 py-2 text-sm text-muted-foreground shadow-lg"
          >
            {shortcutHint}
          </motion.p>
        ) : null}
      </AnimatePresence>

      {paletteOpen ? (
        <Suspense fallback={null}>
          <PortfolioCommandMenu
            soundEnabled={soundEnabled}
            theme={theme}
            onClose={() => setPaletteOpen(false)}
            onNavigate={navigateToSection}
            onToggleSound={toggleSound}
            onToggleTheme={toggleTheme}
          />
        </Suspense>
      ) : null}
    </MotionConfig>
  )
}

function DockSurface({
  activeSection,
  disabled,
  onNavigate,
  onToggleTheme,
  orientation,
  theme,
}: {
  activeSection: PortfolioSectionId
  disabled: boolean
  onNavigate: (sectionId: PortfolioSectionId) => void
  onToggleTheme: () => void
  orientation: DockOrientation
  theme: Theme
}) {
  const isDesktop = orientation === "desktop"

  return (
    <div
      className={cn(
        "flex border border-line bg-background/88 p-1.5 shadow-[0_12px_40px_color-mix(in_oklab,var(--foreground)_14%,transparent)] backdrop-blur-md",
        isDesktop
          ? "flex-col rounded-2xl"
          : "flex-row rounded-2xl shadow-[0_10px_32px_color-mix(in_oklab,var(--foreground)_18%,transparent)]"
      )}
    >
      {portfolioNavigation.map((item) => (
        <DockButton
          key={item.id}
          active={activeSection === item.id}
          disabled={disabled}
          item={item}
          orientation={orientation}
          onClick={() => onNavigate(item.id)}
        />
      ))}
      <span
        className={cn(
          "bg-line",
          isDesktop ? "mx-1 my-1 h-px" : "mx-1 my-1 w-px"
        )}
        aria-hidden="true"
      />
      <DockButton
        disabled={disabled}
        label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        orientation={orientation}
        onClick={onToggleTheme}
      >
        {theme === "dark" ? <SunMedium /> : <Moon />}
      </DockButton>
    </div>
  )
}

function DockButton({
  active = false,
  children,
  disabled,
  item,
  label,
  orientation,
  onClick,
}: {
  active?: boolean
  children?: React.ReactNode
  disabled: boolean
  item?: (typeof portfolioNavigation)[number]
  label?: string
  orientation: DockOrientation
  onClick: () => void
}) {
  const reduceMotion = useReducedMotion()
  const tooltip = label ?? item?.label ?? ""
  const tooltipId = "dock-tooltip-" + tooltip.toLowerCase().replace(/\s+/g, "-")

  return (
    <motion.button
      type="button"
      aria-current={active ? "location" : undefined}
      aria-describedby={tooltipId}
      aria-label={tooltip}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 460, damping: 24 }}
      className="group relative grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none"
      onClick={onClick}
    >
      {active ? (
        <motion.span
          layoutId={"dock-active-" + orientation}
          className="absolute inset-0 rounded-xl bg-foreground"
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        />
      ) : null}
      <span
        className={cn(
          "relative z-10 grid place-items-center",
          active && "text-background"
        )}
      >
        {item ? <NavigationIcon sectionId={item.id} /> : children}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute top-1/2 right-[calc(100%+0.65rem)] z-20 -translate-y-1/2 rounded-md border border-line bg-card px-2 py-1 text-xs whitespace-nowrap text-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none max-md:top-auto max-md:right-auto max-md:bottom-[calc(100%+0.65rem)] max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0"
      >
        {tooltip}
      </span>
    </motion.button>
  )
}

function NavigationIcon({ sectionId }: { sectionId: PortfolioSectionId }) {
  if (sectionId === "hero") {
    return <House className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "projects") {
    return <FolderGit2 className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "github-activity") {
    return <GitPullRequest className="size-4.5" aria-hidden="true" />
  }

  if (sectionId === "blog") {
    return <BookOpen className="size-4.5" aria-hidden="true" />
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

function playClick(enabled: boolean) {
  if (!enabled) {
    return
  }

  const AudioContextCtor =
    window.AudioContext ||
    (
      window as Window &
        typeof globalThis & {
          webkitAudioContext?: typeof AudioContext
        }
    ).webkitAudioContext

  if (!AudioContextCtor) {
    return
  }

  const context = new AudioContextCtor()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = "sine"
  oscillator.frequency.value = 540
  gain.gain.value = 0.015
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.035)
}
