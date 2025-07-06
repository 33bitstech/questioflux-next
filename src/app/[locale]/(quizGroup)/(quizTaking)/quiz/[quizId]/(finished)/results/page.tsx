import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import React from 'react'
import styles from './results.module.scss'
import { getTimeString } from '@/utils/FormatTime'
import {Link} from '@/i18n/navigation'

interface IProps{
    params: {
        quizId: string
    }
}

export default async function Results({params}:IProps) {
    const res = await getCookie('quizResults', {cookies});
    if (!res) {
        return <div>No results found.</div>;
    }
    const results = JSON.parse(res as string),
        {quizId} = await params

    console.log(results )
    const getResultsFormated = ()=>{
        const totalQuestions = results.userForLeaderBoard.score.split('/')[1],
            correctQuestions = results.userForLeaderBoard.result.correctAnswers.length,
            time = getTimeString(results.userForLeaderBoard.timing)
        return {totalQuestions, correctQuestions, time}
    }
    if(!quizId) return 
    return (
        <>
            <div className={styles.container_results}>
                <div className={styles.message_result}>
                    <h3>{results.message}</h3>
                </div>
                <div className={styles.results_values}>
                    <div className={styles.value}>
                        <h2>{getResultsFormated().totalQuestions}</h2>
                        <p>Question in total</p>
                    </div>
                    <div className={styles.value}>
                        <h2>{getResultsFormated().correctQuestions}</h2>
                        <p>Correct answers</p>
                    </div>
                    <div className={styles.value}>
                        <h2>{getResultsFormated().time}</h2>
                        <p>Time in total</p>
                    </div>
                </div>
            </div>
            <Link 
                href={`/quiz/${quizId}/lb`} 
                className={styles.link_leaderboard}
            >View leaderboard</Link>
            
        </>
    )
}
