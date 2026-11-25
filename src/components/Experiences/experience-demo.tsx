'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Check, Flag, HeartHandshake, Minus, Play, RotateCcw, Trophy } from 'lucide-react'
import {
    ICompatibilityContent, IQuestionsAnswer, IScoredContent, IStoryAnswer, IStoryContent, ITournamentAnswer, ITournamentContent,
    TExperienceAnswer,
} from '@/interfaces/IExperience'
import { IExperienceTemplate } from '@/utils/experienceTemplates'
import {
    answerText, answersMap, championPath, compareAnswers, roundKey, scoredBounds, scoredOutcome, sortedRanges, storyEndings,
    tournamentDuels, walkStory,
} from '@/utils/experiences'
import { trackEvent } from '@/utils/analytics'
import ExperiencePlayer from './Play/experience-player'
import UseTemplateButton from './use-template-button'
import styles from './experiences.module.scss'

interface IProps {
    template: IExperienceTemplate
}

function TournamentOutcome({ content, answer }: { content: ITournamentContent, answer: ITournamentAnswer }) {
    const t = useTranslations('experiencePlay')
    const championId = answer.winners[answer.winners.length - 1]
    const option = (optionId: string) => content.options.find(item => item.optionId === optionId)
    const champion = option(championId)
    const path = championPath(tournamentDuels(answer.bracket, answer.winners), championId)

    return (
        <>
            <div className={styles.ending}>
                <span className={styles.eyebrow}><Trophy aria-hidden="true" /> {t('tournament.yourChampion')}</span>
                <h2>{champion?.text}</h2>
            </div>
            {champion?.image && <Image src={champion.image} alt={champion.text} width={320} height={320} />}
            <div className={styles.details}>
                <h3>{t('tournament.pathTitle')}</h3>
                <ol className={styles.path}>
                    {path.map(step => (
                        <li key={step.opponentId}>
                            <small>{t(`tournament.rounds.${roundKey(step.roundSize)}`)}</small>
                            <span>{t.rich('tournament.beat', { option: option(step.opponentId)?.text ?? '', strong: chunks => <strong>{chunks}</strong> })}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    )
}

function StoryOutcome({ content, answer, found }: { content: IStoryContent, answer: IStoryAnswer, found: number }) {
    const t = useTranslations('experiencePlay')
    const ending = walkStory(content, answer.choices)

    return (
        <>
            <div className={styles.ending}>
                <span className={styles.eyebrow}><Flag aria-hidden="true" /> {t('story.ending')}</span>
                <h2>{ending?.ending?.title}</h2>
                {ending?.text && <p>{ending.text}</p>}
            </div>
            <p className={styles.notice}>
                {t('story.endingsFound', { found, total: storyEndings(content).length })}
            </p>
        </>
    )
}

function CompatibilityOutcome({ content, answer, partner }: { content: ICompatibilityContent, answer: IQuestionsAnswer, partner: { name: string, answers: Record<string, string> } }) {
    const t = useTranslations('experiencePlay')
    const mine = answersMap(answer.answers)
    const comparison = compareAnswers(content, mine, partner.answers)

    return (
        <>
            <div className={styles.ending}>
                <span className={styles.eyebrow}><HeartHandshake aria-hidden="true" /> {t('compatibility.withName', { name: partner.name })}</span>
                <h2>{t('compatibility.percent', { percent: comparison.percent })}</h2>
                <p>{t('compatibility.explanation', { matched: comparison.matched.length, total: comparison.total })}</p>
            </div>
            <div className={styles.details}>
                <h3>{t('compatibility.answersTitle')}</h3>
                <ul className={styles.compare}>
                    {content.questions.map(question => {
                        const same = comparison.matched.includes(question.questionId)
                        return (
                            <li key={question.questionId} className={same ? styles.match : styles.mismatch}>
                                <p>{question.question}</p>
                                <dl>
                                    <dt>{t('compatibility.you')}</dt>
                                    <dd>{answerText(question, mine[question.questionId]) ?? '—'}</dd>
                                    <dt>{partner.name}</dt>
                                    <dd>{answerText(question, partner.answers[question.questionId]) ?? '—'}</dd>
                                </dl>
                                {same ? <Check aria-label={t('compatibility.same')} /> : <Minus aria-label={t('compatibility.different')} />}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}

function ScoredOutcome({ content, answer }: { content: IScoredContent, answer: IQuestionsAnswer }) {
    const t = useTranslations('experiencePlay')
    const { points, range } = scoredOutcome(content, answersMap(answer.answers))
    const bounds = scoredBounds(content.questions)

    return (
        <>
            <div className={styles.ending}>
                <span className={styles.points}><strong>{points}</strong> {t('scored.points', { points })}</span>
                <h2>{range?.title}</h2>
                {range?.description && <p>{range.description}</p>}
            </div>
            <div className={styles.details}>
                <h3>{t('scored.rangesTitle')}</h3>
                {bounds && <p>{t('scored.bounds', { min: bounds.min, max: bounds.max })}</p>}
                <ul className={styles.path}>
                    {sortedRanges(content.ranges).map(item => (
                        <li key={item.rangeId}>
                            <small>{t('scored.range', { min: item.min, max: item.max })}</small>
                            {item.rangeId === range?.rangeId ? <strong>{item.title}</strong> : <span>{item.title}</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

// Exemplo jogável da página de cada formato: roda no navegador, com o conteúdo do modelo,
// sem salvar nada. "Usar este modelo" copia o conteúdo para um rascunho de quem clicou.
export default function ExperienceDemo({ template }: IProps) {
    const t = useTranslations('experiencePlay')
    const [round, setRound] = useState(0)
    const [answer, setAnswer] = useState<TExperienceAnswer>()
    // história: finais diferentes já encontrados neste exemplo
    const [endings, setEndings] = useState<string[]>([])
    const { kind, content } = template

    const start = () => {
        setAnswer(undefined)
        setRound(current => current + 1)
        trackEvent('demo_start', { quiz_kind: kind })
    }

    const complete = (played: TExperienceAnswer) => {
        setAnswer(played)
        if (kind === 'story') {
            const ending = walkStory(content as IStoryContent, (played as IStoryAnswer).choices)
            if (ending && !endings.includes(ending.sceneId)) setEndings([...endings, ending.sceneId])
        }
        trackEvent('demo_complete', { quiz_kind: kind })
    }

    return (
        <section className={styles.demo} aria-labelledby="demo-title">
            <div className={styles.demo_header}>
                <div>
                    <h2 id="demo-title">{t('demo.title', { title: template.title })}</h2>
                    <p>{template.description}</p>
                </div>
            </div>

            {round === 0 && (
                <div className={styles.demo_actions}>
                    <button type="button" className={styles.button_primary} onClick={start}>
                        <Play aria-hidden="true" /> {t('demo.play')}
                    </button>
                    <UseTemplateButton kind={kind} />
                </div>
            )}

            {round > 0 && !answer && (
                <ExperiencePlayer key={round} kind={kind} content={content} onComplete={complete} />
            )}

            {answer && (
                <>
                    {kind === 'tournament' && <TournamentOutcome content={content as ITournamentContent} answer={answer as ITournamentAnswer} />}
                    {kind === 'story' && <StoryOutcome content={content as IStoryContent} answer={answer as IStoryAnswer} found={endings.length} />}
                    {kind === 'compatibility' && template.demoPartner && (
                        <CompatibilityOutcome content={content as ICompatibilityContent} answer={answer as IQuestionsAnswer} partner={template.demoPartner} />
                    )}
                    {kind === 'scored' && <ScoredOutcome content={content as IScoredContent} answer={answer as IQuestionsAnswer} />}

                    <p className={styles.hint}>{t(`demo.note.${kind}`)}</p>
                    <div className={styles.demo_actions}>
                        <button type="button" className={styles.button_secondary} onClick={start}>
                            <RotateCcw aria-hidden="true" /> {t('demo.again')}
                        </button>
                        <UseTemplateButton kind={kind} />
                    </div>
                </>
            )}
        </section>
    )
}
