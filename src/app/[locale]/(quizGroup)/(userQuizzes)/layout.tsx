import NavbarQuizgroup from '@/components/NavbarQuizgroup/navbar'
import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action';

interface IProps {
    children :ReactNode
    params: Promise<{ locale: string }>;
}

export default async function LayoutUserQuizzes({children, params}: IProps) {
    const {locale} = await params
    return (
        <div className={styles.content}>
            <nav className={styles.div_buttons_links}>
                <ContextualHeaderActions page='quiz' locale={locale}/>
            </nav>
            {children}
        </div>
    )
}
