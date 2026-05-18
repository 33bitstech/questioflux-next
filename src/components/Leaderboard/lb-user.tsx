'use client'

import { TStyles } from '@/types/stylesType'
import { Link } from '@/i18n/navigation'
import React, { CSSProperties, useRef, useState } from 'react'
import UserProfileImgRender from '../ImagesRender/user-profile-img-render'
import LeaderboardTop from '../Icons/Badges/LeaderboardTop'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { getTimeString } from '@/utils/FormatTime'
import HandleAnswers from './handle-answers'
import UserAnswers from './user-answers'
import IQuizes from '@/interfaces/IQuizes'
import { TLeaderboard } from '@/types/leaderboardTypes'

interface IProps {
    styles: TStyles
    userLb: IUserLeaderBoardScore
    index: number
    quiz: IQuizes
    quizLb: TLeaderboard
    locale: string
    canSeeAnswers: boolean
}

function isGuestEntry(userLb: IUserLeaderBoardScore): boolean {
    if ('isGuest' in userLb) return userLb.isGuest === true
    return userLb.name.startsWith('guest_')
}

export default function LbUser({ styles, userLb, index, quiz, locale, canSeeAnswers }: IProps) {
    const guest = isGuestEntry(userLb)

    const [showUserAnswers, setShowUserAnswers] = useState(false)
    const [showAttempts, setShowAttempts] = useState(false)
    const [attemptsTooltipPosition, setAttemptsTooltipPosition] = useState({ x: 0, y: 0 })
    const [isAttemptsTooltipFloating, setIsAttemptsTooltipFloating] = useState(false)

    const lastPointerType = useRef('mouse')
    const attemptsTooltipId = `lb-user-attempts-${userLb.userId}-${index}`

    const isNameTarget = (target: EventTarget | null) => {
        return target instanceof HTMLElement && !!target.closest(`.${styles.lb_user_name}`)
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        lastPointerType.current = event.pointerType

        if (event.pointerType !== 'mouse') return

        if (isNameTarget(event.target)) {
            setShowAttempts(false)
            setIsAttemptsTooltipFloating(false)
            return
        }

        if (!showUserAnswers && !showAttempts) {
            setAttemptsTooltipPosition({
                x: event.clientX,
                y: event.clientY,
            })

            setIsAttemptsTooltipFloating(true)
            setShowAttempts(true)
        }
    }

    const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'mouse') {
            setShowAttempts(false)
            setIsAttemptsTooltipFloating(false)
        }
    }

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        lastPointerType.current = event.pointerType

        if (event.pointerType !== 'mouse') {
            setIsAttemptsTooltipFloating(false)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isNameTarget(event.target)) return

        if (canSeeAnswers) {
            setShowAttempts(false)
            setIsAttemptsTooltipFloating(false)
            setShowUserAnswers(show => !show)
            return
        }

        // Mobile/tablet: se não tem permissão, o toque mostra só as tentativas.
        if (lastPointerType.current !== 'mouse') {
            setShowAttempts(show => !show)
        }
    }

    const attemptsTooltipStyle = {
        '--attempts-tooltip-x': `${attemptsTooltipPosition.x}px`,
        '--attempts-tooltip-y': `${attemptsTooltipPosition.y}px`,
    } as CSSProperties

    return (
        <>
            <div
                className={[
                    styles.user_results,
                    canSeeAnswers ? styles.user_results__can_open : '',
                    showAttempts ? styles.user_results__show_attempts : '',
                ].filter(Boolean).join(' ')}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerUp={handlePointerUp}
                onClick={handleClick}
                aria-describedby={showAttempts ? attemptsTooltipId : undefined}
            >
                <div className={styles.user}>
                    <div className={styles.user_images}>
                        <div className={styles.rank}>
                            {index <= 2
                                ? <LeaderboardTop position={index} />
                                : <span>{index > 9 ? '+' : ''}{index + 1}</span>
                            }
                        </div>

                        <div className={styles.profileImg}>
                            <UserProfileImgRender user={userLb} />
                        </div>
                    </div>

                    {guest ? (
                        <p className={styles.lb_user_name}>{userLb.name}</p>
                    ) : (
                        <Link
                            className={styles.lb_user_name}
                            locale={locale}
                            href={`/user/${userLb.userId}`}
                        >
                            {userLb.name}
                        </Link>
                    )}
                </div>

                <div className={styles.result}>
                    <HandleAnswers
                        styles={styles}
                        userLb={userLb}
                        showAttempts={showAttempts}
                        isAttemptsTooltipFloating={isAttemptsTooltipFloating}
                        attemptsTooltipStyle={attemptsTooltipStyle}
                        attemptsTooltipId={attemptsTooltipId}
                    />

                    <span className={styles.time}>{getTimeString(userLb.timing)}</span>
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