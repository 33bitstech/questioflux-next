import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { Metadata } from 'next';
import ButtonBack from '@/components/widgets/button-back';
import { getQuiz } from '@/app/[locale]/(quizGroup)/(editQuiz)/quiz/edit/[quizId]/page';
import TimerContainer from '@/components/widgets/TakingQuiz/timer-container';
import Image from 'next/image';
import NavLink from '@/components/widgets/NavLink';

export const metadata: Metadata = {
    title: 'Taking'
};


interface IProps {
    children: ReactNode
    params:{
        quizId: string
    }
}

export default async function LayoutTaking({children, params}: IProps) {
    const {quizId} = await params,
        quiz = await getQuiz(quizId)

    if(!quiz) return
    return (
        <>
            <div className={styles.header_quiz}>
                <h1>{quiz?.title}</h1>

                <div className={styles.img_quiz_container}>
                    <Image
                        src={quiz?.quizThumbnail !== 'default' 
                            ? quiz?.quizThumbnail 
                            : '/imageQuizDefault.jpg'} 
                        alt="quiz image" 
                        width={800}
                        height={800}
                        quality={100}
                    />
                </div>

                <nav className={`${styles.navigate}`}>
                    <ul>
                        <li>
                            <NavLink 
                                href={`/quiz/${quizId}/results`} 
                                styles={styles}
                            >Results</NavLink>
                        </li>
                        <li>
                            <NavLink 
                                href={`/quiz/${quizId}/lb`} 
                                styles={styles}
                            >Leaderboard</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            {children}
        </>
    )
}
