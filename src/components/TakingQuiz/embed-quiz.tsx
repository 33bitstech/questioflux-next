'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import TakingComponent, { IQuizScore } from './taking'
import resultsStyles from '@/app/[locale]/(quizGroup)/(quizTaking)/quiz/[quizId]/(finished)/results/results.module.scss'
import { getTimeString } from '@/utils/FormatTime'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import IExamReviewQuestion from '@/interfaces/IExamReview'
import ExamReviewView from '../ExamReview/exam-review-view'
import reviewStyles from '../ExamReview/exam-review.module.scss'
import IPersonalityOutcome from '@/interfaces/IPersonalityOutcome'
import PersonalityResultView from '../PersonalityResult/personality-result-view'

interface IProps {
    styles: TStyles,
    quiz: IQuizes
}

// Quiz dentro de um iframe em outro site. Tudo acontece nesta página: navegar para
// /quiz/[id]/results traria a navbar do site e um resultado lido de cookie, que o
// navegador não guarda em iframe de terceiros. O que leva ao site abre em outra aba.
export default function EmbedQuiz({ quiz, styles }: IProps) {
    const [score, setScore] = useState<IQuizScore>()
    // prova: a correção aparece aqui mesmo, sem sair do iframe
    const [review, setReview] = useState<IExamReviewQuestion[]>()
    // personalidade: o perfil no lugar da nota
    const [personality, setPersonality] = useState<IPersonalityOutcome>()

    const t = useTranslations('quizResultsPage.results'),
        tEmbed = useTranslations('embedPage')

    const handleFinish = (quizScore?: IQuizScore, examReview?: IExamReviewQuestion[], outcome?: IPersonalityOutcome) => {
        setScore(quizScore)
        setReview(examReview)
        setPersonality(outcome)
        window.scrollTo({ top: 0 })
    }

    const playAgain = () => {
        setScore(undefined)
        setReview(undefined)
        setPersonality(undefined)
    }

    if (personality) {
        return (
            <>
                <div className={styles.header_quiz}>
                    <h1>{quiz.title}</h1>
                </div>
                <PersonalityResultView
                    quizId={quiz.quizId}
                    quizTitle={quiz.title}
                    outcome={personality}
                    actions={<>
                        <button type='button' className={reviewStyles.button_primary} onClick={playAgain}>
                            {tEmbed('playAgain')}
                        </button>
                        <Link
                            href={`/quiz/${quiz.quizId}/leaderboard`}
                            className={reviewStyles.button_secondary}
                            target='_blank'
                        >{tEmbed('allResults')}</Link>
                    </>}
                />
            </>
        )
    }

    if (!score) return <TakingComponent quiz={quiz} styles={styles} onFinish={handleFinish} />

    if (review) {
        return (
            <>
                <div className={styles.header_quiz}>
                    <h1>{quiz.title}</h1>
                </div>
                <ExamReviewView
                    quizId={quiz.quizId}
                    score={score}
                    review={review}
                    actions={<>
                        <button type='button' className={reviewStyles.button_primary} onClick={playAgain}>
                            {tEmbed('playAgain')}
                        </button>
                        <Link
                            href={`/quiz/${quiz.quizId}/leaderboard`}
                            className={reviewStyles.button_secondary}
                            target='_blank'
                        >{t('viewLeaderboard')}</Link>
                    </>}
                />
            </>
        )
    }

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
                    onClick={playAgain}
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
