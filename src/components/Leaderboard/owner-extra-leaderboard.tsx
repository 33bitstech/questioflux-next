// components/Leaderboard/owner-extra-leaderboard.tsx
'use client'

import { useMemo, useState } from 'react'
import LbUser from './lb-user'
import { TStyles } from '@/types/stylesType'
import IQuizes from '@/interfaces/IQuizes'
import IUserLeaderBoardScore from '@/interfaces/IUserLeaderBoardScore'
import { TLeaderboard } from '@/types/leaderboardTypes'

interface IOwnerExtraLeaderboardItem {
    userLb: IUserLeaderBoardScore
    index: number
}

interface IProps {
    styles: TStyles
    items: IOwnerExtraLeaderboardItem[]
    quiz: IQuizes
    locale: string
    title: string
    showMoreLabel: string
}

const STEP = 10

export default function OwnerExtraLeaderboard({
    styles,
    items,
    quiz,
    locale,
    title,
    showMoreLabel,
}: IProps) {
    const [visibleCount, setVisibleCount] = useState(STEP)

    const visibleItems = items.slice(0, visibleCount)

    const extraLb = useMemo<TLeaderboard>(() => {
        return items.map(item => item.userLb)
    }, [items])

    const hasMore = visibleCount < items.length

    return (
        <section className={styles.lb_section}>
            <h2 className={styles.lb_section_title}>
                {title}
            </h2>

            <div className={`${styles.leaderboard_container} ${styles.leaderboard_container__owner_extra}`}>
                {visibleItems.map(({ userLb, index }) => (
                    <LbUser
                        key={`${userLb.userId}-${index}`}
                        locale={locale}
                        index={index}
                        styles={styles}
                        userLb={userLb}
                        quiz={quiz}
                        quizLb={extraLb}
                        canSeeAnswers={true}
                    />
                ))}
            </div>

            {hasMore && (
                <button
                    type="button"
                    className={styles.show_more_lb_button}
                    onClick={() => setVisibleCount(count => count + STEP)}
                    aria-label={showMoreLabel}
                    title={showMoreLabel}
                >
                    ...
                </button>
            )}
        </section>
    )
}