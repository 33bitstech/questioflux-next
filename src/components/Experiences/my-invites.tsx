'use client'
import { useEffect, useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { Copy, Users } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useUser } from '@/contexts/userContext'
import { participationRefsFor } from '@/utils/participationKeys'
import styles from './experiences.module.scss'

interface IOwnedParticipation {
    participationId: string
    completedAt: string
    inviteCode?: string
    invitedCount?: number
    lastInvitedAt?: string
}

interface IProps {
    quizId: string
    // endereço da partida (`.../taking`), onde o convite entra como ?invite=
    inviteBaseUrl: string
}

const MAX_ROWS = 5

// "Seus convites": quem já jogou a compatibilidade volta à página do resultado (quem respondeu
// pelo link e quanto combinam) sem depender da aba onde jogou e sem criar outro link. Pela
// conta em qualquer aparelho; sem conta, pelas chaves guardadas neste navegador.
export default function MyInvites({ quizId, inviteBaseUrl }: IProps) {
    const t = useTranslations('experiencePlay.myInvites')
    const tc = useTranslations('experiencePlay.compatibility')
    const format = useFormatter()
    const { user, loaded } = useUser()
    const [items, setItems] = useState<IOwnedParticipation[]>([])
    const [copied, setCopied] = useState<string>()

    useEffect(() => {
        if (!loaded) return
        const keys = participationRefsFor(quizId)
        if (!user && !keys.length) {
            setItems([])
            return
        }
        const controller = new AbortController()
        fetch(`/api/quiz/my-participations/${encodeURIComponent(quizId)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keys }),
            signal: controller.signal,
        })
            .then(response => (response.ok ? response.json() : undefined))
            .then(body => setItems(Array.isArray(body?.participations) ? body.participations : []))
            // sem resposta: a seção só não aparece
            .catch(() => {})
        return () => controller.abort()
    }, [quizId, user?.userId, loaded]) // eslint-disable-line react-hooks/exhaustive-deps

    const rows = items.filter(item => item.inviteCode).slice(0, MAX_ROWS)
    if (!rows.length) return null

    const dateOf = (value: string) => format.dateTime(new Date(value), { dateStyle: 'medium' })
    const linkOf = (code: string) => `${inviteBaseUrl}?invite=${encodeURIComponent(code)}`

    const copy = async (item: IOwnedParticipation) => {
        try {
            await navigator.clipboard.writeText(linkOf(item.inviteCode as string))
            setCopied(item.participationId)
            setTimeout(() => setCopied(current => (current === item.participationId ? undefined : current)), 2500)
        } catch {
            // sem acesso à área de transferência: o link continua na página do resultado
        }
    }

    return (
        <section className={`${styles.details} ${styles.my_invites}`} aria-labelledby={`my-invites-${quizId}`}>
            <h3 id={`my-invites-${quizId}`}>{t('title', { count: rows.length })}</h3>
            <p>{t('text')}</p>
            <ul>
                {rows.map(item => (
                    <li key={item.participationId}>
                        <div className={styles.my_invite_info}>
                            <strong><Users aria-hidden="true" /> {tc('invitedTitle', { count: item.invitedCount ?? 0 })}</strong>
                            <span>
                                {t('playedOn', { date: dateOf(item.completedAt) })}
                                {item.lastInvitedAt && ` · ${t('lastAnswer', { date: dateOf(item.lastInvitedAt) })}`}
                            </span>
                        </div>
                        <div className={styles.my_invite_actions}>
                            <button type="button" className={styles.button_secondary} onClick={() => copy(item)}>
                                <Copy aria-hidden="true" /> {copied === item.participationId ? tc('copied') : tc('copy')}
                            </button>
                            <Link href={`/quiz/${quizId}/result/${item.participationId}`} className={styles.button_primary}>
                                {t('open')}
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}
