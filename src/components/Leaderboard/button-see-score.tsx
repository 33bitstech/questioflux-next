'use client'
import React, { useMemo, useState } from "react"
import UserAnswers from "./user-answers"
import styles from './overlay.module.scss'
import { TLeaderboard } from "@/types/leaderboardTypes"
import IQuizes from "@/interfaces/IQuizes"
import { useUser } from "@/contexts/userContext"

interface IProps extends React.ComponentProps<'div'> {
    leaderboard: TLeaderboard
    quiz: IQuizes
}

export default function ButtonSeeScore({ className, children, leaderboard, quiz, ...props }: IProps) {
    const [viewAnswers, setViewAnswers] = useState(false)
    const { user } = useUser()
    const userLb = leaderboard.find(lb => lb.userId === user?.userId)

    return (
        <>
            <button className={className}
                onClick={(() => setViewAnswers(state => !state))}
            >
                {children}
            </button>


            {viewAnswers && userLb && <>
                <UserAnswers
                    userLb={userLb}
                    quiz={quiz}
                    closeAnswers={() => { setViewAnswers(false) }}
                />
                <div onClick={() => setViewAnswers(false)} className={styles.overlay_result}></div>
            </>}
        </>
    )
}