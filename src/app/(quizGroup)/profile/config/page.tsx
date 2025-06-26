import React from 'react'
import styles from './config.module.scss'
import FormsUpdataUser from '@/components/Config/forms-update-user'
import SubscriptionContainer from '@/components/Config/subscription-container'
import AccountWidgetContainer from '@/components/Config/account-widget-container'

export default function Config() {

    return (
        <main className={styles.content}>
            <FormsUpdataUser 
                styles={styles}
            />

            <div className={styles.subscription}>
                <h2>Subscriptions</h2>
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
