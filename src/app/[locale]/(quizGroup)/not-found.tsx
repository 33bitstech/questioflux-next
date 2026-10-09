'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import styles from './not-found.module.scss'

export default function NotFound() {
    const t = useTranslations('notFoundPage')

    return (
        <main className={styles.content}>
            <p className={styles.code}>404</p>
            <h1>{t('title')}</h1>
            <p>{t('text')}</p>
            <nav>
                <Link href='/explore'>{t('explore')}</Link>
                <Link href='/'>{t('home')}</Link>
            </nav>
        </main>
    )
}
