import NavbarQuizgroup from '@/components/NavbarQuizgroup/navbar'
import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template:'%s | Quiz Vortex',
        default: 'Quiz Vortex'
    }
};

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
