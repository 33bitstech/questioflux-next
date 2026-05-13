'use client'
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutProvider } from '@stripe/react-stripe-js';
import { TStyles } from '@/types/stylesType';
import { useCallback } from 'react';
import ChooseMethod from './choose-method';

const getStripe = (publicKey: string) => {
    return loadStripe(publicKey);
};

interface IProps {
    publicKey: string;
    type: string;
    token: string;
    styles: TStyles; 
}

export default function SubscriptionForm({publicKey, styles, token, type}:IProps){

    const fetchClientSecret = useCallback(async () => {
        const res = await fetch('/api/subscription/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, token }),
        })
        const data = await res.json()

        if (!res.ok || !data?.clientSecret) {
            throw new Error(data?.error || 'Falha ao obter client secret do Stripe.')
        }

        return data.clientSecret
    }, [type, token])

    const options = {
        fetchClientSecret,
    }

    return (
        <CheckoutProvider stripe={getStripe(publicKey)} options={options}>
            <ChooseMethod
                styles={styles}
                type={type}
            />
        </CheckoutProvider>
    )

}