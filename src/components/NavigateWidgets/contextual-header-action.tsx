import {Link} from '@/i18n/navigation'
import React from 'react'
import styles from './contextual-header-action.module.scss'
import ToggleFilterContainer from './filtersWidgets/toggle-filter-container'
import {getCookie} from 'cookies-next/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server' // 1. Importar

interface IProps {
    page: 'home' | 'explore' | 'quiz',
    locale: string
}

export default async function ContextualHeaderActions({page, locale} : IProps) {
    // 2. Buscar as traduções
    const t = await getTranslations({ locale, namespace: 'contextualHeader' });
    const token = await getCookie('token', {cookies})

    return (
        <div className={`${styles.nav_actions}`}>
            {/* 3. Usar as traduções */}
            <Link locale={locale} href={'/create/quiz'}>{t('createQuiz')}</Link>

            {page === 'home' && (
                <Link locale={locale} href={'/explore'}>{t('exploreQuizzes')}</Link>
            )}
            {page === 'explore' && (
                <ToggleFilterContainer styles={styles}/>
            )}
            {page === 'quiz' && token && (
                <Link locale={locale} href={'/home'}>{t('home')}</Link>
            )}
            {page === 'quiz' && !token && (
                <Link locale={locale} href={'/explore'}>{t('explore')}</Link>
            )}
        </div>
    )
}