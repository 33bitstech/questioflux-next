'use client'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import {PaymentElement, useCheckout} from '@stripe/react-stripe-js'
import { useUser } from '@/contexts/userContext'
import EmailInput from './Inputs/email-input'
import PayButton from './Inputs/pay-button'

export default function CheckoutForm({type_subs} : {type_subs: string}) {
    const {theme} = useTheme(),
        checkout = useCheckout(),
        [email, setEmail] = useState<string>(''),
        {token} = useUser()
        

    useEffect(()=>{
        checkout.changeAppearance({
            theme: theme == 'light' ? 'stripe' : 'night',
            variables: {
                colorPrimary: '#00E4FF'
            }
        })
    },[])

    return (
        <>
            <form onSubmit={e=>e.preventDefault()}>
                <EmailInput onEmailChange={setEmail} emailValue={email}/>
                <PaymentElement options={{layout:'accordion'}}/>
                <PayButton type_subs={type_subs} email={email} />
            </form>
        </>
    )
}
