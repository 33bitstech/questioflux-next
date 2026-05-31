import {Link} from '@/i18n/navigation'
import React from 'react'
import styles from './contextual-header-action.module.scss'
import ToggleFilterContainer from './filtersWidgets/toggle-filter-container'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server' // 1. Importar

interface IProps {
    page: 'home' | 'explore' | 'quiz',
    locale: string
}

export default async function ContextualHeaderActions({page, locale} : IProps) {
    const t = await getTranslations({ locale, namespace: 'contextualHeader' });
    /* const cookieStore = await cookies();

    const isLoggedIn = cookieStore.get('logged_in')?.value; */

    return (
        <div className={`${styles.nav_actions}`}>
            <Link locale={locale} href={'/create/quiz'}>{t('createQuiz')}</Link>

            {page === 'home' && (
                <Link locale={locale} href={'/explore'}>{t('exploreQuizzes')}</Link>
            )}
            {page === 'explore' && (
                <ToggleFilterContainer styles={styles}/>
            )}
            {page === 'quiz' && (
                <Link locale={locale} href={'/explore'}>{t('explore')}</Link>
            )}
        </div>
    )
}