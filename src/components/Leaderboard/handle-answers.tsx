'use client'
import IQuizes from '@/interfaces/IQuizes'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { TLeaderboard } from '@/types/leaderboardTypes'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import UserAnswers from './user-answers'
import { useTranslations } from 'next-intl' // Importar
interface IProps {
    styles: TStyles
    userLb: IUserLeaderBoardScore
    quiz: IQuizes
    quizLb: TLeaderboard
    canSeeAnswers: boolean  // dono do quiz ou a própria pessoa — controla o clique
}

export default function HandleAnswers({ styles, userLb, quiz, quizLb, canSeeAnswers }: IProps) {
    const [showUserAnswers, setShowUserAnswers] = useState(false)
    const t = useTranslations('leaderboardPage.userAnswers'); 
    return (
        <>
            <div className={styles.attempts_wrapper}>
                {/* Score — hover sempre mostra tentativas; clique só se canSeeAnswers */}
                <span
                    onClick={() => canSeeAnswers && setShowUserAnswers(s => !s)}
                    className={[
                        styles.score,
                        styles.attempts_trigger,
                        styles['attempts_trigger--interactive'], // hover ativo pra todos
                        canSeeAnswers ? styles.canHover : '',
                    ].filter(Boolean).join(' ')}
                >
                    {userLb.score}
                </span>

                {/* Tooltip de tentativas — visível no hover para qualquer pessoa */}
                <div className={styles.attempts_tooltip}>
                    <p className={styles.attempts_empty}>
                        {t('attempts')} {userLb.attempts ?? 0}
                    </p>
                </div>
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