'use client'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import {PaymentElement} from '@stripe/react-stripe-js'
import EmailInput from './Inputs/email-input'
import PayButton from './Inputs/pay-button'

export default function CheckoutForm({type_subs, sessionId} : {type_subs: string, sessionId: string}) {
    const [email, setEmail] = useState<string>('')

    return (
        <>
            <form onSubmit={e=>e.preventDefault()}>
                <EmailInput onEmailChange={setEmail} emailValue={email}/>
                <PaymentElement options={{layout:'accordion'}}/>
                <PayButton type_subs={type_subs} email={email} sessionId={sessionId} />
            </form>
        </>
    )
}
