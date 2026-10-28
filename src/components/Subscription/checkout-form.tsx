'use client'
import React, { useState } from 'react'
import { PaymentElement, useCheckoutElements } from '@stripe/react-stripe-js/checkout'
import EmailInput from './Inputs/email-input'
import PayButton from './Inputs/pay-button'
import { useTranslations } from 'next-intl'
import styles from './checkout-form.module.scss'

export default function CheckoutForm({ type_subs, sessionId }: { type_subs: string, sessionId: string }) {
    const [email, setEmail] = useState<string>('')
    const checkoutState = useCheckoutElements()
    const t = useTranslations('SubscriptionPage')

    if (checkoutState.type === 'loading') {
        return <div>Carregando...</div>
    }

    if (checkoutState.type === 'error') {
        return <div>Erro: {checkoutState.error.message}</div>
    }

    return (
        <form onSubmit={e => e.preventDefault()}>
            {/* o valor da própria sessão do Stripe: é exatamente o que vai ser cobrado */}
            <p className={styles.total}>
                {checkoutState.checkout.recurring?.interval === 'month'
                    ? t('totalPerMonth', { amount: checkoutState.checkout.total.total.amount })
                    : t('total', { amount: checkoutState.checkout.total.total.amount })}
            </p>
            <EmailInput
                onEmailChange={setEmail}
                emailValue={email}
                checkout={checkoutState.checkout}
            />
            <PaymentElement options={{ layout: 'accordion' }} />
            <PayButton type_subs={type_subs} email={email} sessionId={sessionId} />
        </form>
    )
}