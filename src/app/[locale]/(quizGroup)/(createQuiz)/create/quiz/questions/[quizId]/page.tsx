import React from 'react'

import styles from './questions.module.scss'
import QuizContent from '@/components/CreatingQuiz/Questions/quiz-content'
import ApiData from '@/utils/ApiData'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { cookies } from 'next/headers'

interface IProps {
    params:Promise<{
        quizId: string
    }>
}

// Se a consulta falhar o fluxo segue normal, só sem a pergunta de privacidade.
async function isQuizPrivate(quizId: string): Promise<boolean> {
    try {
        const cookieStore = await cookies()

        const response = await ApiData({
            path: `quiz/edit/${quizId}`,
            method: 'GET',
            headerKey: 'Cookie',
            headerValue: getCookieHeader(cookieStore.getAll()),
            cache: { cache: 'no-store' },
        })

        if (!response.ok) return false

        const res = await response.json()
        return res?.quiz?.isPrivate === true
    } catch {
        return false
    }
}

export default async function QuestionsPage({params} : IProps) {
    const {quizId} = await params
    const isPrivate = await isQuizPrivate(quizId)

    return (
        <main className={styles.content}>
            <QuizContent 
                styles={styles}
                quizId={quizId}
                isPrivate={isPrivate}
            />
        </main>
    )
}