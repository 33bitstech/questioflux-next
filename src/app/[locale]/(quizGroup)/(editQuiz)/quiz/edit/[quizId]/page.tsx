import React from 'react'
import styles from '../../../../(createQuiz)/create/quiz/cover/cover.module.scss'
import FormEditQuiz from '@/components/EditingQuiz/form-edit-quiz'
import IQuizes from '@/interfaces/IQuizes'
import { env } from '@/env'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'

// Atualizar IProps para incluir locale
interface IProps{
    params:Promise<{
        quizId: string,
        locale: string
    }>
}

async function getQuiz(quizId:string, token:string) : Promise<IQuizes|undefined|{err:any}> {
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_DOMAIN_FRONT}/api/quiz/${quizId}/auth`, {
            method: 'GET',
            headers:{
                "Authorization" : token
            }
        });
        const res = await response.json();
        if(res.message) return {err: res}
        return res.quiz;
    } catch (err: any) {
        console.log(err)
    }
}

export default async function EditingQuiz({params}:IProps) {
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'editQuizFlow.page' });
    const token = await getCookie('token', {cookies})
    const quiz = await getQuiz(quizId, `${token}`);

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