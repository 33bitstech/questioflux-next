import React from 'react'
import styles from './subscription.module.scss'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

interface IProps{
    params: Promise<{
        locale:string,
        type:string
    }>
}

export default async function Subscription({params}:IProps) {
    const {locale, type} = await params
    const tNav = await getTranslations({locale, namespace: 'navbar.asideMenu'});
    const t = await getTranslations({locale, namespace: "SubscriptionPage"})

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

                <div className={styles.payments_container}>
                    <div className={styles.paymentMethod}>
                        <h3>{t('textChooseMethod')}</h3>
                        <div className={styles.methods}>
                            <button 
                                /* className={`${paymentMethod === 'CREDIT_CARD' ? styles.methodActived : ''}`} 
                                onClick={handleCreditMethod} */
                            >{t('buttons.creditCard')}</button>
                        </div>
                    </div>

                </div>

            </main>

        </div>
    )
}
