import React from 'react'
import styles from './subscription.module.scss'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { clientSecretUsage, clientSessionAss, getPublicKey } from './actions'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import SubscriptionForm from '@/components/Subscription/subscription-form'
import { verifyUserPremium } from '@/app/[locale]/(quizGroup)/profile/config/actions'

interface IProps{
    params: Promise<{
        locale:string,
        type:string
    }>
}

async function getKey(token:string) {
    try {
        const {err, res} = await getPublicKey(token)
        if(err) throw err
        return res.public_key
    } catch (err) {
        console.log(err)
    }
}

export default async function Subscription({params}:IProps) {
    const {locale, type} = await params
    const [tNav, t, token] = await Promise.all([
        getTranslations({locale, namespace: 'navbar.asideMenu'}),
        getTranslations({locale, namespace: "SubscriptionPage"}),
        getCookie('token', { cookies })
    ])

    const publicKey = await getKey(`${token}`)

    const res = await verifyUserPremium(`${token}`, false),
        {premium} = res.premium



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
                            {
                                type == 'vortexplususage'
                                    ? t('descriptionUsage')
                                    : t('descriptionPlus')
                            }
                        </p>
                    </div>
                </header>

                {premium && <p className={styles.hasPremium}>
                    {t('hasPremium')}
                </p>}

                <SubscriptionForm 
                    publicKey={publicKey}
                    styles={styles}
                    token={`${token}`}
                    type={type}
                />

            </main>

        </div>
    )
}
