import NavbarQuizgroup from '@/components/NavbarQuizgroup/navbar'
import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action';


export default function LayoutUserQuizzes({children}: {children :ReactNode}) {
    return (
        <div className={styles.content}>
            <nav className={styles.div_buttons_links}>
                <ContextualHeaderActions page='quiz'/>
            </nav>
            {children}
        </div>
    )
}
