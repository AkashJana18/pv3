import { cn } from "@/lib/utils"

export function Panel({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "screen-line-top screen-line-bottom overflow-hidden border-x border-line",
        className
      )}
      {...props}
    />
  )
}

export function PanelHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="panel-header"
      className={cn("screen-line-bottom px-4 py-4 sm:px-5", className)}
      {...props}
    />
  )
}

export function PanelTitle({
  className,
  children,
  count,
  ...props
}: React.ComponentProps<"h2"> & { count?: number }) {
  return (
    <h2
      data-slot="panel-title"
      className={cn(
        "text-2xl font-semibold tracking-tight text-balance sm:text-3xl",
        className
      )}
      {...props}
    >
      {children}
      {typeof count === "number" ? (
        <sup className="top-[-0.75em] ml-1 font-mono text-sm font-medium tracking-normal text-muted-foreground">
          ({count})
        </sup>
      ) : null}
    </h2>
  )
}

export function PanelDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="panel-description"
      className={cn(
        "mt-3 max-w-2xl text-sm leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function PanelContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-body"
      className={cn("p-4 sm:p-5", className)}
      {...props}
    />
  )
}

export function StripeDivider() {
  return (
    <div
      className="stripe-divider h-8 border-x border-line"
      aria-hidden="true"
    />
  )
}
