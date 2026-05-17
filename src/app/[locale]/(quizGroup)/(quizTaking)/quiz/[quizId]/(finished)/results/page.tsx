import { cookies } from 'next/headers'
import React from 'react'
import styles from './results.module.scss'
import { getTimeString } from '@/utils/FormatTime'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server' // Importar
import GoogleAd from '@/components/Google/GoogleAd'
import { getLeaderboard, getQuiz } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/leaderboard/page'
import ButtonSeeScore from '@/components/Leaderboard/button-see-score'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export default async function Results({ params }: IProps) {
    const { quizId, locale } = await params;

    const [t, cookieStore, leaderboard, quiz] = await Promise.all([
        getTranslations({ locale, namespace: 'quizResultsPage.results' }),
        cookies(),
        getLeaderboard(quizId),
        getQuiz(quizId)
    ])
    const rawCookie = cookieStore.get('quizResults')?.value;

    if (!rawCookie) {
        return <div>{t('noResults')}</div>;
    }

    let results;
    try {
        results = JSON.parse(decodeURIComponent(rawCookie));
    } catch (error) {
        console.error("[Results Page] Falha ao fazer o parse do cookie de resultados:", error);
        return <div>{t('noResults')}</div>;
    }

    const getResultsFormated = () => {
        if (!results?.userForLeaderBoard?.score) {
            return { totalQuestions: 0, correctQuestions: 0, time: "00:00" };
        }

        const totalQuestions = results.userForLeaderBoard.score.split('/')[1];
        const correctQuestions = results.userForLeaderBoard.result.correctAnswers.length;
        const time = getTimeString(results.userForLeaderBoard.timing);
        
        return { totalQuestions, correctQuestions, time };
    }

    if (!quizId) return null; 

    return (
        <>
            <div className={styles.container_results}>
                <div className={styles.message_result}>
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

            <div className={styles.actions}>
                <ButtonSeeScore
                    className={styles.check_score}
                    leaderboard={leaderboard!}
                    quiz={quiz!}
                >
                    {t('viewAnswers')}
                </ButtonSeeScore>
                <Link
                    locale={locale}
                    href={`/quiz/${quizId}/lb`}
                    className={styles.link_leaderboard}
                >{t('viewLeaderboard')}</Link>
            </div>

            <GoogleAd slot='8751962602' />

        </>
    )
}