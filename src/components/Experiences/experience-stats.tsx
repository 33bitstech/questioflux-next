import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import IQuizes from '@/interfaces/IQuizes'
import { ICompatibilityContent, IScoredContent, IStoryContent, ITournamentContent } from '@/interfaces/IExperience'
import { optionRanking, percentOf, sortedRanges, storyEndings } from '@/utils/experiences'
import { getQuizKind } from '@/utils/quizKind'
import styles from '../PersonalityResult/personality-result.module.scss'

interface IProps {
    quiz: IQuizes
    locale: string
}

interface IRow {
    id: string
    title: string
    // texto ao lado do título (porcentagem, aproveitamento)
    value: string
    bar: number
    detail?: string
    image?: string
}

// Aba "Resultados" dos formatos de experiência: estatística do conteúdo entre todas as
// partidas concluídas (não é ranking de jogadores).
export default async function ExperienceStats({ quiz, locale }: IProps) {
    const t = await getTranslations({ locale, namespace: 'experiencePlay.stats' })
    const kind = getQuizKind(quiz)
    const stats = quiz.experienceStats ?? {}
    const plays = Number(quiz.usersCount) || 0
    let rows: IRow[] = []
    let summary: string | undefined
    let note: string | undefined

    if (kind === 'tournament') {
        rows = optionRanking(quiz.experience as ITournamentContent | undefined, stats).map(item => ({
            id: item.option.optionId,
            title: item.option.text,
            value: t('winRate', { percent: item.winRate }),
            bar: item.winRate,
            detail: t('titles', { count: item.titles, wins: item.wins, duels: item.duels }),
            image: item.option.image,
        }))
        note = t('tournamentNote')
    }

    if (kind === 'story') {
        rows = storyEndings(quiz.experience as IStoryContent | undefined)
            .map(scene => {
                const count = Number(stats.endings?.[scene.sceneId]) || 0
                const percent = Math.min(100, percentOf(count, plays))
                return { id: scene.sceneId, title: scene.ending?.title ?? '', value: `${percent}%`, bar: percent, detail: t('reached', { count }) }
            })
            .sort((a, b) => b.bar - a.bar)
        note = t('storyNote')
    }

    if (kind === 'scored') {
        rows = sortedRanges((quiz.experience as IScoredContent | undefined)?.ranges ?? []).map(range => {
            const count = Number(stats.ranges?.[range.rangeId]) || 0
            const percent = Math.min(100, percentOf(count, plays))
            return { id: range.rangeId, title: range.title, value: `${percent}%`, bar: percent, detail: t('range', { min: range.min, max: range.max, count }) }
        })
        // uma casa decimal: com 5 e 6 pontos a média é 5,5, não 6
        if (plays) summary = t('averagePoints', { points: Math.round(((Number(stats.pointsSum) || 0) / plays) * 10) / 10 })
    }

    if (kind === 'compatibility') {
        const comparisons = Number(stats.comparisons) || 0
        const questions = (quiz.experience as ICompatibilityContent | undefined)?.questions?.length ?? 0
        summary = comparisons
            ? t('averageMatch', { percent: Math.round((Number(stats.percentSum) || 0) / comparisons), count: comparisons })
            : t('noComparisons')
        note = t('compatibilityNote', { questions })
    }

    return (
        <section className={styles.stats}>
            <div className={styles.stats_header}>
                <h2>{t(`title.${kind}`)}</h2>
                <p>{plays ? t('plays', { count: plays }) : t('noPlays')}</p>
                {summary && <p>{summary}</p>}
                {note && <p className={styles.stats_note}>{note}</p>}
                <Link href={`/quiz/${quiz.quizId}/taking`} locale={locale} className={styles.button_primary}>{t('cta')}</Link>
            </div>

            {rows.length > 0 && (
                <ul className={styles.stats_list}>
                    {rows.map(row => (
                        <li key={row.id}>
                            {row.image
                                ? <Image src={row.image} alt={row.title} width={112} height={112} className={styles.stats_image} />
                                : <span className={styles.stats_image} aria-hidden="true">{row.title.charAt(0).toUpperCase()}</span>}
                            <div className={styles.stats_text}>
                                <div className={styles.stats_title}>
                                    <strong>{row.title}</strong>
                                    <span>{row.value}</span>
                                </div>
                                <span className={styles.bar} aria-hidden="true"><span style={{ width: `${row.bar}%` }} /></span>
                                {row.detail && <p>{row.detail}</p>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
