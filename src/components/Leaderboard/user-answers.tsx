'use client'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import React, { useEffect, useState } from 'react'
import CloseSvg from '../Icons/CloseSvg'
import styles from './user-answers.module.scss'
import IQuizes from '@/interfaces/IQuizes'
import IExamReviewQuestion from '@/interfaces/IExamReview'
import ExamReviewView from '../ExamReview/exam-review-view'
import { useLocale, useTranslations } from 'next-intl'
import { getLocalizedMessage } from '@/utils/getLocalizedMessage'
import { getQuizKind } from '@/utils/quizKind'

interface IProps{
    userLb: IUserLeaderBoardScore
    quiz: IQuizes,
    closeAnswers: ()=>void
}

type TState =
    | { status: 'loading' }
    | { status: 'ready', review: IExamReviewQuestion[] }
    | { status: 'error', message: string }

// Respostas de uma tentativa do ranking, com o mesmo cartão da correção da prova: enunciado,
// imagens, a alternativa marcada, a certa, "Acertou/Errou" e as explicações. Os dados vêm do
// backend, que só responde para a própria pessoa ou para quem criou o quiz.
export default function UserAnswers({userLb, closeAnswers, quiz}:IProps) {
    const t = useTranslations('leaderboardPage.userAnswers')
    const locale = useLocale()
    const [state, setState] = useState<TState>({ status: 'loading' })

    useEffect(() => {
        let active = true
        fetch(`/api/quiz/leaderboard/${quiz.quizId}/answers/${encodeURIComponent(userLb.userId)}`)
            .then(async response => {
                const data = await response.json()
                if (!active) return
                if (!response.ok) return setState({ status: 'error', message: getLocalizedMessage(data, locale, t('error')) })
                setState({ status: 'ready', review: data.review ?? [] })
            })
            .catch(() => active && setState({ status: 'error', message: t('error') }))
        return () => { active = false }
    }, [quiz.quizId, userLb.userId, locale, t])

    // Esc fecha, como o clique fora
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => event.key === 'Escape' && closeAnswers()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [closeAnswers])

    return (
        <div className={styles.results_container} role="dialog" aria-modal="true" aria-labelledby="user-answers-title">
            <div className={styles.user_info}>
                <div>
                    <h2 id="user-answers-title">{t('title', { name: userLb.name })}</h2>
                    <p>{t('attempts')} <span>{userLb.attempts || '1'}</span></p>
                </div>
                <button type="button" className={styles.close_button} onClick={closeAnswers} aria-label={t('close')}>
                    <CloseSvg/>
                </button>
            </div>

            <div className={styles.body}>
                {state.status === 'loading' && <p className={styles.state}>{t('loading')}</p>}
                {state.status === 'error' && <p className={styles.state}>{state.message}</p>}
                {state.status === 'ready' && state.review.length === 0 && <p className={styles.state}>{t('empty')}</p>}
                {state.status === 'ready' && state.review.length > 0 && (
                    <ExamReviewView
                        quizId={quiz.quizId}
                        score={{ userForLeaderBoard: userLb, message: '' }}
                        review={state.review}
                        heading={t('heading')}
                        // só a prova mostra o gabarito; nos outros tipos o backend nem manda a certa
                        showCorrectTag={getQuizKind(quiz) === 'exam'}
                    />
                )}
            </div>
        </div>
    )
}
