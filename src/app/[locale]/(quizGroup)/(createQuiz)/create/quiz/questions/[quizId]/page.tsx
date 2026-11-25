import React from 'react'

import styles from './questions.module.scss'
import QuizContent from '@/components/CreatingQuiz/Questions/quiz-content'
import ApiData from '@/utils/ApiData'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { cookies } from 'next/headers'
import { getQuizKind, isExperienceKind, QuizKind } from '@/utils/quizKind'
import ExperienceEditor from '@/components/Experiences/experience-editor'
import { IPersonalityResult } from '@/interfaces/IQuizes'

interface IProps {
    params:Promise<{
        quizId: string
    }>
}

// Se a consulta falhar o fluxo segue normal, só sem a pergunta de privacidade
// e como quiz comum (sem as explicações da prova).
async function getQuizSettings(quizId: string): Promise<{ isPrivate: boolean, kind: QuizKind, results?: IPersonalityResult[], experience?: unknown, draft?: boolean }> {
    try {
        const cookieStore = await cookies()

        const response = await ApiData({
            path: `quiz/edit/${quizId}`,
            method: 'GET',
            headerKey: 'Cookie',
            headerValue: getCookieHeader(cookieStore.getAll()),
            cache: { cache: 'no-store' },
        })

        if (!response.ok) return { isPrivate: false, kind: 'quiz' }

        const res = await response.json()
        return {
            isPrivate: res?.quiz?.isPrivate === true,
            kind: getQuizKind(res?.quiz),
            results: res?.quiz?.personalityResults,
            // torneio, história, compatibilidade e pontuação: o conteúdo já salvo
            experience: res?.quiz?.experience,
            draft: res?.quiz?.draft !== false,
        }
    } catch {
        return { isPrivate: false, kind: 'quiz' }
    }
}

export default async function QuestionsPage({params} : IProps) {
    const {quizId} = await params
    const { isPrivate, kind, results, experience, draft } = await getQuizSettings(quizId)

    if (isExperienceKind(kind)) {
        return (
            <main className={styles.content}>
                <ExperienceEditor quizId={quizId} kind={kind} initial={experience} isPrivate={isPrivate} draft={draft ?? true} mode='create' />
            </main>
        )
    }

    return (
        <main className={styles.content}>
            <QuizContent
                styles={styles}
                quizId={quizId}
                isPrivate={isPrivate}
                kind={kind}
                personalityResults={results}
            />
        </main>
    )
}
