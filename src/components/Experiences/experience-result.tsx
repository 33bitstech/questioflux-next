'use client'
import { useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { Check, ChevronDown, Copy, Minus, Share2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import IQuizes from '@/interfaces/IQuizes'
import IParticipationView, { IParticipationPlayer } from '@/interfaces/IParticipation'
import { IChoiceQuestion, ICompatibilityContent, IScoredContent, ITournamentContent } from '@/interfaces/IExperience'
import { optionRanking, roundKey, sortedRanges } from '@/utils/experiences'
import { getQuizKind } from '@/utils/quizKind'
import { trackEvent } from '@/utils/analytics'
import { ICompatibilityView, IOptionView, IScoredView, IStoryView, ITournamentView } from '@/utils/resultHeadline'
import styles from './experiences.module.scss'


// resposta escolhida: com imagem (QuestioPlus), a miniatura e a legenda
function AnswerShown({ question, answerId }: { question: IChoiceQuestion, answerId?: string }) {
    const t = useTranslations('experiencePlay')
    const index = question.answers.findIndex(answer => answer.answerId === answerId)
    const answer = question.answers[index]
    if (!answer) return <>—</>
    if (!question.answers.some(other => other.image)) return <>{answer.text}</>
    return (
        <span className={styles.compare_answer}>
            {answer.image
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={answer.image} alt="" loading="lazy" decoding="async" />
                : <span className={styles.compare_answer_blank} aria-hidden="true" />}
            {answer.text || t('imageAnswer', { number: index + 1 })}
        </span>
    )
}

function CompareList({ content, mine, theirs, theirName }: { content?: ICompatibilityContent, mine: Record<string, string>, theirs: Record<string, string>, theirName: string }) {
    const t = useTranslations('experiencePlay.compatibility')
    const questions = (content?.questions ?? []).filter(question => mine[question.questionId] && theirs[question.questionId])

    return (
        <ul className={styles.compare}>
            {questions.map(question => {
                const same = mine[question.questionId] === theirs[question.questionId]
                return (
                    <li key={question.questionId} className={same ? styles.match : styles.mismatch}>
                        <p>{question.question}</p>
                        <dl>
                            <dt>{t('you')}</dt>
                            <dd><AnswerShown question={question} answerId={mine[question.questionId]} /></dd>
                            <dt>{theirName}</dt>
                            <dd><AnswerShown question={question} answerId={theirs[question.questionId]} /></dd>
                        </dl>
                        {same ? <Check aria-label={t('same')} /> : <Minus aria-label={t('different')} />}
                    </li>
                )
            })}
        </ul>
    )
}

function InviteBox({ quiz, url }: { quiz: IQuizes, url: string }) {
    const t = useTranslations('experiencePlay.compatibility')
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch {
            // sem acesso à área de transferência: o link continua visível no campo
        }
    }

    const share = async () => {
        trackEvent('share', { method: 'compatibility_invite', content_type: 'quiz', item_id: quiz.quizId })
        try {
            if (navigator.share) return await navigator.share({ title: quiz.title, text: t('inviteText', { quiz: quiz.title }), url })
        } catch (error) {
            // a pessoa cancelou
            if ((error as Error)?.name === 'AbortError') return
            // sem permissão (ex.: dentro de um iframe em outro site): copia o link
        }
        await copy()
    }

    return (
        <div className={styles.details}>
            <h3>{t('inviteTitle')}</h3>
            <p>{t('inviteHint')}</p>
            <div className={styles.invite_box}>
                <input type="text" readOnly value={url} aria-label={t('inviteLink')} onFocus={event => event.currentTarget.select()} />
                <button type="button" className={styles.button_secondary} onClick={copy}>
                    <Copy aria-hidden="true" /> {copied ? t('copied') : t('copy')}
                </button>
                <button type="button" className={styles.button_primary} onClick={share}>
                    <Share2 aria-hidden="true" /> {t('share')}
                </button>
            </div>
        </div>
    )
}

function CompatibilityDetails({ quiz, participation, inviteBaseUrl, nameOf }: IProps) {
    const t = useTranslations('experiencePlay.compatibility')
    const format = useFormatter()
    const [open, setOpen] = useState<string>()
    const view = participation as unknown as ICompatibilityView
    const content = quiz.experience as ICompatibilityContent | undefined
    const { comparison } = view
    const inviterName = nameOf(comparison?.inviter)

    return (
        <>
            {comparison && (
                <div className={styles.details}>
                    <h3>{t('howTitle')}</h3>
                    <p>{t('how', { matched: comparison.matchedCount ?? 0, total: comparison.total ?? 0, percent: comparison.percent })}</p>
                    {participation.isOwner && comparison.theirAnswers && view.answers && (
                        <CompareList content={content} mine={view.answers} theirs={comparison.theirAnswers} theirName={inviterName} />
                    )}
                </div>
            )}

            {participation.isOwner && view.inviteCode && (
                <InviteBox quiz={quiz} url={`${inviteBaseUrl}?invite=${encodeURIComponent(view.inviteCode)}`} />
            )}

            {participation.isOwner && view.invited && (
                <div className={styles.details}>
                    <h3>{t('invitedTitle', { count: view.invited.length })}</h3>
                    {view.invited.length === 0 ? <p>{t('invitedEmpty')}</p> : (
                        <ul className={styles.people}>
                            {view.invited.map(item => (
                                <li key={item.participationId}>
                                    <Link href={`/quiz/${quiz.quizId}/result/${item.participationId}`}>{nameOf(item.player)}</Link>
                                    <span>{format.dateTime(new Date(item.completedAt), { dateStyle: 'medium' })}</span>
                                    <strong>{t('percent', { percent: item.percent })}</strong>
                                    {view.answers && (
                                        <button type="button" className={styles.button_link} aria-expanded={open === item.participationId}
                                            onClick={() => setOpen(open === item.participationId ? undefined : item.participationId)}>
                                            <ChevronDown aria-hidden="true" /> {t('seeAnswers')}
                                        </button>
                                    )}
                                    {open === item.participationId && view.answers && (
                                        <div style={{ width: '100%' }}>
                                            <CompareList content={content} mine={view.answers} theirs={item.answers} theirName={nameOf(item.player)} />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </>
    )
}

function TournamentDetails({ quiz, participation }: IProps) {
    const t = useTranslations('experiencePlay.tournament')
    const view = participation as unknown as ITournamentView
    const content = quiz.experience as ITournamentContent | undefined
    const duels = view.duels ?? []
    const size = content?.size ?? duels.length + 1
    const roundSize = (round: number) => Math.max(2, Math.round(size / 2 ** (round - 1)))
    const championId = view.champion?.optionId
    const textOf = (option: IOptionView) => (option.removed ? t('removed') : option.text ?? '')
    const path = duels.filter(duel => duel.winnerId === championId)
    const top = optionRanking(content, quiz.experienceStats).slice(0, 3)

    return (
        <>
            {path.length > 0 && (
                <div className={styles.details}>
                    <h3>{t('pathTitle')}</h3>
                    <ol className={styles.path}>
                        {path.map(duel => {
                            const opponent = duel.a.optionId === championId ? duel.b : duel.a
                            return (
                                <li key={`${duel.round}-${opponent.optionId}`}>
                                    <small>{t(`rounds.${roundKey(roundSize(duel.round))}`)}</small>
                                    <span>{t.rich('beat', { option: textOf(opponent), strong: chunks => <strong>{chunks}</strong> })}</span>
                                </li>
                            )
                        })}
                    </ol>
                    <details>
                        <summary className={styles.button_link}>{t('allDuels', { count: duels.length })}</summary>
                        <ol className={styles.path}>
                            {duels.map(duel => (
                                <li key={`${duel.round}-${duel.a.optionId}-${duel.b.optionId}`}>
                                    <small>{t(`rounds.${roundKey(roundSize(duel.round))}`)}</small>
                                    {[duel.a, duel.b].map((option, index) => (
                                        <span key={option.optionId}>
                                            {index === 1 && `${t('versus')} `}
                                            {option.optionId === duel.winnerId ? <strong>{textOf(option)}</strong> : textOf(option)}
                                        </span>
                                    ))}
                                </li>
                            ))}
                        </ol>
                    </details>
                </div>
            )}

            {top.length > 0 && (
                <div className={styles.details}>
                    <h3>{t('topTitle')}</h3>
                    <ol className={styles.path}>
                        {top.map((item, index) => (
                            <li key={item.option.optionId}>
                                <small>{index + 1}º</small>
                                <strong>{item.option.text}</strong>
                                <span>{t('titles', { count: item.titles })} · {t('winRate', { percent: item.winRate })}</span>
                            </li>
                        ))}
                    </ol>
                    <Link href={`/quiz/${quiz.quizId}/leaderboard`} className={styles.button_link}>{t('seeAll')}</Link>
                </div>
            )}
        </>
    )
}

// o recomeço fica no botão "Jogar de novo" do rodapé do resultado
function StoryDetails({ participation }: IProps) {
    const t = useTranslations('experiencePlay.story')
    const view = participation as unknown as IStoryView

    return (
        <div className={styles.details}>
            <p>{t('resultSteps', { steps: view.steps ?? 0 })}</p>
            {(view.endingsTotal ?? 0) > 1 && <p>{t('resultEndings', { total: view.endingsTotal ?? 0 })}</p>}
        </div>
    )
}

function ScoredDetails({ quiz, participation }: IProps) {
    const t = useTranslations('experiencePlay.scored')
    const view = participation as unknown as IScoredView
    const content = quiz.experience as IScoredContent | undefined
    const ranges = sortedRanges(content?.ranges ?? [])

    return (
        <div className={styles.details}>
            <h3>{t('rangesTitle')}</h3>
            <p>{t('explanation')}</p>
            <ul className={styles.path}>
                {ranges.map(range => (
                    <li key={range.rangeId}>
                        <small>{t('range', { min: range.min, max: range.max })}</small>
                        {range.rangeId === view.range?.rangeId
                            ? <strong>{range.title} · {t('yours')}</strong>
                            : <span>{range.title}</span>}
                    </li>
                ))}
            </ul>
        </div>
    )
}

interface IProps {
    quiz: IQuizes
    participation: IParticipationView
    // endereço do jogo (o convite da compatibilidade leva ?invite=)
    inviteBaseUrl: string
    nameOf: (player?: IParticipationPlayer | null) => string
}

// Abaixo do cartão: o caminho do campeão, o final, as faixas ou a comparação.
export default function ExperienceResultDetails(props: IProps) {
    switch (getQuizKind(props.quiz)) {
        case 'tournament': return <TournamentDetails {...props} />
        case 'story': return <StoryDetails {...props} />
        case 'compatibility': return <CompatibilityDetails {...props} />
        case 'scored': return <ScoredDetails {...props} />
        default: return null
    }
}
