import { cn } from "@/lib/utils"

export const H1 = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h1
      className={cn("font-bold font-heading text-5xl md:text-6xl", className)}
    >
      {children}
    </h1>
  )
}

export const H2 = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h2 className={cn("font-heading text-4xl md:text-5xl", className)}>
      {children}
    </h2>
  )
}

export const H3 = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h3 className={cn("font-heading text-3xl md:text-4xl", className)}>
      {children}
    </h3>
  )
}

export const H4 = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h4 className={cn("font-heading text-2xl md:text-3xl", className)}>
      {children}
    </h4>
  )
}

export const P = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <p className={cn("font-body text-base md:text-lg", className)}>
      {children}
    </p>
  )
}

export const A = ({
  children,
  className,
  href
}: {
  children: React.ReactNode
  className?: string
  href: string
}) => {
  return (
    <a className={cn("text-primary", className)} href={href}>
      {children}
    </a>
  )
}

export const Span = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <span className={cn("font-body", className)}>{children}</span>
}
