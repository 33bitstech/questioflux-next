'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import ParticipantsContainer from './participants-container'
import useQuizDatas from '@/hooks/requests/quiz-requests/useQuizDatas'
import { TLeaderboard } from '@/types/leaderboardTypes'
import { useLocale, useTranslations } from 'next-intl'

interface IProps {
    styles: TStyles,
    quiz: IQuizes
}

export default function Participants({ quiz, styles }: IProps) {
    const [showParticipants, setShowParticipants] = useState<boolean>(false),
        [participants, setParticipants] = useState<TLeaderboard | null>(null),
        [loading, setLoading] = useState<boolean>(false),
        { getLeaderboard } = useQuizDatas(),
        t = useTranslations('quizInfoPage'),
        locale = useLocale()

    const handleClick = async () => {
        // Se já está aberto, só fecha
        if (showParticipants) {
            setShowParticipants(false)
            return
        }

        // Lazy load: só busca na primeira abertura
        if (!participants) {
            setLoading(true)
            try {
                const res = await getLeaderboard(quiz.quizId)
                if (res) setParticipants(res.scoreBoard)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        setShowParticipants(true)
    }

    return (
        <>
            <span
                onClick={handleClick}
                className={styles.participants}
                aria-busy={loading}
            >
                {quiz.usersCount ?? 0} {t('details.participantsSpan')}
            </span>

            {showParticipants && participants && (
                <div className={styles.participants_popup}>
                    <ParticipantsContainer
                        users={participants}
                        locale={locale}
                        closeParticipants={() => setShowParticipants(false)}
                    />
                </div>
            )}

            {showParticipants && participants && (
                <div
                    onClick={() => setShowParticipants(false)}
                    className={styles.overlay_participants}
                />
            )}
        </>
    )
}