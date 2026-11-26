import React from 'react'
import styles from './completed.module.scss'
import ShareContainer from '@/components/widgets/share-container'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server' // Importar
import { Metadata } from 'next'
import { getPublicQuiz } from '@/utils/publicQuiz'
import { getQuizKind } from '@/utils/quizKind'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale, quizId } = await params
    const [t, quiz] = await Promise.all([
        getTranslations({ locale, namespace: 'quizCompletedPage' }),
        getPublicQuiz(quizId),
    ])
    return {
        title: t('metadataTitle', { kind: getQuizKind(quiz) })
    }
}

export default async function CompletedPage({ params }: IProps) {
    const { quizId, locale } = await params;
    const [t, quiz] = await Promise.all([
        getTranslations({ locale, namespace: 'quizCompletedPage' }),
        getPublicQuiz(quizId),
    ])
    // torneio, história e teste: os textos usam o nome do formato, não "quiz"
    const kind = getQuizKind(quiz)

    return (
        <main className={styles.content}>
            <h2>{t('title', { kind })}</h2>
            <div className={styles.share}>
                <ShareContainer
                    quizId={quizId}
                    kind={kind}
                />
            </div>
            <nav className={styles.navigation_created}>
                <Link locale={locale} href={`/quiz/${quizId}`}>{t('viewQuizButton', { kind })}</Link>
                <Link locale={locale} href={`/home`}>{t('homeButton')}</Link>
            </nav>
        </main>
    )
}