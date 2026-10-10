'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import styles from './embed.module.scss'

export default function NotFound() {
    const t = useTranslations('notFoundPage')

    return (
        <main className={`${styles.content} ${styles.not_found}`}>
            <h1>{t('title')}</h1>
            <p>{t('text')}</p>
            <Link href='/explore' target='_blank'>{t('explore')}</Link>
        </main>
    )
}
