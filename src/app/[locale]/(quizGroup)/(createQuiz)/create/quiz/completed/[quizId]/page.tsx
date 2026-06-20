import React from 'react'
import styles from './completed.module.scss'
import ShareContainer from '@/components/widgets/share-container'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server' // Importar
import { Metadata } from 'next'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'quizCompletedPage' });
    return {
        title: t('metadataTitle')
    }
}

export default async function CompletedPage({ params }: IProps) {
    const { quizId, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quizCompletedPage' });

    return (
        <main className={styles.content}>
            <h2>{t('title')}</h2>
            <div className={styles.share}>
                <ShareContainer
                    quizId={quizId}
                />
            </div>
            <nav className={styles.navigation_created}>
                <Link locale={locale} href={`/quiz/${quizId}`}>{t('viewQuizButton')}</Link>
                <Link locale={locale} href={`/home`}>{t('homeButton')}</Link>
            </nav>
        </main>
    )
}