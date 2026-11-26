import styles from '@/components/Subscription/checkout.module.scss'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft, Lock } from 'lucide-react'
import { getPublicKey } from './actions'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import { SubscriptionCurrencyProvider } from '@/contexts/subscriptionCurrencyContext'
import { checkPremiumState, PremiumRes } from '@/utils/checkPremiumSubs'
import { isCheckoutPlan } from '@/utils/checkout'
import CheckoutView from '@/components/Subscription/checkout-view'

interface IProps {
    params: Promise<{
        locale: string
        type: string
    }>
    searchParams: Promise<{ session_id?: string | string[] }>
}

async function fetchPublicKey(): Promise<string | undefined> {
    try {
        const { err, res } = await getPublicKey()
        if (err) throw err
        return res.public_key
    } catch (err) {
        console.log(err)
    }
}

export default async function Subscription({ params, searchParams }: IProps) {
    const { locale, type } = await params
    if (!isCheckoutPlan(type)) notFound()

    const { session_id } = await searchParams
    const returnSessionId = typeof session_id === 'string' && /^cs_[A-Za-z0-9_]+$/.test(session_id) ? session_id : undefined

    const [t, publicKey, premiumRes] = await Promise.all([
        getTranslations({ locale, namespace: 'SubscriptionPage' }),
        fetchPublicKey(),
        verifyUserPremium(false),
    ])
    // quem voltou do Stripe agora pode já estar com o premium ativo: mostra o resultado, não o aviso
    const premium = !returnSessionId && !premiumRes.err && !!checkPremiumState(premiumRes as PremiumRes)

    return (
        <SubscriptionCurrencyProvider locale={locale}>
            <div className={styles.page}>
                <header className={styles.topbar}>
                    <Link locale={locale} href="/pricing" className={styles.back}>
                        <ArrowLeft aria-hidden="true" /> {t('backToPlans')}
                    </Link>
                    <span className={styles.secure}>
                        <Lock aria-hidden="true" /> {t('securePayment')}
                    </span>
                </header>

                <main className={styles.main}>
                    <CheckoutView
                        type={type}
                        publicKey={publicKey}
                        premium={premium}
                        returnSessionId={returnSessionId}
                    />
                </main>
            </div>
        </SubscriptionCurrencyProvider>
    )
}
