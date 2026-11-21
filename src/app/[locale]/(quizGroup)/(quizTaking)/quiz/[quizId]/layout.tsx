import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ButtonBack from '@/components/widgets/button-back';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

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
    const t = await getTranslations({ locale, namespace: 'takingPage' })

    return (
        <main className={styles.content}>
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
