import React from 'react'

import styles from './questions.module.scss'
import QuizContent from '@/components/CreatingQuiz/Questions/quiz-content'

interface IProps {
    params:{
        quizId: string
    }
}

export default async function QuestionsPage({params} : IProps) {
    const {quizId} = await params

    return (
        <main className={styles.content}>
            <QuizContent 
                styles={styles}
                quizId={quizId}
            />
        </main>
    )
}