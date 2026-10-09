import React, { Suspense } from 'react'
import styles from './taking.module.scss'
import TakingComponent from '@/components/TakingQuiz/taking'
import { getPublicQuiz } from '@/utils/publicQuiz'
import { notFound } from 'next/navigation'
import TakingAds from '@/components/Google/TakingAds'

interface IProps{
    params:Promise<{quizId: string}>
}

export default async function Taking({params}:IProps) {
    const {quizId} = await params
    const quiz = await getPublicQuiz(quizId)

    if (!quiz) notFound()

    return (
        <>
            <Suspense>
                <TakingComponent
                    quiz={quiz}
                    styles={styles}
                />
            </Suspense>
            <TakingAds />
        </>
    )
}
