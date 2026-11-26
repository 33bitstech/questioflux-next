import React from 'react'
import styles from '../../../../(createQuiz)/create/quiz/cover/cover.module.scss'
import FormEditQuiz from '@/components/EditingQuiz/form-edit-quiz'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import { getTranslations } from 'next-intl/server'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import { getQuizKind } from '@/utils/quizKind'

interface IProps {
    params: Promise<{ quizId: string; locale: string }>
}

async function getQuiz(quizId: string, cookieHeader: string): Promise<IQuizes | undefined | { err: any }> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}/auth`, {
            method: 'GET',
            headers: { 'cookie': cookieHeader },
        });
        const res = await response.json();
        if (res.message) return { err: res }
        return res.quiz;
    } catch (err: any) {
        console.log(err)
    }
}

// torneio, história e teste: os textos usam o nome do formato, não "quiz"
const kindOf = (quiz: IQuizes | undefined | { err: any }) => quiz && !('err' in quiz) ? getQuizKind(quiz) : 'quiz'

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const { quizId, locale } = await params
    const cookieStore = await cookies()
    const [t, quiz] = await Promise.all([
        getTranslations({ locale, namespace: 'editQuizFlow.page' }),
        getQuiz(quizId, getCookieHeader(cookieStore.getAll())),
    ])
    return { title: t('title', { kind: kindOf(quiz) }) }
}

export default async function EditingQuiz({ params }: IProps) {
    const { quizId, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'editQuizFlow.page' });
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())
    const quiz = await getQuiz(quizId, cookieHeader);

    return (
        <main className={styles.content}>
            <div className={styles.subtitle_creations}>
                <h1>{t('title', { kind: kindOf(quiz) })}</h1>
                <p>{t('subtitle', { kind: kindOf(quiz) })}</p>
            </div>
            <FormEditQuiz styles={styles} quiz={quiz} />
        </main>
    )
}