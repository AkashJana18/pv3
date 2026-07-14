"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto max-w-4xl border-x border-line p-4 sm:p-6">
      <div className="rounded-xl border border-line bg-card p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Portfolio failed to render.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
