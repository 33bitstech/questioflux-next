'use client'

import { useMemo, useState } from 'react'
import LbUser from './lb-user'
import { TStyles } from '@/types/stylesType'
import IQuizes from '@/interfaces/IQuizes'
import { TLeaderboard } from '@/types/leaderboardTypes'

interface IProps {
    styles: TStyles
    title: string
    // contas ou visitantes, na ordem do ranking
    entries: TLeaderboard
    quiz: IQuizes
    locale: string
    viewerId?: string
    isOwner: boolean
    // aberto: 10 por vez com "Ver mais participantes"; fechado (top 10 da trivia): só as
    // 10 primeiras e a entrada de quem está vendo, com a posição real
    expandable: boolean
    seeMoreLabel: string
    // ex.: "Top 10 de 245" ou o aviso de que só quem criou vê além do top 10
    note?: string
    sectionClassName: string
    containerClassName: string
}

const STEP = 10

export default function LeaderboardGroup({
    styles, title, entries, quiz, locale, viewerId, isOwner,
    expandable, seeMoreLabel, note, sectionClassName, containerClassName,
}: IProps) {
    const [shown, setShown] = useState(STEP)

    // a posição vem do backend; sem ela (resposta antiga), vale a ordem da lista
    const ranked = useMemo(
        () => entries.map((entry, index) => ({ entry, position: entry.position ?? index + 1 })),
        [entries]
    )

    const visible = ranked.filter(item => item.position <= shown),
    own = viewerId ? ranked.find(item => item.entry.userId === viewerId && item.position > shown) : undefined,
    hasMore = expandable && ranked.some(item => item.position > shown)

    const renderEntry = ({ entry, position }: { entry: TLeaderboard[number], position: number }) => (
        <LbUser
            key={`${entry.userId}-${position}`}
            locale={locale}
            index={position - 1}
            styles={styles}
            userLb={entry}
            quiz={quiz}
            quizLb={entries}
            // visitantes não têm conta: as respostas deles só quem criou o quiz abre
            canSeeAnswers={isOwner || (!!viewerId && entry.userId === viewerId)}
        />
    )

    return (
        <section className={sectionClassName}>
            <h2 className={styles.lb_section_title}>{title}</h2>
            {note && <p className={styles.lb_section_note}>{note}</p>}

            <div className={containerClassName}>
                {visible.map(renderEntry)}
                {own && renderEntry(own)}
            </div>

            {hasMore && (
                <button
                    type="button"
                    className={styles.show_more_lb_button}
                    onClick={() => setShown(count => count + STEP)}
                >
                    {seeMoreLabel}
                </button>
            )}
        </section>
    )
}
