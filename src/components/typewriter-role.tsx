"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "motion/react"

const roles = [
  "Rust Engineer",
  "Solana Developer",
  "Open Source Contributor",
  "Solana Security Learner",
  "Trading Infrastructure Builder",
] as const

export function TypewriterRole() {
  const reduceMotion = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)
  const [visibleLength, setVisibleLength] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const role = roles[roleIndex]
  const visibleRole = reduceMotion ? roles[0] : role.slice(0, visibleLength)

  useEffect(() => {
    if (reduceMotion) {
      return
    }

    const complete = visibleLength === role.length
    const empty = visibleLength === 0
    const delay = complete && !deleting ? 1500 : deleting ? 30 : 55

    const timeout = window.setTimeout(() => {
      if (complete && !deleting) {
        setDeleting(true)
        return
      }

      if (empty && deleting) {
        setRoleIndex((current) => (current + 1) % roles.length)
        setDeleting(false)
        return
      }

      setVisibleLength((current) => current + (deleting ? -1 : 1))
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [deleting, reduceMotion, role.length, visibleLength])

  return (
    <p
      className="mt-1 font-mono text-xs text-muted-foreground sm:text-sm"
      aria-label={roles.join(", ")}
    >
      <span aria-hidden="true">{visibleRole}</span>
      <span className="typewriter-caret" aria-hidden="true" />
    </p>
  )
}
