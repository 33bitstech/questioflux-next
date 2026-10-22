import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import NavLink from '@/components/widgets/NavLink';
import { getPublicQuiz } from '@/utils/publicQuiz';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import QuizThumbnail from './quiz-thumbnail';
import { getQuizKind } from '@/utils/quizKind';

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

    // prova: o primeiro item é a correção (com a nota) em vez do resultado simples
    const isExam = getQuizKind(quiz) === 'exam'
    const isPersonality = getQuizKind(quiz) === 'personality'

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
                                href={isPersonality
                                    ? `/quiz/${quizId}/personality`
                                    : isExam ? `/quiz/${quizId}/review` : `/quiz/${quizId}/results`}
                                styles={styles}
                            >{isPersonality ? t('navYourResult') : isExam ? t('navReview') : t('navResults')}</NavLink>
                        </li>
                        <li>
                            {/* personalidade não tem ranking: o segundo item leva à distribuição dos resultados */}
                            <NavLink
                                replace
                                href={isPersonality ? `/quiz/${quizId}/leaderboard` : `/quiz/${quizId}/lb`}
                                styles={styles}
                            >{isPersonality ? t('navAllResults') : t('navLeaderboard')}</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            {children}
        </>
    )
}