import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action';
import QuizPageImgContainer from '@/components/ImagesRender/quiz-page-img-render';
import NavLink from '@/components/widgets/NavLink';
import { getTranslations } from 'next-intl/server'; // Importar
import ScrollToTop from '@/components/scroll-auto';
import { notFound } from 'next/navigation';
import { getPublicQuiz, withoutQuestions } from '@/utils/publicQuiz';
import { getQuizKind, hasLeaderboard } from '@/utils/quizKind';
import { AdSenseLoader } from '@/components/Google/AdSenseScript';

interface IProps {
    children: ReactNode,
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export default async function LayoutQuizGroup({ children, params }: IProps) {
    const { quizId, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'quizLayout.nav' });
    const quiz = await getPublicQuiz(quizId);

    if (!quiz) notFound()

    return (
        <main className={styles.content}>
            {/* quiz de quem assina o QuestioPlus: sem o script, sem anúncio nenhum */}
            {!quiz.adFree && <AdSenseLoader />}

            <ScrollToTop />

            <ContextualHeaderActions page='quiz' locale={locale} />

            <div className={styles.image_quiz_container}>
                <QuizPageImgContainer quiz={withoutQuestions(quiz)} />
            </div>

            <div className={styles.quiz_navigation}>
                <h1>{quiz.title}</h1>
                <nav className={styles.navbar_quiz}>
                    <NavLink replace styles={styles} href={`/quiz/${quizId}`}>{t('info', { kind: getQuizKind(quiz) })}</NavLink>
                    <NavLink replace styles={styles} href={`/quiz/${quizId}/comments`}>{t('comments')}</NavLink>
                    <NavLink replace styles={styles} href={`/quiz/${quizId}/leaderboard`}>
                        {/* sem ranking (personalidade e os formatos de experiência): a aba mostra os resultados */}
                        {hasLeaderboard(getQuizKind(quiz)) ? t('leaderboard') : t('results')}
                    </NavLink>
                </nav>
            </div>
            {children}
        </main>
    )
}