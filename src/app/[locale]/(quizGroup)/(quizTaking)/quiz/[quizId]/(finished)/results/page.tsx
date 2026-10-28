import { cookies } from 'next/headers'
import React from 'react'
import styles from './results.module.scss'
import { getTimeString } from '@/utils/FormatTime'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server' // Importar
import GoogleAd from '@/components/Google/GoogleAd'
import AdRails from '@/components/Google/AdRails'
import { getLeaderboard } from '@/app/[locale]/(quizGroup)/(quizPage)/quiz/[quizId]/leaderboard/page'
import { getPublicQuiz } from '@/utils/publicQuiz'
import ButtonSeeScore from '@/components/Leaderboard/button-see-score'
import { getCookieHeader } from '@/utils/getCookieHeader'
import { readResultCookie, RESULT_COOKIE } from '@/utils/quizResultCookie'

interface IProps {
    params: Promise<{
        quizId: string,
        locale: string
    }>
}

export default async function Results({ params }: IProps) {
    const { quizId, locale } = await params;

    const cookieStore = await cookies()
    // com o cookie de login o ranking traz as respostas da própria pessoa ("Veja seu resultado")
    const cookieHeader = getCookieHeader(cookieStore.getAll())

    const [t, leaderboard, quiz] = await Promise.all([
        getTranslations({ locale, namespace: 'quizResultsPage.results' }),
        getLeaderboard(quizId, cookieHeader),
        getPublicQuiz(quizId)
    ])
    // só vale o resultado deste quiz; de outro quiz (ou sem cookie) não mostra nada
    const results = readResultCookie(cookieStore.get(RESULT_COOKIE)?.value, quizId)

    if (!results) {
        return <div>{t('noResults')}</div>;
    }

    const getResultsFormated = () => {
        const [correctQuestions = '0', totalQuestions = '0'] = results.score.split('/')
        return { totalQuestions, correctQuestions, time: getTimeString(results.timing) };
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
            {/* desktop: uma em cada lateral; no celular fica só o anúncio de cima */}
            <AdRails />

        </>
    )
}