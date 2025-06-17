import { useTheme } from 'next-themes'
import React from 'react'

export default function ThemeWidget() {
    const {theme, setTheme} = useTheme()
    return (
        <li id='themes'>
            <button onClick={() => setTheme('light')} className={theme === 'light' ? 'active' : ''}>
                White
            </button>
            <button onClick={() => setTheme('dark')} className={theme === 'dark' ? 'active' : ''}>
                Dark
            </button>
        </li>
    )
}
