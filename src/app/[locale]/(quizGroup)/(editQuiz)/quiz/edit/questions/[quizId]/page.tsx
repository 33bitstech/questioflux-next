import React from 'react'
import styles from '../../../../../(createQuiz)/create/quiz/questions/[quizId]/questions.module.scss'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { getCookieHeader } from '@/utils/getCookieHeader'
import EditQuizContent from '@/components/EditingQuiz/edit-quiz-content'
import ExperienceEditor from '@/components/Experiences/experience-editor'
import { getQuizKind, isExperienceKind } from '@/utils/quizKind'

interface IProps{
    params:Promise<{
        locale:string
        quizId: string
    }>
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

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale, quizId} = await params
    const t = await getTranslations({ locale, namespace: 'editQuizFlow.questionsPage' });
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())
    const quiz = await getQuiz(quizId, cookieHeader)

    if ('err' in (quiz ?? {})) {
        return {
            title:"null"
        }
    }

    return {
        title: `${t('metadataTitle', { kind: getQuizKind(quiz as IQuizes) })} - ${(quiz as IQuizes)?.title || ''}`
    }
}

export default async function EditingQuiz({params}:IProps) {
    const {quizId, locale} = await params
    const cookieStore = await cookies()
    const cookieHeader = getCookieHeader(cookieStore.getAll())
    const quiz = await getQuiz(quizId, cookieHeader)    

    const t = await getTranslations({ locale, namespace: 'editQuizFlow.questionsPage' })
    
    return (
        <main className={styles.content}>
            <div className={styles.subtitle_questions}>
                <h1>{t('title', { kind: quiz && !('err' in quiz) ? getQuizKind(quiz) : 'quiz' })}</h1>
                <p>{t('subtitle', { kind: quiz && !('err' in quiz) ? getQuizKind(quiz) : 'quiz' })}</p>
            </div>

            {/* torneio, história, compatibilidade e pontuação: o editor de cada formato */}
            {quiz && !('err' in quiz) && isExperienceKind(getQuizKind(quiz)) ? (
                <ExperienceEditor
                    quizId={quizId}
                    kind={getQuizKind(quiz) as Parameters<typeof ExperienceEditor>[0]['kind']}
                    initial={quiz.experience}
                    isPrivate={quiz.isPrivate === true}
                    draft={quiz.draft !== false}
                    mode='edit'
                    premiumUnlocked={quiz.premiumUnlocked === true}
                />
            ) : (
                <EditQuizContent
                    styles={styles}
                    quiz={quiz}
                    quizId={quizId}
                />
            )}
        </main>
    )
}
