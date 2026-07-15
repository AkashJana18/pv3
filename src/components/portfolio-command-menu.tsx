"use client"

import { useEffect, useRef } from "react"
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  FolderGit2,
  GitPullRequest,
  House,
  Mail,
  Moon,
  Search,
  SunMedium,
  Volume2,
  VolumeX,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import {
  portfolioNavigation,
  type PortfolioSectionId,
} from "@/config/navigation"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

type Theme = "light" | "dark"

type PortfolioCommandMenuProps = {
  onClose: () => void
  onNavigate: (sectionId: PortfolioSectionId) => void
  onToggleSound: () => void
  onToggleTheme: () => void
  soundEnabled: boolean
  theme: Theme
}

export default function PortfolioCommandMenu({
  onClose,
  onNavigate,
  onToggleSound,
  onToggleTheme,
  soundEnabled,
  theme,
}: PortfolioCommandMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    dialog.showModal()

    const focusInput = window.setTimeout(() => inputRef.current?.focus(), 0)

    return () => {
      window.clearTimeout(focusInput)
      if (dialog.open) {
        dialog.close()
      }
      previousFocusRef.current?.focus()
    }
  }, [])

  const selectSection = (sectionId: PortfolioSectionId) => {
    onNavigate(sectionId)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      className="m-auto w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl border border-line bg-transparent p-0 text-foreground shadow-2xl backdrop:bg-background/70"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
      >
        <Command label="Portfolio commands">
          <div className="flex items-center border-b border-line px-1">
            <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
            <CommandInput
              ref={inputRef}
              placeholder="Search sections and actions…"
            />
          </div>
          <CommandList>
            <CommandEmpty>No matching command.</CommandEmpty>

            <CommandGroup heading="Navigate">
              {portfolioNavigation.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => selectSection(item.id)}
                >
                  <NavigationIcon sectionId={item.id} />
                  <span>{item.label}</span>
                  <ArrowUpRight className="ml-auto size-3.5" />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Appearance">
              <CommandItem
                value="Toggle theme"
                onSelect={() => {
                  onToggleTheme()
                  onClose()
                }}
              >
                {theme === "dark" ? <SunMedium /> : <Moon />}
                <span>
                  Switch to {theme === "dark" ? "light" : "dark"} theme
                </span>
              </CommandItem>
              <CommandItem
                value="Toggle click sounds"
                onSelect={() => {
                  onToggleSound()
                  onClose()
                }}
              >
                {soundEnabled ? <Volume2 /> : <VolumeX />}
                <span>{soundEnabled ? "Disable" : "Enable"} click sounds</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </motion.div>
    </dialog>
  )
}

function NavigationIcon({ sectionId }: { sectionId: PortfolioSectionId }) {
  if (sectionId === "hero") {
    return <House />
  }

  if (sectionId === "github-activity") {
    return <GitPullRequest />
  }

  if (sectionId === "blog") {
    return <BookOpen />
  }

  if (sectionId === "experience") {
    return <BriefcaseBusiness />
  }

  if (sectionId === "footer") {
    return <Mail />
  }

  return <FolderGit2 />
}
