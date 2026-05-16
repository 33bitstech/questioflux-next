'use client'
import IQuizes from '@/interfaces/IQuizes'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { TLeaderboard } from '@/types/leaderboardTypes'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import UserAnswers from './user-answers'

interface IProps {
    styles: TStyles
    userLb: IUserLeaderBoardScore
    quiz: IQuizes
    quizLb: TLeaderboard
    canSeeAttempts: boolean
}

export default function HandleAnswers({ styles, userLb, quiz, quizLb, canSeeAttempts }: IProps) {
    const [showUserAnswers, setShowUserAnswers] = useState(false)

    return (
        <>
            <div className={styles.attempts_wrapper}>
                <span
                    onClick={() => canSeeAttempts && setShowUserAnswers(s => !s)}
                    className={[
                        styles.score,
                        styles.attempts_trigger,
                        canSeeAttempts ? styles['attempts_trigger--interactive'] : '',
                    ].filter(Boolean).join(' ')}
                >
                    {userLb.score}
                </span>

                {canSeeAttempts && (
                    <div className={styles.attempts_tooltip}>
                        <p className={styles.attempts_tooltip_title}>Tentativas</p>
                        <p className={styles.attempts_empty}>
                            {userLb.attempts ?? 0} tentativa{userLb.attempts !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}
            </div>

            {showUserAnswers && (
                <>
                    <UserAnswers
                        userLb={userLb}
                        quiz={quiz}
                        closeAnswers={() => setShowUserAnswers(false)}
                    />
                    <div
                        onClick={() => setShowUserAnswers(false)}
                        className={styles.overlay_result}
                    />
                </>
            )}
        </>
    )
}