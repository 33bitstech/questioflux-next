'use client'

import { ThemeProvider, ThemeProviderProps, useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function ThemeInitializer() {
    const { theme, resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        if (theme === 'system' && resolvedTheme) {
            setTheme(resolvedTheme)
        }
    }, [mounted, theme, resolvedTheme, setTheme])

    return null
}

export function ProviderTheme({ children, ...props }: ThemeProviderProps) {
    return (
        <ThemeProvider {...props}>
            <ThemeInitializer />
            {children}
        </ThemeProvider>
    )
}