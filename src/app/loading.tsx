export default function Loading() {
  return (
    <main className="mx-auto max-w-4xl border-x border-line p-4 sm:p-6">
      <div className="animate-pulse space-y-4" aria-label="Loading portfolio">
        <div className="h-8 w-48 rounded-lg bg-muted" />
        <div className="h-20 max-w-2xl rounded-lg bg-muted" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-56 rounded-xl bg-muted" />
          <div className="h-56 rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  )
}
