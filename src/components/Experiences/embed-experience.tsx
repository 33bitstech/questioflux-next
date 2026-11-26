'use client'
import { MouseEvent, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ExternalLink, Play } from 'lucide-react'
import IQuizes from '@/interfaces/IQuizes'
import IParticipationView from '@/interfaces/IParticipation'
import { TStyles } from '@/types/stylesType'
import { IParticipationRef } from '@/utils/participationKeys'
import { Link } from '@/i18n/navigation'
import ParticipationResult from '../ParticipationResult/participation-result'
import LoadingReq from '../Loading/loading-req'
import ExperienceTaking from './experience-taking'
import resultStyles from '../PersonalityResult/personality-result.module.scss'
import styles from './experiences.module.scss'

interface IProps {
    quiz: IQuizes
    styles: TStyles
    // endereços públicos do quiz no site (o compartilhamento e o convite levam para lá)
    quizUrl: string
}

// Links do resultado (ranking, resultado de outra pessoa...) abrem o site em outra aba: dentro
// do iframe trariam a navbar e o login, que não funcionam ali.
function openLinksOutside(event: MouseEvent<HTMLElement>) {
    const anchor = (event.target as HTMLElement).closest('a')
    if (!anchor || anchor.hasAttribute('download') || anchor.target === '_blank') return
    const href = anchor.getAttribute('href')
    if (!href || href.startsWith('#')) return
    event.preventDefault()
    event.stopPropagation()
    window.open(new URL(href, window.location.href).toString(), '_blank', 'noopener,noreferrer')
}

// Torneio, história, compatibilidade ou pontuação dentro de um iframe em outro site: a
// partida e o resultado acontecem aqui, sem navbar e só como visitante.
export default function EmbedExperience({ quiz, styles: takingStyles, quizUrl }: IProps) {
    const t = useTranslations('embedPage')
    const [round, setRound] = useState(0)
    const [result, setResult] = useState<IParticipationView>()
    const [finished, setFinished] = useState<IParticipationRef>()
    const [loading, setLoading] = useState(false)

    // a chave de quem jogou vem direto da conclusão: o localStorage pode não existir no iframe
    const handleFinished = async (participation: IParticipationRef) => {
        setFinished(participation)
        setLoading(true)
        try {
            const response = await fetch(`/api/quiz/participation/${quiz.quizId}/${participation.participationId}`, {
                headers: { 'x-participation-key': participation.ownerKey },
            })
            const body = response.ok ? await response.json() : undefined
            if (body?.participation) setResult(body.participation)
        } catch {
            // sem o resultado aqui: o aviso abaixo leva para a página dele no site
        } finally {
            setLoading(false)
            window.scrollTo({ top: 0 })
        }
    }

    const playAgain = () => {
        setResult(undefined)
        setFinished(undefined)
        setRound(current => current + 1)
        window.scrollTo({ top: 0 })
    }

    const header = (
        <div className={takingStyles.header_quiz}>
            <h1>{quiz.title}</h1>
        </div>
    )

    if (loading) return <>{header}<LoadingReq loading={true} /></>

    if (result) {
        return (
            <>
                {header}
                <div onClickCapture={openLinksOutside} style={{ width: '100%' }}>
                    <ParticipationResult
                        quiz={quiz}
                        participation={result}
                        shareUrl={`${quizUrl}/result/${result.participationId}`}
                        inviteBaseUrl={`${quizUrl}/taking`}
                        actions={<>
                            <button type="button" className={resultStyles.button_primary} onClick={playAgain}>
                                <Play aria-hidden="true" /> {t('playAgain')}
                            </button>
                            <Link href={`/quiz/${quiz.quizId}`} target="_blank" className={resultStyles.button_secondary}>
                                <ExternalLink aria-hidden="true" /> {t('seeOnSite')}
                            </Link>
                        </>}
                    />
                </div>
            </>
        )
    }

    if (finished) {
        return (
            <>
                {header}
                <div className={styles.intro}>
                    <p>{t('resultError')}</p>
                    <div className={styles.demo_actions}>
                        <a href={`${quizUrl}/result/${finished.participationId}`} target="_blank" rel="noopener noreferrer" className={styles.button_primary}>
                            <ExternalLink aria-hidden="true" /> {t('openResult')}
                        </a>
                        <button type="button" className={styles.button_secondary} onClick={playAgain}>
                            {t('playAgain')}
                        </button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {header}
            <ExperienceTaking key={round} quiz={quiz} embed onFinished={handleFinished} />
        </>
    )
}
