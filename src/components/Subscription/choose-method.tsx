'use client'
import { TStyles } from '@/types/stylesType'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import CheckoutForm from './checkout-form'

interface IProps {
    styles : TStyles,
    type: string
}

type TPaymentMethod = 'CREDIT_CARD' | "DEBIT_CARD" | "PIX"

export default function ChooseMethod({styles, type}: IProps) {
    const t = useTranslations('SubscriptionPage'),
        [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>(),
        [showDynamic, setShowDynamic] = useState(false)

    const handleCreditMethod = ()=>{
        setPaymentMethod('CREDIT_CARD')
        setShowDynamic(true)
    }

    return (
        <>
            <div className={`${styles.payments_container} ${showDynamic ? styles.selection_made : ''}`}>
                <div className={styles.payment_method}>
                    <h3>{t('textChooseMethod')}</h3>
                    <div className={styles.methods}>
                        <button 
                            className={`${paymentMethod === 'CREDIT_CARD' ? styles.methodActived : ''}`} 
                            onClick={handleCreditMethod}
                        >{t('buttons.creditCard')}</button>
                    </div>
                </div>

                <div className={`${styles.dynamic_itens} ${showDynamic ? styles.active : ''}`}>

                    <div className={styles.form}>
                        <CheckoutForm
                            type_subs={type}
                        />                           
                    </div>

                </div>

            </div>
        </>
    )
}
