'use client'
import { FormEvent, useEffect, useState } from 'react'
import { PaymentElement, useCheckoutElements } from '@stripe/react-stripe-js/checkout'
import { useTranslations } from 'next-intl'
import { Lock } from 'lucide-react'
import { useUser } from '@/contexts/userContext'
import { CheckoutPlan } from '@/utils/checkout'
import { CheckoutOutcome, CheckoutOutcomeView, PaymentSkeleton, SessionError, waitCheckoutOutcome } from './checkout-status'
import styles from './checkout.module.scss'

interface IProps {
    type: CheckoutPlan
    onRetry: () => void
}

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

// Coluna da direita: e-mail (o da conta, já preenchido), o formulário do Stripe e o botão
// com o valor que vai ser cobrado.
export default function PaymentPanel({ type, onRetry }: IProps) {
    const checkoutState = useCheckoutElements()
    const { user, fetchUser } = useUser()
    const t = useTranslations('SubscriptionPage')

    const [email, setEmail] = useState(user?.email ?? '')
    const [emailError, setEmailError] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [paying, setPaying] = useState(false)
    const [outcome, setOutcome] = useState<CheckoutOutcome | null>(null)

    const checkout = checkoutState.type === 'success' ? checkoutState.checkout : null

    // a conta pode chegar depois da página: preenche o e-mail assim que ela chegar
    useEffect(() => {
        if (user?.email) setEmail(current => current || user.email || '')
    }, [user?.email])

    // O Stripe só libera o pagamento com o e-mail na sessão: manda o e-mail preenchido (ou
    // digitado) sem esperar a pessoa sair do campo
    useEffect(() => {
        if (!checkout || !looksLikeEmail(email.trim()) || checkout.email === email.trim()) return
        const timer = setTimeout(() => { checkout.updateEmail(email.trim()).catch(() => undefined) }, 400)
        return () => clearTimeout(timer)
    }, [checkout, email])

    if (outcome) return <CheckoutOutcomeView type={type} outcome={outcome} />
    if (checkoutState.type === 'loading') return <PaymentSkeleton label={t('preparing')} />
    if (checkoutState.type === 'error' || !checkout) return <SessionError onRetry={onRetry} />

    const amount = checkout.total.total.amount

    const checkEmail = async () => {
        const value = email.trim()
        if (!value) return
        const result = await checkout.updateEmail(value)
        setEmailError(result.type === 'error' ? result.error.message || t('messages.invalidEmail') : null)
    }

    const pay = async (event: FormEvent) => {
        event.preventDefault()
        if (paying) return

        setError(null)
        setPaying(true)

        try {
            const emailResult = await checkout.updateEmail(email.trim())
            if (emailResult.type === 'error') {
                setEmailError(emailResult.error.message || t('messages.invalidEmail'))
                return
            }

            const result = await checkout.confirm({ redirect: 'if_required' })
            if (result.type === 'error') {
                setError(result.error.message || t('messages.paymentProcessError'))
                return
            }

            // o pagamento foi aceito: falta só o Stripe concluir a sessão
            const status = await waitCheckoutOutcome(checkout.id)
            if (status.refreshUser || status.outcome === 'success') fetchUser()
            setOutcome(status.outcome === 'success' ? 'success' : 'pending')
        } catch {
            setError(t('messages.unexpectedError'))
        } finally {
            setPaying(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={pay} noValidate>
            <h2>{t('paymentTitle')}</h2>

            <div className={styles.field}>
                <label htmlFor="checkout-email">{t('emailLabel')}</label>
                <input
                    id="checkout-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={event => { setEmail(event.target.value); setEmailError(null) }}
                    onBlur={checkEmail}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'checkout-email-error' : undefined}
                    required
                />
                {emailError && <p id="checkout-email-error" className={styles.field_error}>{emailError}</p>}
            </div>

            <PaymentElement options={{ layout: { type: 'accordion', defaultCollapsed: false } }} />

            {error && <p className={styles.form_error} role="alert">{error}</p>}

            <button type="submit" className={styles.pay} disabled={paying || !checkout.canConfirm}>
                {paying
                    ? t('processing')
                    : type === 'questioplus' ? t('payPlus', { amount }) : t('payUsage', { amount })}
            </button>

            <p className={styles.note}><Lock aria-hidden="true" /> {t('stripeNote')}</p>
        </form>
    )
}
