'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CircleAlert, CircleCheck, Clock } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useUser } from '@/contexts/userContext'
import { getCheckoutSessionStatus } from '@/app/[locale]/(subsGroup)/subscription/[type]/actions'
import { CheckoutPlan } from '@/utils/checkout'
import styles from './checkout.module.scss'

export type CheckoutOutcome = 'success' | 'pending' | 'failed'

interface IStatusRes {
    success?: boolean
    status?: 'open' | 'complete' | 'expired' | null
    shouldRefreshUser?: boolean
    // o webhook do Stripe já liberou o acesso no banco (backends antigos não mandam esse campo)
    accessGranted?: boolean
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Pergunta ao backend (que pergunta ao Stripe) como ficou a sessão. Logo depois do pagamento o
// Stripe ainda pode estar concluindo, então tenta algumas vezes. 'failed' = a sessão continua
// aberta (não foi paga) ou expirou. Pago, mas sem o acesso liberado ainda = 'pending': o
// sucesso só aparece quando os recursos já funcionam na conta.
export async function waitCheckoutOutcome(sessionId: string, tries = 8): Promise<{ outcome: CheckoutOutcome, refreshUser: boolean }> {
    let paid = false

    for (let attempt = 0; attempt < tries; attempt++) {
        if (attempt) await wait(1500)

        const { res, err } = await getCheckoutSessionStatus(sessionId).catch(() => ({ res: null, err: true }))
        if (err || !res) continue

        // o backend responde { checkoutSessionStatus: {...} }
        const status = (res.checkoutSessionStatus ?? res) as IStatusRes
        if (status.success) {
            paid = true
            if (status.accessGranted !== false) return { outcome: 'success', refreshUser: true }
            continue
        }
        if (status.status === 'expired') return { outcome: 'failed', refreshUser: false }
        if (status.status === 'open' && attempt === tries - 1) return { outcome: 'failed', refreshUser: false }
    }

    return { outcome: 'pending', refreshUser: paid }
}

// O fim do checkout: deu certo, está sendo confirmado ou não foi concluído
export function CheckoutOutcomeView({ type, outcome }: { type: CheckoutPlan, outcome: CheckoutOutcome }) {
    const t = useTranslations('SubscriptionPage')
    const plus = type === 'questioplus'

    if (outcome === 'success') {
        return (
            <div className={styles.status} role="status">
                <CircleCheck aria-hidden="true" className={styles.status_ok} />
                <h2>{plus ? t('successPlusTitle') : t('successUsageTitle')}</h2>
                <p>{plus ? t('successPlusText') : t('successUsageText')}</p>
                <div className={styles.actions}>
                    <Link href="/create/quiz" className={styles.primary}>{t('createQuiz')}</Link>
                    <Link href="/home" className={styles.secondary}>{t('goHome')}</Link>
                </div>
            </div>
        )
    }

    if (outcome === 'pending') {
        return (
            <div className={styles.status} role="status">
                <Clock aria-hidden="true" />
                <h2>{t('pendingTitle')}</h2>
                <p>{t('pendingText')}</p>
                <div className={styles.actions}>
                    <Link href="/home" className={styles.secondary}>{t('goHome')}</Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.status} role="alert">
            <CircleAlert aria-hidden="true" className={styles.status_error} />
            <h2>{t('failedTitle')}</h2>
            <p>{t('failedText')}</p>
            <div className={styles.actions}>
                <Link href={`/subscription/${type}`} replace className={styles.primary}>{t('retry')}</Link>
            </div>
        </div>
    )
}

// Volta do Stripe depois de uma forma de pagamento que redireciona (o endereço traz o id da sessão)
export function CheckoutReturn({ type, sessionId }: { type: CheckoutPlan, sessionId: string }) {
    const t = useTranslations('SubscriptionPage')
    const { fetchUser } = useUser()
    const [outcome, setOutcome] = useState<CheckoutOutcome | null>(null)

    useEffect(() => {
        let active = true
        waitCheckoutOutcome(sessionId).then(({ outcome, refreshUser }) => {
            if (!active) return
            if (refreshUser) fetchUser()
            setOutcome(outcome)
        })
        return () => { active = false }
    }, [sessionId, fetchUser])

    if (!outcome) return <PaymentSkeleton label={t('confirming')} />

    return <CheckoutOutcomeView type={type} outcome={outcome} />
}

// Espaço do formulário enquanto o Stripe prepara o pagamento
export function PaymentSkeleton({ label }: { label: string }) {
    return (
        <div className={styles.skeleton} role="status" aria-live="polite">
            <span className={styles.skeleton_bar} />
            <span className={styles.skeleton_bar} />
            <span className={styles.skeleton_block} />
            <p>{label}</p>
        </div>
    )
}

export function SessionError({ onRetry }: { onRetry: () => void }) {
    const t = useTranslations('SubscriptionPage')

    return (
        <div className={styles.status} role="alert">
            <CircleAlert aria-hidden="true" className={styles.status_error} />
            <h2>{t('sessionErrorTitle')}</h2>
            <p>{t('sessionErrorText')}</p>
            <div className={styles.actions}>
                <button type="button" onClick={onRetry} className={styles.primary}>{t('retry')}</button>
            </div>
        </div>
    )
}
