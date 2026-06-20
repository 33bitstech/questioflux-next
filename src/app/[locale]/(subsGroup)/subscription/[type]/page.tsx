import styles from './subscription.module.scss'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { getPublicKey } from './actions'
import SubscriptionForm from '@/components/Subscription/subscription-form'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'
import CurrencySelector from '@/components/Subscription/currency-selector'
import { SubscriptionCurrencyProvider } from '@/contexts/subscriptionCurrencyContext'

interface IProps {
    params: Promise<{
        locale: string
        type: string
    }>
}

async function fetchPublicKey() {
    try {
        const { err, res } = await getPublicKey()
        if (err) throw err
        return res.public_key
    } catch (err) {
        console.log(err)
    }
}

export default async function Subscription({ params }: IProps) {
    const { locale, type } = await params

    const [tNav, t] = await Promise.all([
        getTranslations({ locale, namespace: 'navbar.asideMenu' }),
        getTranslations({ locale, namespace: 'SubscriptionPage' }),
    ])

    const publicKey = await fetchPublicKey()
    const res = await verifyUserPremium(false)
    console.log(res)
    let premium = res.err ? false : res.premium?.premium || false

    if (premium) {
        const endDateFromApi = res.premium.currentPeriodEnd ?? null
        const cancelAtPeriodEndFromApi = res.premium.cancelAtPeriodEnd ?? false

        if (cancelAtPeriodEndFromApi && endDateFromApi) {
            const endDate = new Date(endDateFromApi);
            if (endDate <= new Date()) {
                premium = false;
            }
        }
    }

    return (
        <SubscriptionCurrencyProvider locale={locale}>
            <div className={styles.container}>
                <main className={styles.content}>
                    <header className={styles.header_subscription}>
                        <nav>
                            <Link locale={locale} href="/">
                                {tNav('home')}
                            </Link>
                        </nav>

                        <div className={styles.text_content}>
                            <h1>{type}</h1>

                            <p>
                                {type === 'questioplususage'
                                    ? t('descriptionUsage')
                                    : t('descriptionPlus')}
                            </p>

                            <CurrencySelector
                                className={styles.currency_selector}
                                activeClassName={styles.currency_active}
                            />
                        </div>
                    </header>

                    {premium && (
                        <p className={styles.hasPremium}>
                            {t('hasPremium')}
                        </p>
                    )}

                    {!premium && (
                        <SubscriptionForm
                            publicKey={publicKey}
                            styles={styles}
                            type={type}
                        />
                    )}
                </main>
            </div>
        </SubscriptionCurrencyProvider>
    )
}