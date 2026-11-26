'use client'
import IQuizes from '@/interfaces/IQuizes'
import { TStyles } from '@/types/stylesType'
import React, { useState } from 'react'
import ParticipantsContainer, { IParticipantItem } from './participants-container'
import useQuizDatas from '@/hooks/requests/quiz-requests/useQuizDatas'
import { useLocale, useTranslations } from 'next-intl'
import { getQuizKind, hasLeaderboard, isExperienceKind } from '@/utils/quizKind'

interface IProps {
    styles: TStyles,
    quiz: IQuizes
}

// o que a lista traz de cada partida nos formatos de experiência
interface IExperienceListItem extends IParticipantItem {
    champion?: { text?: string }
    ending?: { title?: string }
    comparison?: { percent?: number }
    points?: number
    range?: { title?: string }
}

interface IParticipantsState {
    items: IParticipantItem[]
    // entradas que podem ser listadas; o total geral (usersCount) fica separado
    visible: number
    total: number
    page: number
    totalPages: number
    // trivia para quem não criou o quiz: só o top 10 de contas e o de visitantes
    limited?: boolean
}

export default function Participants({ quiz, styles }: IProps) {
    const [showParticipants, setShowParticipants] = useState<boolean>(false),
        [participants, setParticipants] = useState<IParticipantsState | null>(null),
        [loading, setLoading] = useState<boolean>(false),
        { getLeaderboard, getParticipants } = useQuizDatas(),
        t = useTranslations('quizInfoPage'),
        locale = useLocale(),
        // sem ranking (personalidade e os formatos de experiência): a lista vem das conclusões
        // gravadas, com o apelido de cada partida, paginada
        kind = getQuizKind(quiz),
        fromParticipations = !hasLeaderboard(kind),
        experience = isExperienceKind(kind)

    // campeão, final, porcentagem ou faixa + pontos, no lugar do perfil da personalidade
    const summaryOf = (item: IExperienceListItem): string | undefined => {
        if (item.champion?.text) return item.champion.text
        if (item.ending?.title) return item.ending.title
        if (typeof item.comparison?.percent === 'number') return t('participantsList.match', { percent: item.comparison.percent })
        if (typeof item.points === 'number') {
            const points = t('participantsList.points', { points: item.points })
            return item.range?.title ? `${item.range.title} · ${points}` : points
        }
        return undefined
    }

    const loadPage = async (page: number) => {
        if (fromParticipations) {
            const res = await getParticipants(quiz.quizId, page)
            const received: IExperienceListItem[] = res.participants ?? []
            const items = experience ? received.map(item => ({ ...item, summary: item.summary ?? summaryOf(item) })) : received
            setParticipants(current => ({
                items: [...(page > 1 ? current?.items ?? [] : []), ...items],
                visible: res.visible ?? 0,
                total: res.total ?? quiz.usersCount ?? 0,
                page: res.page ?? page,
                totalPages: res.totalPages ?? 1,
            }))
            return
        }

        const res = await getLeaderboard(quiz.quizId)
        const items: IParticipantItem[] = res?.scoreBoard ?? []
        // trivia: o ranking vem só com o top 10 de cada grupo, mas a contagem é a de todas as
        // entradas visíveis
        const visible = typeof res?.users === 'number' && typeof res?.guests === 'number'
            ? res.users + res.guests
            : items.length
        setParticipants({ items, visible, total: res?.total ?? quiz.usersCount ?? 0, page: 1, totalPages: 1, limited: res?.limited === true })
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
                {t('details.participantsSpan', { count: quiz.usersCount ?? 0, kind })}
            </span>

            {showParticipants && participants && (
                <div className={styles.participants_popup}>
                    <ParticipantsContainer
                        quizId={quiz.quizId}
                        users={participants.items}
                        visible={participants.visible}
                        total={participants.total}
                        hasMore={participants.page < participants.totalPages}
                        partial={participants.limited && participants.items.length < participants.visible}
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
