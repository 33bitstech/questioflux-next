'use client'
import { ReactNode, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Share2, Sparkles, Users } from 'lucide-react'
import IPersonalityOutcome from '@/interfaces/IPersonalityOutcome'
import { trackEvent } from '@/utils/analytics'
import styles from './personality-result.module.scss'

interface IProps {
    quizId: string
    quizTitle: string
    outcome: IPersonalityOutcome
    // botões abaixo do resultado (refazer, ver todos os resultados...)
    actions?: ReactNode
    // link que vai no compartilhamento (a página do quiz)
    shareUrl?: string
}

// O perfil que saiu, quanto deu cada resultado nas respostas e o botão de compartilhar.
export default function PersonalityResultView({ quizId, quizTitle, outcome, actions, shareUrl }: IProps) {
    const t = useTranslations('personalityResultPage')
    const [copied, setCopied] = useState(false)
    const { result, breakdown, plays, sameResultPercent } = outcome

    const share = async () => {
        const text = t('shareText', { result: result.title, quiz: quizTitle })
        const url = shareUrl ?? window.location.href
        trackEvent('share', { method: 'personality_result', content_type: 'quiz', item_id: quizId })

        try {
            if (navigator.share) {
                await navigator.share({ title: quizTitle, text, url })
                return
            }
            await navigator.clipboard.writeText(`${text} ${url}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch {
            // a pessoa cancelou o compartilhamento
        }
    }

    return (
        <section className={styles.result}>
            <div className={styles.card}>
                {result.image && (
                    <div className={styles.image}>
                        <Image src={result.image} alt={result.title} width={640} height={640} sizes="(max-width: 700px) 80vw, 320px" priority />
                    </div>
                )}

                <div className={styles.text}>
                    <span className={styles.eyebrow}><Sparkles aria-hidden="true" /> {t('yourResult')}</span>
                    <h2>{result.title}</h2>
                    {result.description && <p>{result.description}</p>}

                    {plays > 1 && (
                        <p className={styles.same}>
                            <Users aria-hidden="true" /> {t('sameResult', { percent: sameResultPercent, count: plays })}
                        </p>
                    )}

                    <button type="button" className={styles.share} onClick={share}>
                        <Share2 aria-hidden="true" /> {copied ? t('copied') : t('share')}
                    </button>
                </div>
            </div>

            {actions && <div className={styles.actions}>{actions}</div>}

            <div className={styles.breakdown}>
                <h3>{t('breakdownTitle')}</h3>
                <ul>
                    {breakdown.map((item, index) => (
                        <li key={item.resultId} className={index === 0 ? styles.top : ''}>
                            <span className={styles.breakdown_title}>{item.title}</span>
                            <span className={styles.bar} aria-hidden="true"><span style={{ width: `${item.percent}%` }} /></span>
                            <span className={styles.percent}>{item.percent}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
