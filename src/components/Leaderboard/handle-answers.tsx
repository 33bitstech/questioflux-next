'use client'

import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { TStyles } from '@/types/stylesType'
import React, { CSSProperties } from 'react'
import { useTranslations } from 'next-intl'

interface IProps {
    styles: TStyles
    userLb: IUserLeaderBoardScore
    showAttempts: boolean
    isAttemptsTooltipFloating: boolean
    attemptsTooltipStyle: CSSProperties
    attemptsTooltipId: string
}

export default function HandleAnswers({
    styles,
    userLb,
    showAttempts,
    isAttemptsTooltipFloating,
    attemptsTooltipStyle,
    attemptsTooltipId,
}: IProps) {
    const t = useTranslations('leaderboardPage.userAnswers')

    return (
        <div className={styles.attempts_wrapper}>
            <span className={[styles.score, styles.attempts_trigger].filter(Boolean).join(' ')}>
                {userLb.score}
            </span>

            <div
                id={attemptsTooltipId}
                role="tooltip"
                className={[
                    styles.attempts_tooltip,
                    showAttempts ? styles.attempts_tooltip__visible : '',
                    isAttemptsTooltipFloating ? styles.attempts_tooltip__floating : '',
                ].filter(Boolean).join(' ')}
                style={attemptsTooltipStyle}
            >
                <p className={styles.attempts_empty}>
                    {t('attempts')} {userLb.attempts ?? 0}
                </p>
            </div>
        </div>
    )
}