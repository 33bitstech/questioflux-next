'use client'
import { ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import CurrencySelector from './currency-selector'
import { CHECKOUT_PLANS, CheckoutPlan } from '@/utils/checkout'
import styles from './checkout.module.scss'

interface IProps {
    type: CheckoutPlan
    // o valor: o da própria sessão do Stripe quando ela já existe, senão o do /plans
    price: ReactNode
}

const FEATURES = ['feature1', 'feature2', 'feature3', 'feature4'] as const

// Coluna da esquerda do checkout: o plano, quanto custa, como é cobrado e o que inclui.
// A troca entre mensal e passe leva para a outra página de checkout (outra sessão do Stripe).
export default function OrderSummary({ type, price }: IProps) {
    const t = useTranslations('SubscriptionPage')
    const tFeatures = useTranslations('vortexPlus.sharedFeatures')
    const locale = useLocale()

    return (
        <section className={styles.summary} aria-labelledby="checkout-plan">
            <span className={styles.eyebrow}>{t('summaryEyebrow')}</span>

            <nav className={styles.switch} aria-label={t('planSwitchLabel')}>
                {CHECKOUT_PLANS.map(plan => (
                    <Link
                        key={plan}
                        locale={locale}
                        href={`/subscription/${plan}`}
                        replace
                        aria-current={plan === type ? 'page' : undefined}
                    >
                        {plan === 'questioplus' ? t('planMonthly') : t('planPass')}
                    </Link>
                ))}
            </nav>

            <div className={styles.plan}>
                <h1 id="checkout-plan">{type === 'questioplus' ? t('planPlus') : t('planUsage')}</h1>
                <p className={styles.price}>{price}</p>
                <p className={styles.billing}>{type === 'questioplus' ? t('billingPlus') : t('billingUsage')}</p>
            </div>

            <CurrencySelector className={styles.currency} activeClassName={styles.currency_active} />

            <div className={styles.included}>
                <h2>{t('includedTitle')}</h2>
                <ul className={styles.benefits}>
                    {FEATURES.map(feature => (
                        <li key={feature}><Check aria-hidden="true" /> {tFeatures(feature)}</li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
