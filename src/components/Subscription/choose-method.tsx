'use client'
import { TStyles } from '@/types/stylesType'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import CheckoutForm from './checkout-form'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useTheme } from 'next-themes'
import { CheckoutElementsProvider } from '@stripe/react-stripe-js/checkout'

interface IProps {
    styles: TStyles
    type: string
    publicKey: string
}

const getStripe = (publicKey: string) => loadStripe(publicKey);

export default function ChooseMethod({ styles, type, publicKey }: IProps) {
    const t = useTranslations('SubscriptionPage'),
        [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'>(),
        [showDynamic, setShowDynamic] = useState(false),
        // Estado para armazenar as strings vindas do backend
        [stripeData, setStripeData] = useState<{ clientSecret: string; sessionId: string } | null>(null),
        [loadingSession, setLoadingSession] = useState(false),
        { theme } = useTheme();

    const handleCreditMethod = async () => {
        setPaymentMethod('CREDIT_CARD')
        setShowDynamic(true)

        // Evita disparar requisições repetidas se o usuário clicar no botão mais de uma vez
        if (stripeData) return;

        setLoadingSession(true)
        try {
            const res = await fetch('/api/subscription/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type }),
            })
            
            const data = await res.json()
            if (!res.ok || !data?.clientSecret) {
                throw new Error(data?.error || 'Falha ao obter parâmetros do Stripe.')
            }

            // Armazena os dados síncronos recebidos do backend
            setStripeData({
                clientSecret: data.clientSecret,
                sessionId: data.id // Alinhado com o 'id' retornado pelo seu método Payment backend
            })

        } catch (err) {
            console.error("Erro ao inicializar sessão do Stripe:", err)
        } finally {
            setLoadingSession(false)
        }
    }

    // Configuração de opções visuais extraídas do tema do app
    const providerOptions = stripeData ? {
        clientSecret: stripeData.clientSecret,
        appearance: {
            theme: (theme === 'light' ? 'stripe' : 'night') as 'stripe' | 'night',
            variables: {
                colorPrimary: '#00E4FF'
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
                    {/* Renderiza o fluxo de checkout apenas quando os dados síncronos existirem */}
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