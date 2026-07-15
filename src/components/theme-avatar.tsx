"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type Theme = "light" | "dark"

const avatarImages: Record<Theme, { base: string; portrait: string }> = {
  light: {
    base: "/okarun.jpg",
    portrait: "/formal-me.jpg",
  },
  dark: {
    base: "/okarun-dark.jpg",
    portrait: "/formal-me-dark.jpg",
  },
}

const THEME_CHANGE_EVENT = "portfolio-theme-change"
const THEME_WIPE_DURATION = 420

export function ThemeAvatar({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [previousTheme, setPreviousTheme] = useState<Theme | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [readyPortraits, setReadyPortraits] = useState<
    Partial<Record<Theme, boolean>>
  >({})
  const [missingPortraits, setMissingPortraits] = useState<
    Partial<Record<Theme, boolean>>
  >({})
  const themeRef = useRef<Theme | null>(null)
  const transitionTimeoutRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const updateTheme = (nextTheme: Theme) => {
      const currentTheme = themeRef.current

      if (currentTheme && currentTheme !== nextTheme && !reduceMotion) {
        setPreviousTheme(currentTheme)
        if (transitionTimeoutRef.current) {
          window.clearTimeout(transitionTimeoutRef.current)
        }
        transitionTimeoutRef.current = window.setTimeout(
          () => setPreviousTheme(null),
          THEME_WIPE_DURATION
        )
      } else if (reduceMotion) {
        setPreviousTheme(null)
      }

      themeRef.current = nextTheme
      setTheme(nextTheme)
    }

    const setInitialTheme = window.setTimeout(() => {
      updateTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      )
    }, 0)

    const observer = new MutationObserver(() => {
      updateTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      )
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail
      if (nextTheme === "dark" || nextTheme === "light") {
        updateTheme(nextTheme)
      }
    }
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)

    return () => {
      window.clearTimeout(setInitialTheme)
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
      observer.disconnect()
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    }
  }, [reduceMotion])

  const markPortraitMissing = (imageTheme: Theme) => {
    setMissingPortraits((current) => ({ ...current, [imageTheme]: true }))
  }

  const loadPortrait = (imageTheme: Theme) => {
    if (readyPortraits[imageTheme] || missingPortraits[imageTheme]) {
      return
    }

    const image = new window.Image()
    image.onload = () => {
      setReadyPortraits((current) => ({ ...current, [imageTheme]: true }))
    }
    image.onerror = () => markPortraitMissing(imageTheme)
    image.src = avatarImages[imageTheme].portrait
  }

  return (
    <div
      className={cn(
        "group/avatar relative isolate size-32 overflow-hidden rounded-2xl border border-line bg-muted sm:size-36",
        className
      )}
      onPointerEnter={() => {
        setIsHovered(true)
        loadPortrait(theme ?? "light")
      }}
      onPointerLeave={() => setIsHovered(false)}
    >
      {theme ? (
        <>
          {previousTheme ? (
            <AvatarLayer
              decorative
              missingPortrait={missingPortraits[previousTheme]}
              portraitReady={readyPortraits[previousTheme]}
              theme={previousTheme}
              hovered={isHovered}
              reduceMotion={Boolean(reduceMotion)}
            />
          ) : null}
          <motion.div
            key={theme}
            initial={
              previousTheme && !reduceMotion
                ? { clipPath: "inset(0 0 0 100%)" }
                : false
            }
            animate={{ clipPath: "inset(0 0 0 0)" }}
            transition={{
              duration: THEME_WIPE_DURATION / 1000,
              ease: "easeOut",
            }}
            className="absolute inset-0"
          >
            <AvatarLayer
              missingPortrait={missingPortraits[theme]}
              portraitReady={readyPortraits[theme]}
              theme={theme}
              hovered={isHovered}
              reduceMotion={Boolean(reduceMotion)}
            />
          </motion.div>
        </>
      ) : (
        <>
          <AvatarLayer
            className="dark:hidden"
            missingPortrait={missingPortraits.light}
            portraitReady={readyPortraits.light}
            theme="light"
            hovered={isHovered}
            reduceMotion={Boolean(reduceMotion)}
          />
          <AvatarLayer
            className="hidden dark:block"
            missingPortrait={missingPortraits.dark}
            portraitReady={readyPortraits.dark}
            theme="dark"
            hovered={isHovered}
            reduceMotion={Boolean(reduceMotion)}
          />
        </>
      )}
    </div>
  )
}

function AvatarLayer({
  className,
  decorative = false,
  hovered,
  missingPortrait,
  portraitReady,
  reduceMotion,
  theme,
}: {
  className?: string
  decorative?: boolean
  hovered: boolean
  missingPortrait?: boolean
  portraitReady?: boolean
  reduceMotion: boolean
  theme: Theme
}) {
  const images = avatarImages[theme]

  return (
    <div className={cn("absolute inset-0", className)} aria-hidden={decorative}>
      <Image
        src={images.base}
        alt={decorative ? "" : "Akash Jana's avatar"}
        fill
        sizes="144px"
        className="object-cover"
      />
      {!missingPortrait && portraitReady ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images.portrait}
            alt=""
            aria-hidden="true"
            fill
            sizes="144px"
            className="object-cover"
          />
        </motion.div>
      ) : null}
    </div>
  )
}
