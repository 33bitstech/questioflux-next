'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function ThemeWidget() {
    const { theme, resolvedTheme, setTheme } = useTheme()
    const t = useTranslations('navbar.themeWidget')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const currentTheme = theme === 'system' ? resolvedTheme : theme

    return (
        <li id="themes">
            <button
                onClick={() => setTheme('light')}
                className={currentTheme === 'light' ? 'active' : ''}
            >
                {t('light')}
            </button>

            <button
                onClick={() => setTheme('dark')}
                className={currentTheme === 'dark' ? 'active' : ''}
            >
                {t('dark')}
            </button>
        </li>
    )
}