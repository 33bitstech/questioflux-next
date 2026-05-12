import React, { Suspense } from 'react'
import styles from './taking.module.scss'
import TakingComponent from '@/components/TakingQuiz/taking'
import { getQuiz } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/leaderboard/page'


interface IProps{
    params:Promise<{quizId: string}>
}

export default async function Taking({params}:IProps) {
    const {quizId} = await params
    const quiz = await getQuiz(quizId)
    console.log(quiz)
    return (
        <>
            {quiz && <Suspense>
                <TakingComponent
                    quiz={quiz}
                    styles={styles}
                />
            </Suspense>}

            

        </>
    )
}
