'use client'
import { ReactNode, useEffect, useState } from 'react'
import Image from 'next/image'
import { useFormatter, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Play, Share2, Sparkles, Trophy } from 'lucide-react'
import IQuizes from '@/interfaces/IQuizes'
import IParticipationView from '@/interfaces/IParticipation'
import { ownerKeyFor } from '@/utils/participationKeys'
import { trackEvent } from '@/utils/analytics'
import { getQuizKind, isExperienceKind } from '@/utils/quizKind'
import { IParticipationPlayer } from '@/interfaces/IParticipation'
import ExperienceResultDetails from '../Experiences/experience-result'
import { experienceHeadline, resultHeadline } from '@/utils/resultHeadline'
import styles from '../PersonalityResult/personality-result.module.scss'

interface IProps {
    quiz: IQuizes
    participation: IParticipationView
    shareUrl: string
    // endereço do jogo; o convite da compatibilidade acrescenta ?invite=
    inviteBaseUrl: string
    // conteúdo próprio de cada formato (torneio, história...), abaixo do cartão
    children?: ReactNode
    // botões do fim no lugar de "Jogar de novo" e "Ver o quiz" (quiz incorporado em outro site)
    actions?: ReactNode
}

// /quiz/[id]/result/[participationId]: o resultado de uma conclusão, com o nome de quem jogou.
// É o link que vai no compartilhamento e na lista de participantes.
export default function ParticipationResult({ quiz, participation: initial, shareUrl, inviteBaseUrl, children, actions }: IProps) {
    const t = useTranslations('participationResultPage')
    const te = useTranslations('experiencePlay')
    const format = useFormatter()
    const [participation, setParticipation] = useState(initial)
    const [copied, setCopied] = useState(false)

    // quem jogou neste navegador recebe a parte privada (no teste de compatibilidade, o convite)
    useEffect(() => {
        const ownerKey = ownerKeyFor(initial.participationId)
        if (!ownerKey || initial.isOwner) return

        fetch(`/api/quiz/participation/${initial.quizId}/${initial.participationId}`, { headers: { 'x-participation-key': ownerKey } })
            .then(response => response.ok ? response.json() : undefined)
            .then(body => { if (body?.participation) setParticipation(body.participation) })
            .catch(() => undefined)
    }, [initial])

    const { player } = participation
    const nameOf = (someone?: IParticipationPlayer | null) => someone?.name || t('guest')
    const name = nameOf(player)
    // torneio, história, compatibilidade e pontuação: o resultado é do mesmo formato do quiz
    const experience = isExperienceKind(getQuizKind(quiz)) && participation.kind === getQuizKind(quiz)
    const headline = experience ? experienceHeadline(participation, te, nameOf) : resultHeadline(quiz, participation, t)

    const share = async () => {
        const text = headline ? t('shareText', { quiz: quiz.title, result: headline.title }) : quiz.title
        trackEvent('share', { method: 'participation_result', content_type: 'quiz', item_id: quiz.quizId })

        try {
            if (navigator.share) {
                await navigator.share({ title: quiz.title, text, url: shareUrl })
                return
            }
        } catch (error) {
            // a pessoa cancelou o compartilhamento
            if ((error as Error)?.name === 'AbortError') return
            // sem permissão (ex.: dentro de um iframe em outro site): tenta copiar
        }

        try {
            await navigator.clipboard.writeText(`${text} ${shareUrl}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch {
            // nem copiar dá: abre o resultado no site, onde o compartilhamento funciona
            window.open(shareUrl, '_blank', 'noopener,noreferrer')
        }
    }

    return (
        <section className={styles.result}>
            <div className={styles.card}>
                {headline?.image && (
                    <div className={styles.image}>
                        <Image src={headline.image} alt={headline.title} width={640} height={640} sizes="(max-width: 700px) 80vw, 320px" priority />
                    </div>
                )}

                <div className={styles.text}>
                    <span className={styles.eyebrow}>
                        {headline?.title && typeof participation.score === 'string' ? <Trophy aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
                        {' '}{participation.isOwner ? t('yourResult') : t('resultOf', { name })}
                    </span>
                    <h2>{headline?.title ?? t('completed')}</h2>
                    {headline?.description && <p>{headline.description}</p>}

                    {!participation.legacy && (
                        <p className={styles.same}>
                            {t('completedOn', { date: format.dateTime(new Date(participation.completedAt), { dateStyle: 'medium' }) })}
                        </p>
                    )}

                    <button type="button" className={styles.share} onClick={share}>
                        <Share2 aria-hidden="true" /> {copied ? t('copied') : t('share')}
                    </button>
                </div>
            </div>

            {experience && <ExperienceResultDetails quiz={quiz} participation={participation} inviteBaseUrl={inviteBaseUrl} nameOf={nameOf} />}

            {children}

            <div className={styles.actions}>
                {actions ?? <>
                    <Link href={`/quiz/${quiz.quizId}/taking`} className={styles.button_primary}>
                        <Play aria-hidden="true" /> {participation.isOwner ? t('playAgain') : t('playToo')}
                    </Link>
                    <Link href={`/quiz/${quiz.quizId}`} className={styles.button_secondary}>
                        {t('seeQuiz', { kind: getQuizKind(quiz) })}
                    </Link>
                </>}
            </div>
        </section>
    )
}
