'use client'
import React from 'react'

interface IProps{
    styles: Record<string, string>
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Overlay({styles, setMenuOpen}:IProps) {
    return (
        <div 
            className={styles.overlay}
            onClick={() => setMenuOpen(false)}
        ></div>
    )
}
