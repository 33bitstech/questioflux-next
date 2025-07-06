import React from 'react'
import styles from './config.module.scss'
import FormsUpdataUser from '@/components/Config/forms-update-user'
import SubscriptionContainer from '@/components/Config/subscription-container'
import AccountWidgetContainer from '@/components/Config/account-widget-container'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

interface IProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'configPage' });
    return {
        title: t('metadataTitle')
    }
}

export default async function Config({ params }: IProps) {
    const {locale} = await params
    const t = await getTranslations({ locale, namespace: 'configPage.main' });

    return (
        <main className={styles.content}>
            <FormsUpdataUser 
                styles={styles}
            />

            <div className={styles.subscription}>
                <h2>{t('subscriptionsTitle')}</h2>
                <SubscriptionContainer 
                    styles={styles}
                />
            </div>

            <AccountWidgetContainer
                styles={styles}
            />
        </main>
    )
}