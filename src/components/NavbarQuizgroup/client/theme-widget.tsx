'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function ThemeWidget() {
    const { theme, setTheme } = useTheme()
    const t = useTranslations('navbar.themeWidget')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <li id="themes">
            <button
                onClick={() => setTheme('light')}
                className={theme === 'light' ? 'active' : ''}
            >
                {t('light')}
            </button>

            <button
                onClick={() => setTheme('dark')}
                className={theme === 'dark' ? 'active' : ''}
            >
                {t('dark')}
            </button>
        </li>
    )
}