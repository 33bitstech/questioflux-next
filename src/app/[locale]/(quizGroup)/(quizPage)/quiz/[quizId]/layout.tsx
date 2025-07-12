import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action';
import { env } from '@/env';
import IQuizes from '@/interfaces/IQuizes';
import QuizPageImgContainer from '@/components/ImagesRender/quiz-page-img-render';
import NavLink from '@/components/widgets/NavLink';
import { getTranslations } from 'next-intl/server'; // Importar
import ScrollToTop from '@/components/scroll-auto';

interface IProps {
    children: ReactNode,
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET',
            cache: 'no-store'
        });
        const res = await response.json();
        return res.quiz;
    } catch (err: any) {
        console.log(err)
    }
}



export default async function LayoutQuizGroup({children, params}: IProps) {
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'quizLayout.nav' });
    const quiz = await getQuiz(quizId);

    return (
        <main className={styles.content}>

            <ScrollToTop />

            <ContextualHeaderActions page='quiz' locale={locale}/>

            <div className={styles.image_quiz_container}>
                {quiz && <QuizPageImgContainer quiz={quiz}/>}
            </div>

            <div className={styles.quiz_navigation}>
                <h1>{quiz && quiz.title}</h1>
                <nav className={styles.navbar_quiz}>
                    <NavLink styles={styles} href={`/quiz/${quizId}`}>{t('info')}</NavLink>
                    <NavLink styles={styles} href={`/quiz/${quizId}/comments`}>{t('comments')}</NavLink>
                    <NavLink styles={styles} href={`/quiz/${quizId}/leaderboard`}>{t('leaderboard')}</NavLink>
                </nav>
            </div>
            {children}
        </main>
    )
}