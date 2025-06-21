import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ContextualHeaderActions from '@/components/NavigateWidgets/contextual-header-action';
import { env } from '@/env';
import IQuizes from '@/interfaces/IQuizes';
import QuizPageImgContainer from '@/components/ImagesRender/quiz-page-img-render';
import NavLink from '@/components/widgets/NavLink';

interface IProps {
    children: ReactNode,
    params: {
        quizId: string
    }
}

async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET',
        });

        const res = await response.json();
        return res.quiz;

    } catch (err: any) {
        console.log(err)
    }
}

export default async function LayoutQuizGroup({children, params}: IProps) {
    const {quizId} = await params,
        quiz = await getQuiz(quizId)
    return (
        <main className={styles.content}>
            <ContextualHeaderActions page='quiz'/>

            <div className={styles.image_quiz_container}>
                {quiz && <QuizPageImgContainer quiz={quiz}/>}
            </div>

            <div className={styles.quiz_navigation}>
                <h1>{quiz && quiz.title}</h1>
                <nav className={styles.navbar_quiz}>
                    <NavLink styles={styles} href={`/quiz/${quizId}`}>Quiz info</NavLink>
                    <NavLink styles={styles} href={`/quiz/${quizId}/comments`}>Comments</NavLink>
                    <NavLink styles={styles} href={`/quiz/${quizId}/leaderboard`}>Leaderboard</NavLink>
                </nav>
            </div>
            {children}
        </main>
    )
}
