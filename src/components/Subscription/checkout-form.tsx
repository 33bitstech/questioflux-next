'use client'
import React, { useState } from 'react'
import { PaymentElement, useCheckoutElements } from '@stripe/react-stripe-js/checkout'
import EmailInput from './Inputs/email-input'
import PayButton from './Inputs/pay-button'

export default function CheckoutForm({ type_subs, sessionId }: { type_subs: string, sessionId: string }) {
    const [email, setEmail] = useState<string>('')
    const checkoutState = useCheckoutElements()

    if (checkoutState.type === 'loading') {
        return <div>Carregando...</div>
    }

    if (checkoutState.type === 'error') {
        return <div>Erro: {checkoutState.error.message}</div>
    }

    return (
        <form onSubmit={e => e.preventDefault()}>
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