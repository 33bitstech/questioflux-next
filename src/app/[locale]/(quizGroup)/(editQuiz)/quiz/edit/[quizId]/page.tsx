import React from 'react'
import styles from '../../../../(createQuiz)/create/quiz/cover/cover.module.scss'
import FormEditQuiz from '@/components/EditingQuiz/form-edit-quiz'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

// Atualizar IProps para incluir locale
interface IProps{
    params:Promise<{
        quizId: string,
        locale: string
    }>
}

async function getQuiz(quizId:string) : Promise<IQuizes|undefined> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}`);
        const res = await response.json();
        return res.quiz;
    } catch (err: any) {
        console.log(err)
    }
}

export default async function EditingQuiz({params}:IProps) {
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'editQuizFlow.page' });
    const quiz = await getQuiz(quizId);

    return (
        <main className={styles.content}>
            <div className={styles.subtitle_creations}>
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>
            </div>

            <FormEditQuiz 
                styles={styles}
                quiz={quiz}
            />
        </main>
    )
}