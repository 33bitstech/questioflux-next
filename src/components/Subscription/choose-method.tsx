'use client'
import { TStyles } from '@/types/stylesType'
import { useLocale, useTranslations } from 'next-intl'
import React, { useState } from 'react'
import CheckoutForm from './checkout-form'
import { CheckoutElementsProvider } from '@stripe/react-stripe-js/checkout'
import { loadStripe } from '@stripe/stripe-js'
import { useTheme } from 'next-themes'
import { locales } from 'zod/v4'

interface IProps {
    styles: TStyles
    type: string
    publicKey: string
}

const getStripe = (publicKey: string) => loadStripe(publicKey);

export default function ChooseMethod({ styles, type, publicKey }: IProps) {
    const t = useTranslations('SubscriptionPage'),
        locale = useLocale(),
        [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'>(),
        [showDynamic, setShowDynamic] = useState(false),
        [stripeData, setStripeData] = useState<{ clientSecret: string; sessionId: string } | null>(null),
        [loadingSession, setLoadingSession] = useState(false),
        { theme } = useTheme();

    const handleCreditMethod = async () => {
        setPaymentMethod('CREDIT_CARD')
        setShowDynamic(true)

        if (stripeData) return;

        setLoadingSession(true)
        try {
            const res = await fetch('/api/subscription/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type, locale}),
            })
            console.log(await res.text())
            const data = await res.json()
            if (!res.ok || !data?.clientSecret || !data?.id) {
                throw new Error(data?.error || 'Falha ao obter parâmetros do Stripe.')
            }

            setStripeData({
                clientSecret: data.clientSecret,
                sessionId: data.id
            })

        } catch (err) {
            console.error("Erro ao inicializar sessão do Stripe:", err)
        } finally {
            setLoadingSession(false)
        }
    }

    // appearance agora fica dentro de elementsOptions (nova API do Stripe)
    const providerOptions = stripeData ? {
        clientSecret: stripeData.clientSecret,
        elementsOptions: {
            appearance: {
                theme: (theme === 'light' ? 'stripe' : 'night') as 'stripe' | 'night',
                variables: {
                    colorPrimary: '#00E4FF'
                }
            }
        }
    } : undefined;

    return (
        <div className={`${styles.payments_container} ${showDynamic ? styles.selection_made : ''}`}>
            <div className={styles.header_method}>
                <h3>{t('textChooseMethod')}</h3>
                <div className={styles.methods}>
                    <button
                        className={`${paymentMethod === 'CREDIT_CARD' ? styles.methodActived : ''}`}
                        onClick={handleCreditMethod}
                        disabled={loadingSession}
                    >
                        {loadingSession ? 'Carregando...' : t('buttons.creditCard')}
                    </button>
                </div>
            </div>

            <div className={`${styles.dynamic_itens} ${showDynamic ? styles.active : ''}`}>
                <div className={styles.form}>
                    {stripeData && providerOptions && (
                        <CheckoutElementsProvider stripe={getStripe(publicKey)} options={providerOptions}>
                            <CheckoutForm type_subs={type} sessionId={stripeData.sessionId} />
                        </CheckoutElementsProvider>
                    )}
                </div>
            </div>
        </div>
    )
}