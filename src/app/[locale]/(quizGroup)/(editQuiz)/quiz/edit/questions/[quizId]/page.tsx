import React from 'react'
import styles from '../../../../../(createQuiz)/create/quiz/questions/[quizId]/questions.module.scss'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import FormEditQuestions from '@/components/EditingQuiz/form-edit-questions'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { getCookieHeader } from '@/utils/getCookieHeader'

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
        title: `${t('metadataTitle')} - ${(quiz as IQuizes)?.title || ''}`
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
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>
            </div>

            <FormEditQuestions 
                styles={styles}
                quiz={quiz}
                quizId={quizId}
            />
        </main>
    )
}
