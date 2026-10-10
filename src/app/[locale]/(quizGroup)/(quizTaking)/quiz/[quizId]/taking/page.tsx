import React, { Suspense } from 'react'
import styles from './taking.module.scss'
import TakingComponent from '@/components/TakingQuiz/taking'
import { getPublicQuiz } from '@/utils/publicQuiz'
import { notFound } from 'next/navigation'
import TakingAd from '@/components/Google/TakingAds'

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
                    // com key: o elemento vem pronto do servidor e entra entre os filhos do
                    // componente; sem ela o React avisa de "lista sem key" em dev
                    adTop={<TakingAd key='ad-top' position='top' />}
                />
            </Suspense>
            <TakingAd position='bottom' />
        </>
    )
}
