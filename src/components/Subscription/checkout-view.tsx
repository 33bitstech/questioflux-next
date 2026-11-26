'use client'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { BadgeCheck } from 'lucide-react'
import { loadStripe, Stripe, StripeElementLocale } from '@stripe/stripe-js'
import { CheckoutElementsProvider, useCheckoutElements } from '@stripe/react-stripe-js/checkout'
import { Link } from '@/i18n/navigation'
import PlanPrice from '@/components/Pricing/plan-price'
import { useSubscriptionCurrency } from '@/contexts/subscriptionCurrencyContext'
import { useUser } from '@/contexts/userContext'
import { CheckoutPlan, offerPlanOf, stripeLocaleFor } from '@/utils/checkout'
import { IPlanOffer } from '@/utils/plans'
import OrderSummary from './order-summary'
import PaymentPanel from './payment-panel'
import { CheckoutReturn, PaymentSkeleton, SessionError } from './checkout-status'
import styles from './checkout.module.scss'

// Um carregamento do Stripe.js por chave e idioma: o provider precisa receber sempre a mesma promise
const stripeLoads = new Map<string, Promise<Stripe | null>>()
function getStripe(publicKey: string, locale: StripeElementLocale) {
    const key = `${publicKey}:${locale}`
    let load = stripeLoads.get(key)
    if (!load) {
        load = loadStripe(publicKey, { locale })
        stripeLoads.set(key, load)
    }
    return load
}

type SessionState =
    | { status: 'loading' }
    | { status: 'ready', clientSecret: string }
    | { status: 'error' }

interface IProps {
    type: CheckoutPlan
    publicKey?: string
    premium: boolean
    // volta do Stripe depois de uma forma de pagamento que redireciona
    returnSessionId?: string
}

// Checkout numa etapa só: a sessão do Stripe é criada ao abrir a página, na moeda e no idioma
// da página, e o formulário de pagamento já aparece montado.
export default function CheckoutView({ type, publicKey, premium, returnSessionId }: IProps) {
    const t = useTranslations('SubscriptionPage')
    const locale = useLocale()
    const { currency } = useSubscriptionCurrency()
    const { resolvedTheme } = useTheme()
    const { user } = useUser()
    const [session, setSession] = useState<SessionState>({ status: 'loading' })
    const [attempt, setAttempt] = useState(0)

    const opensCheckout = !premium && !returnSessionId
    const plan = offerPlanOf(type)

    useEffect(() => {
        if (!opensCheckout) return
        if (!publicKey) {
            setSession({ status: 'error' })
            return
        }

        let active = true
        setSession({ status: 'loading' })

        fetch('/api/subscription/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ type, locale, currency }),
        })
            .then(async response => {
                const data = await response.json().catch(() => null)
                if (!response.ok || typeof data?.clientSecret !== 'string') throw new Error(data?.error || 'checkout session')
                return data.clientSecret as string
            })
            .then(clientSecret => { if (active) setSession({ status: 'ready', clientSecret }) })
            .catch(error => {
                console.error('checkout session:', error)
                if (active) setSession({ status: 'error' })
            })

        return () => { active = false }
    }, [opensCheckout, publicKey, type, locale, currency, attempt])

    const retry = () => setAttempt(count => count + 1)

    if (opensCheckout && publicKey && session.status === 'ready') {
        const dark = resolvedTheme !== 'light'

        return (
            <CheckoutElementsProvider
                key={session.clientSecret}
                stripe={getStripe(publicKey, stripeLocaleFor(locale, currency))}
                options={{
                    clientSecret: session.clientSecret,
                    ...(user?.email ? { defaultValues: { email: user.email } } : {}),
                    elementsOptions: {
                        appearance: {
                            theme: dark ? 'night' : 'stripe',
                            variables: { colorPrimary: dark ? '#00E4FF' : '#0047FF' },
                        },
                    },
                }}
            >
                <div className={styles.grid}>
                    <OrderSummary type={type} price={<SessionPrice plan={plan} />} />
                    <section className={styles.payment}>
                        <PaymentPanel type={type} onRetry={retry} />
                    </section>
                </div>
            </CheckoutElementsProvider>
        )
    }

    return (
        <div className={styles.grid}>
            <OrderSummary type={type} price={<PlanPrice plan={plan} />} />
            <section className={styles.payment}>
                {premium
                    ? <HasPremium />
                    : returnSessionId
                        ? <CheckoutReturn type={type} sessionId={returnSessionId} />
                        : session.status === 'error'
                            ? <SessionError onRetry={retry} />
                            : <PaymentSkeleton label={t('preparing')} />}
            </section>
        </div>
    )
}

// O valor da própria sessão do Stripe: é exatamente o que vai ser cobrado, na moeda da cobrança
function SessionPrice({ plan }: { plan: IPlanOffer['plan'] }) {
    const state = useCheckoutElements()
    const t = useTranslations('pricing')

    if (state.type !== 'success') return <PlanPrice plan={plan} />

    const price = state.checkout.total.total.amount,
    interval = state.checkout.recurring?.interval

    return (
        <span>
            {interval === 'month' ? t('perMonth', { price }) : interval === 'year' ? t('perYear', { price }) : t('perUse', { price })}
        </span>
    )
}

function HasPremium() {
    const t = useTranslations('SubscriptionPage')

    return (
        <div className={styles.status}>
            <BadgeCheck aria-hidden="true" className={styles.status_ok} />
            <h2>{t('hasPremium')}</h2>
            <p>{t('hasPremiumText')}</p>
            <div className={styles.actions}>
                <Link href="/create/quiz" className={styles.primary}>{t('createQuiz')}</Link>
                <Link href="/profile/config" className={styles.secondary}>{t('manageSubscription')}</Link>
            </div>
        </div>
    )
}
