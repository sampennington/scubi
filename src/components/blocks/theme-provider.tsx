"use client"

type Theme = {
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

interface ThemeProviderProps {
  children: React.ReactNode
  theme: Theme
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const { primaryColor, secondaryColor, accentColor } = theme

  return (
    <div
      style={
        {
          "--primary": primaryColor,
          "--secondary": secondaryColor,
          "--accent": accentColor
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
