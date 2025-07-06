import React from 'react'
import styles from '../../../../../(createQuiz)/create/quiz/questions/[quizId]/questions.module.scss'
import FormEditQuiz from '@/components/EditingQuiz/form-edit-quiz'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import FormEditQuestions from '@/components/EditingQuiz/form-edit-questions'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface IProps{
    params:Promise<{
        locale:string
        quizId: string
    }>
}

export async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`, {
            method: 'GET'
        });

        const res = await response.json();
        return res.quiz;

    } catch (err: any) {
        console.log(err)
    }
}
export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale, quizId} = await params
    const t = await getTranslations({ locale, namespace: 'editQuizFlow.questionsPage' });
    const quiz = await getQuiz(quizId);
    return {
        // Título dinâmico para SEO: "Editar Perguntas - Nome do Quiz"
        title: `${t('metadataTitle')} - ${quiz?.title || ''}`
    }
}

export default async function EditingQuiz({params}:IProps) {
    const {quizId, locale} = await params,
        quiz = await getQuiz(quizId)

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
