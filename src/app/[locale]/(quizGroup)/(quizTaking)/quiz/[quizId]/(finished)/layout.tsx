import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import NavLink from '@/components/widgets/NavLink';
import { getPublicQuiz } from '@/utils/publicQuiz';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import QuizThumbnail from './quiz-thumbnail';

interface IProps {
    children: ReactNode,
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { locale, quizId } = await params;
    const t = await getTranslations({ locale, namespace: 'quizResultsPage.layout' });
    const quiz = await getPublicQuiz(quizId);

    if (!quiz) notFound()

    return {
        title: `${t('metadataTitle')} - ${quiz.title}`,
        robots: { index: false, follow: true }
    };
}

export default async function LayoutTaking({ children, params }: IProps) {
    const { quizId, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quizResultsPage.layout' });
    const quiz = await getPublicQuiz(quizId);

    if (!quiz) notFound()

    return (
        <>
            <div className={styles.header_quiz}>
                <h1>{quiz?.title}</h1>

                <div className={styles.img_quiz_container}>
                    <QuizThumbnail
                        src={quiz?.quizThumbnail !== 'default'
                            ? quiz?.quizThumbnail
                            : '/imageQuizDefault.jpg'}
                        alt={t('altQuizImage')}
                    />
                </div>

                <nav className={`${styles.navigate}`}>
                    <ul>
                        <li>
                            <NavLink
                                replace
                                href={`/quiz/${quizId}/results`}
                                styles={styles}
                            >{t('navResults')}</NavLink>
                        </li>
                        <li>
                            <NavLink
                                replace
                                href={`/quiz/${quizId}/lb`}
                                styles={styles}
                            >{t('navLeaderboard')}</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            {children}
        </>
    )
}