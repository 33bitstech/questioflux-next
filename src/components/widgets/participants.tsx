'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import ParticipantsContainer, { IParticipantItem } from './participants-container'
import useQuizDatas from '@/hooks/requests/quiz-requests/useQuizDatas'
import { useLocale, useTranslations } from 'next-intl'
import { getQuizKind } from '@/utils/quizKind'

interface IProps {
    styles: TStyles,
    quiz: IQuizes
}

interface IParticipantsState {
    items: IParticipantItem[]
    // entradas que podem ser listadas; o total geral (usersCount) fica separado
    visible: number
    total: number
    page: number
    totalPages: number
}

export default function Participants({ quiz, styles }: IProps) {
    const [showParticipants, setShowParticipants] = useState<boolean>(false),
        [participants, setParticipants] = useState<IParticipantsState | null>(null),
        [loading, setLoading] = useState<boolean>(false),
        { getLeaderboard, getPersonalityParticipants } = useQuizDatas(),
        t = useTranslations('quizInfoPage'),
        locale = useLocale(),
        // personalidade não tem ranking: a lista vem das conclusões, paginada
        isPersonality = getQuizKind(quiz) === 'personality'

    const loadPage = async (page: number) => {
        if (isPersonality) {
            const res = await getPersonalityParticipants(quiz.quizId, page)
            setParticipants(current => ({
                items: [...(page > 1 ? current?.items ?? [] : []), ...(res.participants ?? [])],
                visible: res.visible ?? 0,
                total: res.total ?? quiz.usersCount ?? 0,
                page: res.page ?? page,
                totalPages: res.totalPages ?? 1,
            }))
            return
        }

        const res = await getLeaderboard(quiz.quizId)
        const items: IParticipantItem[] = res?.scoreBoard ?? []
        setParticipants({ items, visible: items.length, total: res?.total ?? quiz.usersCount ?? 0, page: 1, totalPages: 1 })
    }

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
                await loadPage(1)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        setShowParticipants(true)
    }

    const loadMore = async () => {
        if (!participants || loading) return
        setLoading(true)
        try {
            await loadPage(participants.page + 1)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
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
                        users={participants.items}
                        visible={participants.visible}
                        total={participants.total}
                        hasMore={participants.page < participants.totalPages}
                        loadingMore={loading}
                        onLoadMore={loadMore}
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
