import React from 'react'
import styles from './subscription.module.scss'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { getPublicKey } from './actions'
import SubscriptionForm from '@/components/Subscription/subscription-form'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'

interface IProps {
    params: Promise<{
        locale: string,
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
        getTranslations({ locale, namespace: "SubscriptionPage" }),
    ])

    const publicKey = await fetchPublicKey()
    const res = await verifyUserPremium(false)
    const premium = res.err ? false : res.premium?.premium || false

    return (
        <div className={styles.container}>
            <main className={styles.content}>
                <header className={styles.header_subscription}>
                    <nav>
                        <Link locale={locale} href={'/'}>{tNav('home')}</Link>
                    </nav>
                    <div className={styles.text_content}>
                        <h1>{type}</h1>
                        <p>
                            {type == 'questioplususage' ? t('descriptionUsage') : t('descriptionPlus')}
                        </p>
                    </div>
                </header>

                {premium && <p className={styles.hasPremium}>{t('hasPremium')}</p>}

                {!premium && <SubscriptionForm
                    publicKey={publicKey}
                    styles={styles}
                    type={type}
                />}
            </main>
        </div>
    )
}