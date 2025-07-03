import { getQuiz } from '@/app/(quizGroup)/(editQuiz)/quiz/edit/[quizId]/page'
import React from 'react'
import styles from './taking.module.scss'
import TakingComponent from '@/components/TakingQuiz/taking'


interface IProps{
    params:{quizId: string}
}

export default async function Taking({params}:IProps) {
    const {quizId} = params
    const quiz = await getQuiz(quizId)

    return (
        <>
            {quiz && <TakingComponent
                quiz={quiz}
                styles={styles}
            />}

        </>
    )
}
