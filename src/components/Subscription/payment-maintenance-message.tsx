'use client'

import { useTranslations } from 'next-intl'
import styles from './payment-maintenance-message.module.scss'

export default function PaymentMaintenanceMessage() {
    const t = useTranslations('SubscriptionPage.maintenance')

    return (
        <div className={styles.container}>
            <div className={styles.icon}>!</div>

            <div className={styles.content}>
                <h3>{t('title')}</h3>
                <p>{t('description')}</p>
            </div>
        </div>
    )
}