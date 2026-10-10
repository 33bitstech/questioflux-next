import React from 'react'
import styles from './embed.module.scss'
import takingStyles from '@/app/[locale]/(quizGroup)/(quizTaking)/quiz/[quizId]/taking/taking.module.scss'
import EmbedQuiz from '@/components/TakingQuiz/embed-quiz'
import { getPublicQuiz } from '@/utils/publicQuiz'
import { quizCanonicalUrl } from '@/utils/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface IProps {
    params: Promise<{ quizId: string }>
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { quizId } = await params
    const quiz = await getPublicQuiz(quizId)

    if (!quiz) notFound()

    return {
        title: quiz.title,
        // é o mesmo quiz de /quiz/[id]: quem aparece na busca é a página dele
        robots: { index: false, follow: true },
        alternates: {
            canonical: quizCanonicalUrl(quiz)
        }
    }
}

// Quiz para ser aberto em iframe no site de outra pessoa (o código sai do "Incorporar quiz"
// na página do quiz). Fica fora do (quizGroup) para não levar a navbar, e sem anúncios.
export default async function EmbedQuizPage({ params }: IProps) {
    const { quizId } = await params
    const quiz = await getPublicQuiz(quizId)

    if (!quiz) notFound()

    return (
        <main className={styles.content}>
            <EmbedQuiz
                quiz={quiz}
                styles={takingStyles}
            />
        </main>
    )
}
