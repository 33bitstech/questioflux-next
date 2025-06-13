import NavbarQuizgroup from '@/components/NavbarQuizgroup/navbar'
import React, { ReactNode } from 'react'
import styles from './layout.module.scss'

export default function LayoutQuizGroup({children}: {children :ReactNode}) {
    return (
        <div className={styles.container}>
            <header>
                <NavbarQuizgroup/>
            </header>
            {children}
        </div>
    )
}
