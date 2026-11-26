import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ButtonBack from '@/components/widgets/button-back';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getPublicQuiz } from '@/utils/publicQuiz';
import { AdSenseLoader } from '@/components/Google/AdSenseScript';

export const metadata: Metadata = {
    title: 'Taking',
    robots: { index: false, follow: true }
};


interface IProps {
    children: ReactNode
    params: Promise<{ quizId: string, locale: string }>
}

export default async function LayoutTaking({children, params}: IProps) {
    const { quizId, locale } = await params
    // a mesma consulta das páginas (dividida na renderização); quiz inexistente: a página dá 404
    const [t, quiz] = await Promise.all([
        getTranslations({ locale, namespace: 'takingPage' }),
        getPublicQuiz(quizId),
    ])

    return (
        <main className={styles.content}>
            {/* quiz de quem assina o QuestioPlus: sem o script, sem anúncio nenhum */}
            {quiz && !quiz.adFree && <AdSenseLoader />}
            <div className={styles.top_actions}>
                <ButtonBack
                    styles={styles}
                />
                {/* a página do quiz (informações, comentários e ranking) */}
                <Link locale={locale} href={`/quiz/${quizId}`} className={styles.btn_back}>{t('viewQuiz')}</Link>
            </div>
            {children}
        </main>
    )
}
