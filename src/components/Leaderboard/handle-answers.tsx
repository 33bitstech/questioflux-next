'use client'
import { useUser } from '@/contexts/userContext'
import IQuizes from '@/interfaces/IQuizes'
import { IUser } from '@/interfaces/IUser'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { TLeaderboard } from '@/types/leaderboardTypes'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import UserAnswers from './user-answers'

interface IProps {
    styles: TStyles
    userLb: IUserLeaderBoardScore,
    quiz: IQuizes,
    quizLb: TLeaderboard
}

export default function HandleAnswers({ styles, userLb, quiz, quizLb }: IProps) {
    const { user } = useUser(),
        userCanSeeAnswers = user?.userId === quiz?.userCreatorId,
        userInLb = quizLb.find(lb => lb.userId === user?.userId),
        canSeeAllAnswers = userCanSeeAnswers || userInLb,
        [showUserAnswers, setShowUserAnswers] = useState<boolean>(false)

    return (
        <>
            <span
                onClick={() => {
                    if (canSeeAllAnswers)
                        setShowUserAnswers(state => !state)
                }}
                className={`${styles.score} ${canSeeAllAnswers ? styles.canHover : ''}`}
            >
                {userLb.score}
            </span>

            {showUserAnswers && <>
                <UserAnswers
                    userLb={userLb}
                    quiz={quiz}
                    closeAnswers={() => { setShowUserAnswers(false) }}
                />
                <div onClick={() => setShowUserAnswers(false)} className={styles.overlay_result}></div>
            </>}
        </>
    )
}
