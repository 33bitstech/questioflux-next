import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import React from 'react'
import styles from './results.module.scss'
import { getTimeString } from '@/utils/FormatTime'
import {Link} from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server' // Importar
import GoogleAd from '@/components/Google/GoogleAd'

// Atualizar IProps para incluir locale
interface IProps{
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export default async function Results({params}:IProps) {
    const {quizId, locale} = await params;
    const t = await getTranslations({ locale, namespace: 'quizResultsPage.results' });
    const res = await getCookie('quizResults', {cookies});

    if (!res) {
        return <div>{t('noResults')}</div>;
    }
    const results = JSON.parse(res as string);

    const getResultsFormated = ()=>{
        const totalQuestions = results.userForLeaderBoard.score.split('/')[1],
            correctQuestions = results.userForLeaderBoard.result.correctAnswers.length,
            time = getTimeString(results.userForLeaderBoard.timing)
        return {totalQuestions, correctQuestions, time}
    }

    if(!quizId) return null; // Retornar nulo se não houver quizId
    
    return (
        <>
            <div className={styles.container_results}>
                <div className={styles.message_result}>
                    {/* A mensagem de resultado é dinâmica, então não é traduzida aqui */}
                    <h3>{results.message}</h3>
                </div>
                <div className={styles.results_values}>
                    <div className={styles.value}>
                        <h2>{getResultsFormated().totalQuestions}</h2>
                        <p>{t('totalQuestions')}</p>
                    </div>
                    <div className={styles.value}>
                        <h2>{getResultsFormated().correctQuestions}</h2>
                        <p>{t('correctAnswers')}</p>
                    </div>
                    <div className={styles.value}>
                        <h2>{getResultsFormated().time}</h2>
                        <p>{t('totalTime')}</p>
                    </div>
                </div>
            </div>
            <Link 
                locale={locale}
                href={`/quiz/${quizId}/lb`} 
                className={styles.link_leaderboard}
            >{t('viewLeaderboard')}</Link>

            <GoogleAd/>
            
        </>
    )
}