import { getTranslations } from 'next-intl/server'
import LeaderboardGroup from './leaderboard-group'
import { TStyles } from '@/types/stylesType'
import IQuizes from '@/interfaces/IQuizes'
import { ILeaderboardData, isGuestEntry } from '@/utils/leaderboardData'
import { getQuizKind } from '@/utils/quizKind'

interface IProps {
    styles: TStyles
    data: ILeaderboardData
    quiz: IQuizes
    locale: string
    viewerId?: string
    // a tela depois do quiz usa as seções mais largas
    wide?: boolean
}

const TOP = 10

// As duas tabelas do ranking: contas em cima, visitantes embaixo.
// Trivia (certo e errado): o ranking é fechado no top 10 de cada tabela; só quem criou o
// quiz vê além disso. Nos outros tipos, 10 por vez com "Ver mais participantes".
export default async function LeaderboardGroups({ styles, data, quiz, locale, viewerId, wide }: IProps) {
    const t = await getTranslations({ locale, namespace: 'leaderboardPage' })

    const isOwner = !!viewerId && viewerId === quiz.userCreatorId,
    isTop10 = getQuizKind(quiz) === 'quiz',
    users = data.scoreBoard.filter(entry => !isGuestEntry(entry)),
    guests = data.scoreBoard.filter(entry => isGuestEntry(entry))

    const groups = [
        { key: 'users', entries: users, count: data.users ?? users.length, title: isTop10 ? t('sections.topUsers') : t('sections.registered'), guest: false },
        { key: 'guests', entries: guests, count: data.guests ?? guests.length, title: isTop10 ? t('sections.topGuests') : t('sections.guests'), guest: true },
    ]

    const noteFor = (count: number) => {
        if (!isTop10 || count <= TOP) return undefined
        return isOwner ? t('ownerSeesAll') : t('topOf', { count })
    }

    return (
        <>
            {groups.filter(group => group.entries.length > 0).map(group => (
                <LeaderboardGroup
                    key={group.key}
                    styles={styles}
                    title={group.title}
                    entries={group.entries}
                    quiz={quiz}
                    locale={locale}
                    viewerId={viewerId}
                    isOwner={isOwner}
                    expandable={!isTop10 || isOwner}
                    seeMoreLabel={t('seeMoreParticipants')}
                    note={noteFor(group.count)}
                    sectionClassName={[styles.lb_section, wide ? styles['lb_section--wide'] : ''].filter(Boolean).join(' ')}
                    containerClassName={[styles.leaderboard_container, group.guest ? styles.leaderboard_container__guest : ''].filter(Boolean).join(' ')}
                />
            ))}
        </>
    )
}
