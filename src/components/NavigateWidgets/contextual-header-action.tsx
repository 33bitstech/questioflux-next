import {Link} from '@/i18n/navigation'
import styles from './contextual-header-action.module.scss'
import ToggleFilterContainer from './filtersWidgets/toggle-filter-container'
import { getTranslations } from 'next-intl/server'

interface IProps {
    page: 'home' | 'explore' | 'quiz',
    locale: string
}

export default async function ContextualHeaderActions({page, locale} : IProps) {
    const t = await getTranslations({ locale, namespace: 'contextualHeader' })
    const TAside = await getTranslations({ locale, namespace: 'navbar.asideMenu' });
    /* const cookieStore = await cookies();

    const isLoggedIn = cookieStore.get('logged_in')?.value; */

    return (
        <div className={`${styles.nav_actions}`}>
            <Link locale={locale} href={'/create/quiz'}>{t('createQuiz')}</Link>

            {page === 'home' && (
                <>
                    <Link locale={locale} href={'/explore'}>{t('exploreQuizzes')}</Link>
                    <Link locale={locale} href={`/drafts`}>{TAside('drafts')}</Link>
                </>
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