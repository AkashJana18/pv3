"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { cn, externalLinkProps } from "@/lib/utils"

export function StarProjectButton({
  initialStars,
  repository,
  repositoryUrl,
  stars,
  onStarsChange,
}: {
  initialStars: number
  repository: string | null
  repositoryUrl: string
  stars: number
  onStarsChange: (stars: number) => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const [starred, setStarred] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const optimisticStarRef = useRef(false)

  const refreshStars = useCallback(async () => {
    if (!(repository && optimisticStarRef.current)) {
      return
    }

    try {
      const response = await fetch(
        `/api/github/stars?repository=${encodeURIComponent(repository)}`,
        { cache: "no-store" }
      )

      if (!response.ok) {
        throw new Error("GitHub star count is unavailable.")
      }

      const payload = (await response.json()) as { stars?: unknown }

      if (typeof payload.stars !== "number") {
        throw new Error("GitHub did not return a star count.")
      }

      onStarsChange(payload.stars)
      setStarred(payload.stars > initialStars)
      optimisticStarRef.current = false
    } catch {
      setStarred(false)
      onStarsChange(initialStars)
      optimisticStarRef.current = false
      setError("Couldn’t refresh the star count. It has been restored.")
    }
  }, [initialStars, onStarsChange, repository])

  useEffect(() => {
    const refreshOnReturn = () => {
      void refreshStars()
    }

    window.addEventListener("focus", refreshOnReturn)

    return () => window.removeEventListener("focus", refreshOnReturn)
  }, [refreshStars])

  if (!repository) {
    return (
      <a className="panel-link" href={repositoryUrl} {...externalLinkProps}>
        Star on GitHub
        <Star className="size-3.5" aria-hidden="true" />
      </a>
    )
  }

  return (
    <span className="flex flex-wrap items-center gap-2">
      <a
        className="panel-link active:translate-y-px"
        href={repositoryUrl}
        onClick={() => {
          if (starred) {
            return
          }

          setError(null)
          setStarred(true)
          optimisticStarRef.current = true
          onStarsChange(initialStars + 1)
        }}
        {...externalLinkProps}
        aria-label={starred ? `Starred ${repository}` : `Star ${repository}`}
      >
        <motion.span
          className={cn(
            "grid place-items-center",
            starred
              ? "text-yellow-500 dark:text-yellow-300"
              : "text-muted-foreground"
          )}
          animate={
            starred && !prefersReducedMotion
              ? { rotate: [0, -8, 0], scale: [1, 1.18, 1] }
              : { rotate: 0, scale: 1 }
          }
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 22,
            duration: prefersReducedMotion ? 0 : undefined,
          }}
          aria-hidden="true"
        >
          <Star
            className="size-3.5"
            fill={starred ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </motion.span>
        {starred ? "Starred" : "Star"}
        <span className="font-mono tabular-nums">{stars}</span>
      </a>
      {error ? (
        <span className="text-sm text-muted-foreground" role="status">
          {error}
        </span>
      ) : null}
    </span>
  )
}
