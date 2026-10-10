'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import TakingComponent, { IQuizScore } from './taking'
import resultsStyles from '@/app/[locale]/(quizGroup)/(quizTaking)/quiz/[quizId]/(finished)/results/results.module.scss'
import { getTimeString } from '@/utils/FormatTime'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

interface IProps {
    styles: TStyles,
    quiz: IQuizes
}

// Quiz dentro de um iframe em outro site. Tudo acontece nesta página: navegar para
// /quiz/[id]/results traria a navbar do site e um resultado lido de cookie, que o
// navegador não guarda em iframe de terceiros. O que leva ao site abre em outra aba.
export default function EmbedQuiz({ quiz, styles }: IProps) {
    const [score, setScore] = useState<IQuizScore>()

    const t = useTranslations('quizResultsPage.results'),
        tEmbed = useTranslations('embedPage')

    const handleFinish = (quizScore: IQuizScore) => {
        setScore(quizScore)
        window.scrollTo({ top: 0 })
    }

    if (!score) return <TakingComponent quiz={quiz} styles={styles} onFinish={handleFinish} />

    const { userForLeaderBoard, message } = score

    return (
        <>
            <div className={styles.header_quiz}>
                <h1>{quiz.title}</h1>
            </div>

            <div className={resultsStyles.container_results}>
                <div className={resultsStyles.message_result}>
                    <h3>{message}</h3>
                </div>
                <div className={resultsStyles.results_values}>
                    <div className={resultsStyles.value}>
                        <h2>{userForLeaderBoard.score.split('/')[1]}</h2>
                        <p>{t('totalQuestions')}</p>
                    </div>
                    <div className={resultsStyles.value}>
                        <h2>{userForLeaderBoard.result.correctAnswers.length}</h2>
                        <p>{t('correctAnswers')}</p>
                    </div>
                    <div className={resultsStyles.value}>
                        <h2>{getTimeString(userForLeaderBoard.timing)}</h2>
                        <p>{t('totalTime')}</p>
                    </div>
                </div>
            </div>

            <div className={resultsStyles.actions}>
                <button
                    className={resultsStyles.check_score}
                    onClick={() => setScore(undefined)}
                >
                    {tEmbed('playAgain')}
                </button>
                <Link
                    href={`/quiz/${quiz.quizId}/leaderboard`}
                    className={resultsStyles.link_leaderboard}
                    target='_blank'
                >{t('viewLeaderboard')}</Link>
            </div>
        </>
    )
}
